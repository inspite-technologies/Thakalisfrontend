import axios from 'axios';

export const getCurrentPosition = () => {
    // ... existing code ...
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export const getAddressFromCoords = async (lat, lng) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = response.data;

        if (data.error) {
            throw new Error(data.error);
        }

        // Construct a readable address string
        const address = data.address;
        const parts = [];

        if (address.road) parts.push(address.road);
        if (address.suburb) parts.push(address.suburb);
        if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
        if (address.state) parts.push(address.state);
        if (address.postcode) parts.push(address.postcode);

        return {
            formatted: data.display_name,
            short: parts.join(', '),
            details: data.address
        };
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        throw new Error('Failed to fetch address details');
    }
};
