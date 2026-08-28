import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const client = axios.create({ baseURL: API_URL });

export async function buscarDados() {
  const response = await client.get("/api/dados");
  return response.data.dados;
}

export async function salvarDados(dados) {
  const response = await client.post("/api/dados", dados);
  return response.data;
}
