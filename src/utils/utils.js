import { API_BASE_URL } from '../services/api.js';

/**
 * Normalizes image URLs from the backend.
 * Fixes issues with missing hostnames, port 7071, and common malformed paths.
 * 
 * @param {string} url - The raw URL or path from the backend
 * @returns {string} - The normalized URL or placeholder if invalid
 */
export const normalizeImageUrl = (url) => {
    // Debug log to verify new code is running
    console.log('🖼️ Normalizing:', url);

    if (!url) return '/product-placeholder.png';

    // 1. Handle already correct full URLs or local preview URLs
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
        // If it points to the old port 7071, fix it to 5001
        if (url.includes(':7071')) {
            return url.replace(':7071', ':5001');
        }
        return url;
    }

    // 2. Handle Cloudinary or other external paths that might be missing protocol
    if (url.includes('cloudinary.com')) {
        return url.startsWith('http') ? url : `https://${url}`;
    }

    // 3. Handle local public assets (start with / and don't look like backend IDs/paths)
    // Adjust this list based on your actual public folder structure
    const publicAssets = ['/product-placeholder.png', '/favicon.ico', '/hero-', '/logo'];
    if (publicAssets.some(asset => url.startsWith(asset))) {
        return url;
    }

    // 4. Handle known backend static paths
    // If it starts with /uploads or looks like a filename, assume backend
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
};
