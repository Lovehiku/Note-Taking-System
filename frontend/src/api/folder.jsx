import axios from "axios";

const API_URL = "http://localhost:5000/api/folders";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function getFolders(params) {
  const res = await api.get("/", { params: params || {} });
  return res.data.folders;
}

export async function createFolder(name) {
  const res = await api.post("/", { name });
  return res.data.folder;
}

export async function updateFolder(id, name) {
  const res = await api.put(`/${id}`, { name });
  return res.data.folder;
}

export async function deleteFolder(id) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
