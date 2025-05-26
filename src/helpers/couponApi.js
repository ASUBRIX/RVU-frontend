import httpClient from './httpClient';

const API_URL = '/api/admin/coupons';

export const getAllCoupons = () => {
  return httpClient.get(API_URL);
};

export const getCouponById = (id) => {
  return httpClient.get(`${API_URL}/${id}`);
};

export const createCoupon = (couponData) => {
  console.log(couponData);
  
  return httpClient.post(API_URL, couponData);
};

const formatDataForBackend = (data) => ({
  code: data.code,
  discount_type: data.discountType,
  discount_value: Number(data.discountValue),
  max_usage: data.usageLimit ? Number(data.usageLimit) : null,
  expiry_date: data.expirationDate,
  is_active: data.isActive,
});


export const updateCoupon = (id, couponData) => {
  return httpClient.put(`${API_URL}/${id}`, couponData);
};

export const deleteCoupon = (id) => {
  return httpClient.delete(`${API_URL}/${id}`);
};
