import httpClient from './httpClient';

const BASE_URL = '/api/pricing-plans';

export const getPricingPlans = (courseId) => {
  return httpClient.get(`${BASE_URL}/${courseId}`);
};

export const createPricingPlan = (data) => {
  return httpClient.post(BASE_URL, data);
};

export const updatePricingPlan = (id, data) => {
  return httpClient.put(`${BASE_URL}/${id}`, data);
};

export const deletePricingPlan = (id) => {
  return httpClient.delete(`${BASE_URL}/${id}`);
};
