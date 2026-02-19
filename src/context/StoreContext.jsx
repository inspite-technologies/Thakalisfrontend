import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from '../components/ui/sonner';
import { mockUser, mockAddresses, mockOrders } from '../data/mockData.js';
import { normalizeImageUrl } from '../utils/utils.js';

// Import services
import {
  fetchCartItems,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  syncCartApi,
  normalizeCartItems
} from '../services/cartService';

import {
  fetchWishlistItems,
  addToWishlistApi,
  removeFromWishlistApi,
  normalizeWishlistItems
} from '../services/wishlistService';

import {
  requestOtpApi,
  verifyOtpApi,
  fetchUserDetailsApi,
  updateUserDetailsApi,
  normalizeUserData,
  normalizeAddresses
} from '../services/userService';

import {
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  setDefaultAddressApi
} from '../services/addressService';

import {
  getPaymentKeyApi,
  createOrderApi,
  verifyPaymentApi,
  paymentFailedApi,
  createRazorpayOptions,
  fetchOrdersApi,
  fetchOrderByIdApi
} from '../services/orderService';

import {
  fetchProductDetailsApi
} from '../services/productService';

/**
 * Normalize order data from backend to frontend format
 */
export const normalizeOrders = (backendOrders) => {
  if (!Array.isArray(backendOrders)) return [];

  return backendOrders.map(order => {
    // Backend provides address as a string, frontend expects an object
    const deliveryAddress = typeof order.address === 'string'
      ? { type: 'Delivery', fullAddress: order.address, landmark: '' }
      : (order.address || { type: 'Delivery', fullAddress: 'Address not available', landmark: '' });

    // Backend might provide items nested in vendorOrders
    let items = order.items || [];
    if (items.length === 0 && order.vendorOrders) {
      items = order.vendorOrders.flatMap(vendorOrder => vendorOrder.items || []);
    }

    return {
      id: order._id || order.id,
      orderId: order.orderId || order.razorpayOrderId || `ORD-${(order._id || order.id).slice(-6).toUpperCase()}`,
      orderDate: order.createdAt,
      status: order.orderStatus || order.status || 'Pending',
      total: order.totalAmount || order.amount || 0,
      subtotal: order.subtotal || order.totalAmount || order.amount || 0,
      deliveryFee: order.deliveryFee || 0,
      taxes: order.taxes || 0,
      items: items.map(item => ({
        productId: item.productId?._id || item.productId, // Preserve the actual productId
        status: item.status || 'Pending', // Preserve item status
        product: {
          id: item.productId?._id || item.productId,
          name: item.productName || item.productId?.productName || 'Product',
          price: item.price || item.productId?.price || 0,
          image: normalizeImageUrl(item.image || item.productId?.image)
        },
        quantity: item.quantity || 1
      })),
      deliveryAddress,
      paymentStatus: order.paymentStatus || 'Pending',
      paymentMethod: order.paymentMethod || 'Online Payment (Razorpay)',
      refunds: order.refunds || [], // Pass refund data
      razorpayPaymentId: order.razorpayPaymentId
    };
  });
};

