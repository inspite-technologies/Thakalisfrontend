import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Star, Plus, Minus, Heart, Clock, ChevronDown, X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { toast } from '../components/ui/sonner';
import { normalizeImageUrl } from '../utils/utils.js';

import api from '../api/axios';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialCategoryId = searchParams.get('categoryId');
  const initialStoreId = searchParams.get('storeId');
  const initialSearchQuery = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || 'all');
  const [selectedShop, setSelectedShop] = useState(initialStoreId || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const { addToCart, toggleWishlist, isInWishlist, cart, updateQuantity, isLoggedIn, isRegistered } = useStore();

  // Update selection if URL params change
  useEffect(() => {
    setSelectedCategory(initialCategoryId || 'all');
    setSelectedShop(initialStoreId || 'all');
    setSearchQuery(initialSearchQuery || '');
    setCurrentPage(1);
  }, [initialCategoryId, initialStoreId, initialSearchQuery]);

  // Update URL when filters change
  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.category) {
      if (updates.category === 'all') newParams.delete('categoryId');
      else newParams.set('categoryId', updates.category);
    }

    if (updates.store) {
      if (updates.store === 'all') newParams.delete('storeId');
      else newParams.set('storeId', updates.store);
    }

    if (updates.search !== undefined) {
      if (!updates.search) newParams.delete('search');
      else newParams.set('search', updates.search);
    }

    setSearchParams(newParams);
  };


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/products';
      const params = new URLSearchParams();

      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory);
      if (selectedShop !== 'all') params.append('storeId', selectedShop);

      if (searchQuery) {
        if (selectedShop !== 'all') {
          // Store specific search
          endpoint = '/stores/products/search';
          params.append('search', searchQuery);
        } else {
          // Global search - Use client-side filtering workaround
          endpoint = '/products';
          params.set('limit', '1000');
        }
      }

      const isGlobalSearch = searchQuery && selectedShop === 'all';

      if (!isGlobalSearch) {
        params.append('page', currentPage);
        params.append('limit', ITEMS_PER_PAGE);
      }



      const response = await api.get(`${endpoint}?${params.toString()}`);
      const result = response.data;

      let productsData = result.data || [];

      // Apply client-side filtering for global search if needed
      if (searchQuery && selectedShop === 'all' && productsData.length > 0) {
        const lowerQuery = searchQuery.toLowerCase();
        productsData = productsData.filter(p =>
          (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
          (p.productName && p.productName.toLowerCase().includes(lowerQuery)) ||
          (p.storeName && p.storeName.toLowerCase().includes(lowerQuery))
        );
      }

      if (productsData) {
        // Robust normalization
        const normalized = productsData.map(p => ({
          id: p._id,
          name: p.name || p.productName || 'Unnamed Product',
          price: p.price,
          image: normalizeImageUrl(p.image || (p.images && p.images[0]) || null),
          category: p.categoryName || (p.category && p.category.name) || 'Uncategorized',
          shop: p.storeName || (p.storeId && p.storeId.storeName) || 'Unknown Store',
          rating: p.rating || 4.5,
          stock: p.quantity !== undefined ? p.quantity : 0,
          discount: p.discount || 0,
          originalPrice: p.originalPrice || Math.round(p.price * 1.2)
        }));

        setProducts(normalized);

        // Populate filters if they are empty (only for main products endpoint usually)
        if (result.filters?.categories && result.filters.categories.length > 0) {
          setCategories(result.filters.categories.map(c => ({ id: c._id, name: c.name })));
        }
        if (result.pagination && !isGlobalSearch) {
          setServerTotalPages(result.pagination.totalPages);
        }

        // Populate filters if they are empty (only for main products endpoint usually)
        if (result.filters?.categories && result.filters.categories.length > 0) {
          setCategories(result.filters.categories.map(c => ({ id: c._id, name: c.name })));
        }
        if (result.filters?.stores && result.filters.stores.length > 0) {
          setShops(result.filters.stores.map(s => ({ id: s._id, name: s.name })));
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedShop, searchQuery, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [sortBy, products]);

  const handleAddToCart = (product) => {
    if (!isRegistered) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    if (product.stock <= 0) {
      toast.error('Item is out of stock');
      return;
    }
    addToCart(product, 1);
  };

  const findQuantity = (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleUpdateQuantity = (productId, delta) => {
    const currentQty = findQuantity(productId);
    updateQuantity(productId, currentQty + delta);
  };

  const handleToggleWishlist = (product) => {
    if (!isRegistered) {
      toast('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="section-container py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">All Products</h1>
          <p className="text-[#666666] mt-1">
            {filteredProducts.length} products available
          </p>
        </div>
      </div>

      <div className="section-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Backdrop */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Filter Sidebar / Drawer */}
          <div className={`
            fixed lg:sticky lg:top-24 lg:z-30 lg:h-[calc(100vh-120px)] inset-y-0 left-0 z-50 w-[280px] lg:w-64 bg-white lg:bg-transparent shadow-2xl lg:shadow-none 
            transform transition-transform duration-300 ease-in-out lg:transform-none flex-shrink-0
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full overflow-y-auto lg:overflow-y-auto bg-white rounded-r-2xl lg:rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[#1A1A1A]">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-[#F5F5F5] rounded-lg text-[#666666]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#666666] mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { updateUrlParams({ category: 'all' }); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === 'all'
                      ? 'bg-[#E8F5F1] text-[#006A52] font-medium'
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => { updateUrlParams({ category: category.id }); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.id
                        ? 'bg-[#E8F5F1] text-[#006A52] font-medium'
                        : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-[#666666] mb-3">Stores</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { updateUrlParams({ store: 'all' }); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedShop === 'all'
                      ? 'bg-[#E8F5F1] text-[#006A52] font-medium'
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                      }`}
                  >
                    All Stores
                  </button>
                  {shops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => { updateUrlParams({ store: shop.id }); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedShop === shop.id
                        ? 'bg-[#E8F5F1] text-[#006A52] font-medium'
                        : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                        }`}
                    >
                      {shop.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#666666] hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 bg-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#006A52]/20"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
                </div>
              </div>
            </div>

            {(selectedCategory !== 'all' || selectedShop !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5F1] text-[#006A52] text-sm rounded-full">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => updateUrlParams({ search: '' })}
                      className="hover:bg-[#006A52]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5F1] text-[#006A52] text-sm rounded-full">
                    {categories.find((c) => c.id === selectedCategory)?.name || 'Category'}
                    <button
                      onClick={() => updateUrlParams({ category: 'all' })}
                      className="hover:bg-[#006A52]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedShop !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5F1] text-[#006A52] text-sm rounded-full">
                    {shops.find((s) => s.id === selectedShop)?.name || 'Store'}
                    <button
                      onClick={() => updateUrlParams({ store: 'all' })}
                      className="hover:bg-[#006A52]/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-[350px] animate-pulse shadow-sm" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {(searchQuery && selectedShop === 'all'
                  ? filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  : filteredProducts
                ).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <div
                      className="relative aspect-square bg-[#F5F5F5] overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={normalizeImageUrl(product.image)}
                        alt={product.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/product-placeholder.png';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.stock <= 0 ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-white/90 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Out of Stock
                          </span>
                        </div>
                      ) : product.stock < 10 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold border border-red-200 shadow-sm animate-pulse">
                            Only {product.stock} left!
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(product);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#FFF3ED] transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${isInWishlist(product.id)
                            ? 'fill-[#E85A24] text-[#E85A24]'
                            : 'text-[#666666]'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-3 h-3 text-[#999999]" />
                        <span className="text-xs text-[#999999]">{product.shop}</span>
                      </div>

                      <h3
                        className="font-medium text-[#1A1A1A] line-clamp-2 mb-2 cursor-pointer hover:text-[#006A52] transition-colors"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#006A52]">
                              ₹{product.price}
                            </span>
                          </div>
                        </div>
                        {isRegistered && findQuantity(product.id) > 0 ? (
                          <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateQuantity(product.id, -1);
                              }}
                              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors shadow-sm"
                            >
                              <Minus className="w-4 h-4 text-[#006A52]" />
                            </button>
                            <span className="w-6 text-center font-bold text-[#1A1A1A]">
                              {findQuantity(product.id)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateQuantity(product.id, 1);
                              }}
                              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#E8F5F1] transition-colors shadow-sm"
                            >
                              <Plus className="w-4 h-4 text-[#006A52]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={product.stock <= 0}
                            className={`w-10 h-10 bg-[#006A52] text-white rounded-xl flex items-center justify-center hover:bg-[#00523F] transition-colors hover:scale-105 active:scale-95 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-[#999999]" />
                </div>
                <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                  No products found
                </h3>
                <p className="text-[#666666]">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#E5E5E5] bg-white text-[#666666] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: (searchQuery && selectedShop === 'all') ? Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) : serverTotalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Show only a window of pages logic could go here, for now simple list
                    if (
                      pageNum === 1 ||
                      pageNum === ((searchQuery && selectedShop === 'all') ? Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) : serverTotalPages) ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? 'bg-[#006A52] text-white'
                            : 'bg-white text-[#666666] border border-[#E5E5E5] hover:bg-[#F5F5F5]'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="text-[#666666]">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, (searchQuery && selectedShop === 'all') ? Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) : serverTotalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === ((searchQuery && selectedShop === 'all') ? Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) : serverTotalPages)}
                  className="p-2 rounded-lg border border-[#E5E5E5] bg-white text-[#666666] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
