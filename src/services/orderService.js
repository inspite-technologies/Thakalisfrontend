import api from '../api/axios';

/**
 * Get Razorpay payment key
 */
export const getPaymentKeyApi = async () => {
    const response = await api.get('/order/payment');
    return response.data;
};

/**
 * Fetch all orders for the user
 */
export const fetchOrdersApi = async () => {
    const response = await api.get('/order');
    return response.data;
};

/**
 * Fetch a specific order by ID
 * @param {string} orderId - The order ID to fetch
 */
export const fetchOrderByIdApi = async (orderId) => {
    const response = await api.get(`/order?orderId=${orderId}`);
    return response.data;
};

/**
 * Create order on backend
 * @param {string} addressId - Delivery address ID
 */
export const createOrderApi = async (addressId) => {
    const response = await api.post('/order', { addressId });
    return response.data;
};

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Razorpay payment response data
 */
export const verifyPaymentApi = async (paymentData) => {
    const response = await api.post('/order/verify', {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature
    });
    return response.data;
};

/**
 * Notify backend of payment failure
 * @param {string} orderId - Razorpay Order ID
 * @param {string} reason - Failure reason
 */
export const paymentFailedApi = async (orderId, reason) => {
    const response = await api.post('/order/payment-failed', {
        razorpayOrderId: orderId,
        reason
    });
    return response.data;
};

/**
 * Initialize Razorpay checkout
 * @param {Object} options - Razorpay options
 * @returns {Promise} - Resolves with order ID on success
 */
export const initializeRazorpayCheckout = (options) => {
    return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
            reject(new Error(response.error.description || 'Payment failed'));
        });

        rzp.open();
    });
};

/**
 * Cancel a product in an order
 * @param {string} orderId - The order ID
 * @param {string} productId - The product ID to cancel
 */
export const cancelProductApi = async (orderId, productId) => {
    const response = await api.put(`/order/${orderId}/product/${productId}`, { status: 'Cancelled' });
    return response.data;
};

/**
 * Create Razorpay checkout options
 * @param {Object} params - Parameters for checkout
 */
export const createRazorpayOptions = ({
    key,
    amount,
    currency,
    orderId,
    user,
    onSuccess,
    onDismiss
}) => {
    const prefill = {};
    if (user?.name) prefill.name = user.name;
    if (user?.email) prefill.email = user.email;
    if (user?.phone) {
        // Ensure phone is a string and strip non-digit characters
        const phoneStr = String(user.phone);
        const cleanPhone = phoneStr.replace(/\D/g, '');
        // Only add if it looks like a valid phone number (at least 10 digits)
        if (cleanPhone.length >= 10) {
            prefill.contact = cleanPhone;
        }
    }

    return {
        key,
        amount,
        currency,
        name: "Thakkalies",
        description: "Grocery Order Payment",
        order_id: orderId,
        handler: onSuccess,
        prefill,
        theme: {
            color: "#006A52"
        },
        modal: {
            ondismiss: onDismiss
        }
    };
};
