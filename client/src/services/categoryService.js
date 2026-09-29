import api from "./api.js";

export const getCategories = async (params = {}) => (await api.get("/categories", { params })).data;
export const getCategory = async (id) => (await api.get(`/categories/${id}`)).data;
export const createCategory = async (category) => (await api.post("/categories", category)).data;
export const updateCategory = async (id, updates) => (
  await api.put(`/categories/${id}`, updates)
).data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;
