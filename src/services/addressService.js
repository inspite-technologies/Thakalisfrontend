import api from '../api/axios';

/**
 * Add new address
 * @param {Object} addressData - Address data to add
 */
export const addAddressApi = async (addressData) => {
    const response = await api.post('/user/address', {
        name: addressData.name,
        addressType: addressData.type || 'home',
        fullAddress: addressData.fullAddress,
        city: addressData.city || 'Kochi',
        district: addressData.district || 'Ernakulam',
        state: addressData.state || 'Kerala',
        pincode: parseInt(addressData.pincode) || 0,
        landmark: addressData.landmark || '',
        phoneNumber: parseInt(addressData.phone?.replace(/\D/g, '')) || 0,
        isDefault: addressData.isDefault || false
    });
    return { response, data: response.data };
};

/**
 * Update existing address
 * @param {string} id - Address ID to update
 * @param {Object} addressData - New address data
 */
export const updateAddressApi = async (id, addressData) => {
    const response = await api.put(`/user/address/${id}`, {
        addressType: addressData.type,
        fullAddress: addressData.fullAddress,
        landmark: addressData.landmark,
        pincode: parseInt(addressData.pincode)
    });
    return { response, data: response.data };
};

/**
 * Delete address
 * @param {string} id - Address ID to delete
 */
export const deleteAddressApi = async (id) => {
    const response = await api.delete(`/user/address/${id}`);
    return response;
};

/**
 * Set address as default
 * @param {string} id - Address ID to set as default
 */
export const setDefaultAddressApi = async (id) => {
    const response = await api.patch(`/user/address/default/${id}`);
    return response;
};
