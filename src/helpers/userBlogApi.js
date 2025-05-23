import httpClient from "./httpClient";

export const fetchAllBlogs = async () => {
  const response = await httpClient.get('/api/user-blogs');
  return response.data;
};

export const fetchBlogById = async (id) => {
  const response = await httpClient.get(`/api/user-blogs/${id}`);
  return response.data;
};


