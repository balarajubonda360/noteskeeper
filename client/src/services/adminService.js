import api from "./api.js";

export const getAdminUsers = async (params = {}) => (await api.get("/admin/users", { params })).data;
export const updateUserRole = async (id, role) => (await api.patch(`/admin/users/${id}/role`, { role })).data;
export const updateUserAccess = async (id, active) => (await api.patch(`/admin/users/${id}/access`, { active })).data;
export const getAdminNotes = async (params = {}) => (await api.get("/admin/notes", { params })).data;
export const deleteAdminNote = async (id) => (await api.delete(`/admin/notes/${id}`)).data;
