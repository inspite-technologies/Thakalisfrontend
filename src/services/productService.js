import { API_BASE_URL, getAuthHeaderOnly } from './api';

const PRODUCT_URL = `${API_BASE_URL}/products`;

/**
 * Fetch product details by ID
 * @param {string} productId - The ID of the product to fetch
 */
export const fetchProductDetailsApi = async (productId) => {
    try {
        const response = await fetch(`${PRODUCT_URL}/${productId}`, {
            headers: getAuthHeaderOnly()
        });
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Search products by query string
 * @param {string} query - The search query
 */
export const searchProductsApi = async (query) => {
    try {
        // Fallback to client-side filtering since /filter is broken on backend (field name mismatch)
        // Fetch a large number of products to filter
        const response = await fetch(`${PRODUCT_URL}?limit=1000`, {
            headers: getAuthHeaderOnly()
        });
        const result = await response.json();

        if (result.data) {
            const lowerQuery = query.toLowerCase();
            const filtered = result.data.filter(p =>
                (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
                (p.storeName && p.storeName.toLowerCase().includes(lowerQuery))
            );
            // Return in same format as /filter would have
            return { success: true, data: filtered };
        }
        return result;
    } catch (error) {
        console.error(`Error searching products for ${query}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all products (getting filters including stores)
 */
export const fetchAllProductsApi = async () => {
    try {
        const response = await fetch(`${PRODUCT_URL}`, {
            headers: getAuthHeaderOnly()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching all products:', error);
        return { success: false, error: error.message };
    }
};
