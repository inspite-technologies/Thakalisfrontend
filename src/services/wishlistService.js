import api from '../api/axios';

/**
 * Fetch wishlist items from backend
 */
export const fetchWishlistItems = async () => {
    const response = await api.get('/likes');
    return response.data;
};

/**
 * Add product to wishlist
 * @param {string} productId - Product ID to add
 */
export const addToWishlistApi = async (productId) => {
    const response = await api.post('/likes', { productId });
    return response.data;
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID to remove
 */
export const removeFromWishlistApi = async (productId) => {
    const response = await api.delete(`/likes/${productId}`);
    return response.data;
};

/**
 * Transform wishlist items from API response to frontend format
 * @param {Array} items - Raw wishlist items from API
 */
export const normalizeWishlistItems = (items) => {
    return items.map(item => {
        const p = item.productId;
        if (!p) return null;
        return {
            id: p._id,
            name: p.productName || p.name || 'Unnamed Product',
            price: p.price,
            image: p.image || (p.images && p.images.length > 0 ? p.images[0] : '/product-placeholder.jpg'),
            category: p.categoryName || p.category?.name || p.category?.categoryName || p.category || 'Uncategorized',
            shop: p.storeName || p.storeId?.storeName || p.shop || 'Unknown Store'
        };
    }).filter(Boolean);
};
