import { API_BASE_URL, getAuthHeaders, getAuthHeaderOnly, isAuthenticated } from './api';

const LIKES_URL = `${API_BASE_URL}/likes`;

/**
 * Fetch wishlist items from backend
 */
export const fetchWishlistItems = async () => {
    if (!isAuthenticated()) return null;

    const response = await fetch(LIKES_URL, {
        headers: getAuthHeaderOnly()
    });
    return response.json();
};

/**
 * Add product to wishlist
 * @param {string} productId - Product ID to add
 */
export const addToWishlistApi = async (productId) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(LIKES_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId })
    });
    return response.json();
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID to remove
 */
export const removeFromWishlistApi = async (productId) => {
    if (!isAuthenticated()) return null;

    const response = await fetch(`${LIKES_URL}/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaderOnly()
    });
    return response.json();
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
