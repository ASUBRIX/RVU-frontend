import httpClient from '@/helpers/httpClient';

export const getBlogs = () => httpClient.get('/api/blogs');
export const createBlog = (data) => httpClient.post('/api/blogs', data);
export const updateBlog = (id, data) => httpClient.put(`/api/blogs/${id}`, data);
export const deleteBlog = (id) => httpClient.delete(`/api/blogs/${id}`);
