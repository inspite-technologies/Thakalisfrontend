import { API_BASE_URL } from '../services/api';

/**
 * Normalizes image URLs from the backend.

/**
 * Normalizes image URLs from the backend.
 * Fixes issues with missing hostnames, incorrect ports (7070, 7071, random ports), and common malformed paths.
 * 
 * @param {string} url - The raw URL or path from the backend
 * @returns {string} - The normalized URL or placeholder if invalid
 */
export const normalizeImageUrl = (url) => {
    if (!url) return '/product-placeholder.png';

    // 1. Handle already correct full URLs but with wrong ports
    if (url.startsWith('http')) {
        // If it's a localhost URL with a wrong port, rewrite it to the correct API base URL
        if (url.includes('localhost') && !url.includes(':5001')) {
            // Extract the path part
            const path = url.split('localhost')[1].replace(/^:\d+/, '');
            return `${API_BASE_URL}${path}`;
        }
        return url;
    }

    // 2. Handle Cloudinary or other external paths that might be missing protocol
    if (url.includes('cloudinary.com')) {
        return url.startsWith('http') ? url : `https://${url}`;
    }

    // 3. Handle local public assets (start with / and don't look like backend IDs/paths)
    const publicAssets = ['/product-placeholder.png', '/favicon.ico', '/hero-', '/logo'];
    if (publicAssets.some(asset => url.startsWith(asset))) {
        return url;
    }

    // 4. Handle known backend static paths
    // If it starts with /uploads or looks like a filename, assume backend
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
};