const StoreContext = createContext(undefined);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryLocation, setDeliveryLocation] = useState('Select Location');

  const fetchCart = useCallback(async () => {
    try {
      const result = await fetchCartItems();
      console.log('🛒 Fetch Cart Result:', result);

      if (result?.success && result.data && Array.isArray(result.data.items)) {
        // Only set cart if there are actual items
        if (result.data.items.length === 0) {
          console.log('🛒 Cart is empty from backend, clearing frontend cart');
          setCart([]);
        } else {
          const normalized = normalizeCartItems(result.data.items);
          console.log('🛒 Normalized Cart Items:', normalized.length, 'items');
          setCart(normalized);
        }
      } else {
        console.log('⚠️ Cart fetch returned empty or invalid data, clearing cart');
        setCart([]);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      setCart([]);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const result = await fetchWishlistItems();
      if (result?.data) {
        setWishlist(normalizeWishlistItems(result.data));
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const result = await fetchOrdersApi();
      if (result?.success && result.data) {
        const normalizedOrders = normalizeOrders(result.data);
        setOrders(normalizedOrders);

        // Enrich with images dynamically
        const productIds = new Set();
        normalizedOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.product.id) productIds.add(item.product.id);
          });
        });

        if (productIds.size > 0) {
          const productDetails = await Promise.all(
            Array.from(productIds).map(id => fetchProductDetailsApi(id))
          );

          const imageMap = {};
          productDetails.forEach(res => {
            if (res?.data) {
              // The backend returns normalized data in .data
              const id = res.data._id || res.data.id;
              imageMap[id] = res.data.image;
            }
          });

          setOrders(prevOrders => prevOrders.map(order => ({
            ...order,
            items: order.items.map(item => ({
              ...item,
              product: {
                ...item.product,
                image: normalizeImageUrl(imageMap[item.product.id] || item.product.image)
              }
            }))
          })));
        }
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
    try {
      const result = await fetchUserDetailsApi();
      if (result?.data) {
        setUser(normalizeUserData(result.data));
        setAddresses(normalizeAddresses(result.data.addresses));
      }
    } catch (error) {
      console.error('Fetch user details error:', error);
    }
  }, []);

  useEffect(() => {
    const initStore = async () => {
      const token = localStorage.getItem('token');
      const tokenType = localStorage.getItem('tokenType');

      if (token) {
        setIsLoggedIn(true);
        if (tokenType === 'guest') {
          setIsGuest(true);
        } else {
          setIsGuest(false);
        }
      }
    };
    initStore();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
      fetchCart();
      fetchUserDetails();
      fetchOrders();
    }
  }, [isLoggedIn, fetchWishlist, fetchCart, fetchUserDetails, fetchOrders]);

  const requestOTP = useCallback(async (phone) => {
    try {
      const data = await requestOtpApi(phone);
      console.log("OTP received (debug):", data.otp);
      return true;
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    }
  }, []);

  const login = useCallback(async (phone, otp) => {
    try {
      const data = await verifyOtpApi(phone, otp);
      if (data.data) {
        setUser(normalizeUserData(data.data));
        setIsLoggedIn(true);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('tokenType', 'registered');
          setIsGuest(false);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setIsGuest(false);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
  }, []);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error('Please login to add to cart');
      return;
    }

    const productId = product.id || product._id;

    // Optimistic Update
    const previousCart = [...cart];
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, {
          product: { ...product, id: productId },
          quantity
        }];
      }
    });

    // Immediate Feedback
    toast.success(`${quantity > 1 ? quantity + ' x ' : ''}${product.name || 'Item'} added to cart`);

    try {
      // Background Sync
      const existingItem = previousCart.find(item => item.product.id === productId);
      let result;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        result = await updateCartQuantityApi(productId, newQuantity);
      } else {
        result = await addToCartApi(productId);
        if (result?.success && quantity > 1) {
          await updateCartQuantityApi(productId, quantity);
        }
      }

      if (!result?.success) {
        throw new Error(result?.msg || 'Failed to update cart');
      }

      // Silent sync to ensure consistency
      const cartResult = await fetchCartItems();
      if (cartResult?.success && cartResult.data) {
        setCart(normalizeCartItems(cartResult.data.items));
      }
    } catch (error) {
      console.error('Add to cart backend error:', error);
      // Revert optimistic update
      setCart(previousCart);
      toast.error('Failed to add to cart');
    }
  }, [isLoggedIn, cart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!isLoggedIn) {
      toast.error('Please login to update cart');
      return;
    }

    // Optimistic Update
    const previousCart = [...cart];

    if (quantity <= 0) {
      // Optimistic Remove
      setCart(prev => prev.filter(item => item.product.id !== productId));
      toast.success('Removed from cart');
    } else {
      // Optimistic Update Quantity
      setCart(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }

    try {
      const result = await updateCartQuantityApi(productId, quantity);

      if (!result?.success) {
        throw new Error(result?.msg || 'Failed to update quantity');
      }

      // Silent sync
      const cartResult = await fetchCartItems();
      if (cartResult?.success && cartResult.data) {
        setCart(normalizeCartItems(cartResult.data.items));
      }
    } catch (error) {
      console.error('Update quantity backend error:', error);
      // Revert optimistic update
      setCart(previousCart);
      toast.error(error.message || 'Failed to update quantity');
    }
  }, [isLoggedIn, cart]);

  const removeFromCart = useCallback(async (productId) => {
    if (!isLoggedIn) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }

    // Optimistic Update
    const previousCart = [...cart];
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Removed from cart');

    try {
      const result = await removeFromCartApi(productId);

      if (!result?.success) {
        throw new Error(result?.msg || 'Failed to remove item');
      }

      // Silent sync
      const cartResult = await fetchCartItems();
      if (cartResult?.success && cartResult.data) {
        setCart(normalizeCartItems(cartResult.data.items));
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      // Revert optimistic update
      setCart(previousCart);
      toast.error('Failed to remove item');
    }
  }, [isLoggedIn, cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = useCallback(async (product) => {
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      return;
    }

    const productId = product.id || product._id;
    const isLiked = wishlist.some(item => (item.id || item._id) === productId);
    const token = localStorage.getItem('token');

    // Update local state first for responsiveness
    if (isLiked) {
      setWishlist(prev => prev.filter(item => (item.id || item._id) !== productId));
      toast.success(`${product.name || 'Item'} removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success(`${product.name || 'Item'} added to wishlist`);
    }

    // Sync with backend if logged in
    if (token) {
      try {
        if (isLiked) {
          await removeFromWishlistApi(productId);
        } else {
          await addToWishlistApi(productId);
        }
      } catch (error) {
        console.error('Toggle wishlist backend error:', error);
      }
    }
  }, [isLoggedIn, wishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => (item.id || item._id) === productId);
  }, [wishlist]);

  const updateUserDetails = useCallback(async (details) => {
    try {
      const result = await updateUserDetailsApi(details);
      if (result?.response?.status === 200) {
        // Optimistic update
        setUser(prev => ({ ...prev, ...details }));
        // await sync
        await fetchUserDetails();
        toast.success('User details updated successfully');
        return true;
      }
      toast.error(result?.data?.msg || 'Failed to update profile');
      return false;
    } catch (error) {
      console.error('Update user details error:', error);
      return false;
    }
  }, [fetchUserDetails]);

  const addAddress = useCallback(async (addressData) => {
    try {
      const result = await addAddressApi(addressData);
      if (result?.response?.status === 200 || result?.response?.status === 201) {
        fetchUserDetails();
        return true;
      }
      toast.error(result?.data?.msg || 'Failed to add address');
      return false;
    } catch (error) {
      console.error('Add address error:', error);
      return false;
    }
  }, [fetchUserDetails]);

  const updateAddress = useCallback(async (id, addressData) => {
    try {
      const result = await updateAddressApi(id, addressData);
      if (result?.response?.status === 200) {
        fetchUserDetails();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update address error:', error);
      return false;
    }
  }, [fetchUserDetails]);

  const deleteAddress = useCallback(async (id) => {
    try {
      const response = await deleteAddressApi(id);
      if (response?.status === 200) {
        fetchUserDetails();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete address error:', error);
      return false;
    }
  }, [fetchUserDetails]);

  const setDefaultAddress = useCallback(async (id) => {
    try {
      const response = await setDefaultAddressApi(id);
      if (response?.status === 200) {
        fetchUserDetails();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Set default address error:', error);
      return false;
    }
  }, [fetchUserDetails]);

  const placeOrder = useCallback(async (orderData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to place an order');
      return;
    }

    try {
      // ═══════════════════════════════════════════════════════════════
      // STEP 1: CREATE ORDER ON BACKEND
      // Backend: createOrder() - Creates Order document, gets Razorpay ID
      // ═══════════════════════════════════════════════════════════════
      console.log('📦 STEP 1: Creating order on backend...');
      const addressId = orderData.deliveryAddress._id || orderData.deliveryAddress.id;
      const orderResult = await createOrderApi(addressId);

      if (!orderResult?.success) {
        throw new Error(orderResult?.msg || 'Failed to create order');
      }

      const { razorpay, order } = orderResult;

      if (!razorpay || !razorpay.orderId) {
        throw new Error('Invalid order response from server');
      }

      console.log('✅ Order created:', {
        orderId: order._id || order.orderId,
        razorpayOrderId: razorpay.orderId,
        amount: razorpay.amount / 100 + ' INR'
      });

      console.log('📸 Order items available for potential recovery from backend');

      const restoreCartFromOrder = async (orderItems) => {
        if (!orderItems || orderItems.length === 0) return;
        console.log('🔄 Restoring cart using items from backend order...');
        try {
          // Flatten items from all vendor orders
          const itemsToRestore = orderItems.flatMap(vo => vo.items.map(item => ({
            id: item.productId,
            quantity: item.quantity
          })));

          // 1. Add all items back in bulk
          const productIds = itemsToRestore.map(item => item.id);
          await addToCartApi(productIds);

          // 2. Update quantities for items with quantity > 1
          for (const item of itemsToRestore) {
            if (item.quantity > 1) {
              await updateCartQuantityApi(item.id, item.quantity);
            }
          }
          await fetchCart();
          console.log('✅ Cart restored successfully');
        } catch (err) {
          console.error('❌ Failed to restore cart:', err);
        }
      };

      // ═══════════════════════════════════════════════════════════════
      // STEP 2: OPEN RAZORPAY CHECKOUT (Frontend)
      // Frontend handles the payment popup
      // ═══════════════════════════════════════════════════════════════
      console.log('💳 STEP 2: Opening Razorpay checkout...');
      console.log('🔑 Razorpay Key:', razorpay.key); // Debug log

      return new Promise((resolve, reject) => {
        let hasSucceeded = false;
        let hasFailed = false;
        let lastError = null;

        const options = createRazorpayOptions({
          key: razorpay.key,
          amount: razorpay.amount,
          currency: razorpay.currency || 'INR',
          orderId: razorpay.orderId,
          user: user || { name: 'Customer', phone: '' },

          // ═══════════════════════════════════════════════════════════
          // STEP 3: VERIFY PAYMENT (Backend)
          // Backend: verifyPayment() - Verifies signature, updates order
          // ═══════════════════════════════════════════════════════════
          onSuccess: async function (response) {
            try {
              // 3. VERIFY PAYMENT (Backend)
              // Backend verifyPayment verifies signature and AUTOMATICALLY empties the cart.

              console.log('🔐 Verifying payment with backend...');
              const verifyResult = await verifyPaymentApi(response);

              if (verifyResult?.success) {
                console.log('✅ Payment verified!');
                hasSucceeded = true;
                const finalOrderId = order._id || order.id || order.orderId;

                // ═══════════════════════════════════════════════════════════════
                // FETCH CONFIRMED ORDER FROM BACKEND
                // The active cart is now empty on the backend.
                // We fetch the Created Order to display the "Ordered Cart" state.
                // ═══════════════════════════════════════════════════════════════
                let orderedCart;
                try {
                  const orderResponse = await fetchOrderByIdApi(finalOrderId); // Using new API
                  if (orderResponse?.success && orderResponse?.data && orderResponse.data.length > 0) {
                    const confirmedOrder = orderResponse.data[0]; // array of 1

                    // Map Order back to Cart structure
                    orderedCart = {
                      items: confirmedOrder.vendorOrders.flatMap(vendor =>
                        vendor.items.map(item => ({
                          product: {
                            id: item.productId._id,
                            name: item.productId.productName, // populated
                            price: item.productId.price,      // populated
                            image: null // verified: productService will handle images if missing, or use placeholder
                          },
                          quantity: item.quantity,
                          totalPrice: item.price * item.quantity
                        }))
                      ),
                      totalItems: confirmedOrder.vendorOrders.reduce((acc, v) => acc + v.items.reduce((sum, i) => sum + i.quantity, 0), 0),
                      cartTotalPrice: confirmedOrder.totalAmount,
                      status: 'ordered',
                    };
                  }
                } catch (fetchErr) {
                  console.error("Failed to fetch confirmed order:", fetchErr);
                  // No fallback - frontend will handle missing data or show error
                }

                if (!orderedCart) {
                  console.warn("⚠️ No orderedCart data available from backend");
                  // Ensure it's not undefined to avoid crashes, but empty
                  orderedCart = {
                    items: [],
                    totalItems: 0,
                    cartTotalPrice: 0,
                    status: 'ordered'
                  };
                }

                // Prepare result with orderedCart
                const orderResult = {
                  id: finalOrderId,
                  orderedCart: orderedCart
                };
                console.log('✅ Returning orderedCart with', orderedCart.totalItems, 'items from backend order');

                // Sync (will retrieve empty cart from backend - CORRECT BACKEND STATE)
                await fetchCart();

                // Refresh orders (will show Completed order)
                await fetchOrders();

                toast.success('Order placed successfully!');
                console.log('✅ Order flow complete! Order ID:', finalOrderId);
                resolve(orderResult);

              } else {
                console.error('❌ Payment verification failed:', verifyResult?.msg);
                toast.error(verifyResult?.msg || 'Payment verification failed');
                reject(new Error(verifyResult?.msg || 'Payment verification failed'));
              }
            } catch (error) {
              console.error('❌ Verification error:', error);
              toast.error('Payment verification error');
              reject(error);
            }
          },

          // ═══════════════════════════════════════════════════════════
          // STEP 4: PAYMENT CANCELLED/DISMISSED
          // Backend: paymentFailed() - Marks order failed, restores stock
          // ═══════════════════════════════════════════════════════════
          onDismiss: async function () {
            console.log('❌ STEP 4: Payment window closed');

            if (hasFailed || !hasSucceeded) {
              const errorToReport = hasFailed ? (lastError || 'Payment failed') : 'Payment cancelled';

              if (!hasFailed) toast.error('Payment cancelled');

              try {
                // 1. Notify backend
                await paymentFailedApi(razorpay.orderId, errorToReport);

                // 2. RESTORE CART FROM BACKEND ORDER DATA
                await restoreCartFromOrder(order.vendorOrders);

              } catch (err) {
                console.error('Failed to handle payment failure/cancellation:', err);
              }

              reject(new Error(errorToReport));
              return;
            }
          }
        });

        console.log('📝 FULL Razorpay Options:', options); // Debug full payload

        const rzp = new window.Razorpay(options);

        // ═══════════════════════════════════════════════════════════════
        // STEP 4 (Alternate): PAYMENT FAILED
        // Backend: paymentFailed() - Marks order failed, restores stock
        // ═══════════════════════════════════════════════════════════════
        rzp.on('payment.failed', async function (response) {
          const errorMsg = response.error.description || 'Payment failed';
          console.log('❌ STEP 4: Payment failed -', errorMsg);
          toast.error(errorMsg);

          hasFailed = true;
          lastError = errorMsg;

          try {
            await paymentFailedApi(razorpay.orderId, errorMsg);
          } catch (e) { }

          rzp.close();
        });

        rzp.open();
      });

    } catch (error) {
      console.error('❌ Order flow error:', error);
      toast.error(error.message || 'Failed to place order');
      await fetchCart(); // Refresh cart state
      throw error;
    }
  }, [user, fetchCart, fetchOrders]);


  return (
    <StoreContext.Provider
      value={{
        user,
        isLoggedIn,
        isGuest,
        isRegistered: isLoggedIn && !isGuest,
        login,
        requestOTP,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        updateUserDetails,
        orders,
        setOrders,
        placeOrder,
        deliveryLocation,
        setDeliveryLocation,
        fetchUserDetails,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
