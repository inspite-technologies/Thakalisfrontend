import api from '../api/axios';
import { normalizeImageUrl } from '../utils/utils';

/**
 * Fetch cart items from backend
 */
export const fetchCartItems = async () => {
    // Add timestamp to prevent caching
    const response = await api.get(`/cart?t=${Date.now()}`);
    return response.data;
};

/**
 * Add product to cart
 * @param {string} productId - Product ID to add
 */
export const addToCartApi = async (productIdOrIds) => {
    const productIds = Array.isArray(productIdOrIds) ? productIdOrIds : [productIdOrIds];
    try {
        const response = await api.post('/cart', { productIds });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.msg || error.response.data.message;
            if (errorMessage) {
                throw new Error(errorMessage);
            }
        }
        throw error;
    }
};

/**
 * Update cart item quantity
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 */
export const updateCartQuantityApi = async (productId, quantity) => {
    console.log(`🛒 Updating cart item ${productId} to quantity ${quantity}`);
    try {
        const response = await api.put(`/cart/update/${productId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('❌ Cart update failed:', error);
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.msg || error.response.data.message;
            if (errorMessage) {
                throw new Error(errorMessage);
            }
        }
        throw error;
    }
};

/**
 * Remove item from cart (sets quantity to 0)
 * @param {string} productId - Product ID to remove
 */
export const removeFromCartApi = async (productId) => {
    return updateCartQuantityApi(productId, 0);
};

/**
 * Sync local cart with backend (if needed)
 * @param {Array} foodIds - List of product IDs from local cart
 */
export const syncCartApi = async (foodIds) => {
    if (!foodIds || foodIds.length === 0) return null;

    const response = await api.post('/cart/sync', { foodIds });
    return response.data;
};

export const normalizeCartItems = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map(item => ({
        _id: item.productId,
        product: {
            id: item.productId,
            name: item.productName || 'Product',
            price: item.price || 0,
            image: normalizeImageUrl(item.image),
            category: 'General',
            shop: item.storeName || 'Store'
        },
        quantity: item.quantity || 1,
        totalPrice: item.totalPrice || (item.quantity * item.price) || 0
    }));
};
