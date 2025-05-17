import axios from './httpClient';

const BASE_URL = '/api/pricing-plans';

export const getPricingPlans = (courseId) => {
  return axios.get(`${BASE_URL}/${courseId}`);
};

export const createPricingPlan = (data) => {
  return axios.post(BASE_URL, data);
};

export const updatePricingPlan = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

export const deletePricingPlan = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
