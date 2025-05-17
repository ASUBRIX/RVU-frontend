import httpClient from './httpClient';

const API_URL = '/api/coupons';

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

export const updateCoupon = (id, couponData) => {
  return httpClient.put(`${API_URL}/${id}`, couponData);
};

export const deleteCoupon = (id) => {
  return httpClient.delete(`${API_URL}/${id}`);
};
