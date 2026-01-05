import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const api = axios.create({
  baseURL: API_URL
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all notes
export async function getNotes(params) {
  const res = await api.get("/", { params: params || {} });
  return res.data.notes;
}

// Create note
export async function createNote(note) {
  const res = await api.post("/", note);
  return res.data.note;
}

// Get single note
export async function getNote(id) {
  const res = await api.get(`/${id}`);
  return res.data;
}

// Update note
export async function updateNote(id, note) {
  const res = await api.put(`/${id}`, note);
  return res.data.note;
}

// Delete note
export async function deleteNote(id) {
  const res = await api.delete(`/${id}`);
  return res.data;
}
