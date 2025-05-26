import httpClient from '@/helpers/httpClient';

export const getBlogs = () => httpClient.get('/api/admin/blogs');
export const createBlog = (data) => httpClient.post('/api/admin/blogs', data);
export const updateBlog = (id, data) => httpClient.put(`/api/admin/blogs/${id}`, data);
export const deleteBlog = (id) => httpClient.delete(`/api/admin/blogs/${id}`);
