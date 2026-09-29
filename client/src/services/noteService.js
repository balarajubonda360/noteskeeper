import api from "./api.js";

export const getNotes = async (params = {}) => (await api.get("/notes", { params })).data;
export const getNote = async (id) => (await api.get(`/notes/${id}`)).data;
export const createNote = async (note) => (await api.post("/notes", note)).data;
export const updateNote = async (id, updates) => (await api.put(`/notes/${id}`, updates)).data;
export const deleteNote = async (id) => (await api.delete(`/notes/${id}`)).data;
export const searchNotes = async (q, params = {}) => (
  await api.get("/notes/search", { params: { ...params, q } })
).data;
export const changeStatus = async (id, status) => (
  await api.patch(`/notes/${id}/status`, { status })
).data;
export const getStats = async () => (await api.get("/notes/stats")).data;
export const filterNotes = async (params = {}) => (await api.get("/notes/filter", { params })).data;
