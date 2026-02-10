import { API_BASE_URL, getAuthHeaders, getAuthHeaderOnly, isAuthenticated } from './api';
import { normalizeImageUrl } from '../utils/utils';

const CART_URL = `${API_BASE_URL}/cart`;

/**
 * Fetch cart items from backend
 */
export const fetchCartItems = async () => {
    if (!isAuthenticated()) return null;

    // Add timestamp to prevent caching
    const response = await fetch(`${CART_URL}?t=${Date.now()}`, {
        headers: getAuthHeaders()
    });
    return response.json();
};

/**
 * Add product to cart
 * @param {string} productId - Product ID to add
 */
export const addToCartApi = async (productId) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(CART_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productIds: [productId] })
    });
    return response.json();
};

/**
 * Update cart item quantity
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 */
export const updateCartQuantityApi = async (productId, quantity) => {
    if (!isAuthenticated()) return null;

    console.log(`🛒 Updating cart item ${productId} to quantity ${quantity}`);
    const response = await fetch(`${CART_URL}/update/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
    });
    const data = await response.json();
    if (!response.ok) {
        console.error('❌ Cart update failed:', data);
    }
    return data;
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
    if (!isAuthenticated() || !foodIds || foodIds.length === 0) return null;

    const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ foodIds })
    });
    return response.json();
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
