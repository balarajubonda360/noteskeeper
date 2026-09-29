import api from "./api.js";

export const register = async (account) => (await api.post("/auth/register", account)).data;
export const login = async (credentials) => (await api.post("/auth/login", credentials)).data;
export const getMe = async () => (await api.get("/auth/me")).data;
