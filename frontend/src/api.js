import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const client = axios.create({ baseURL: API_URL });

// Busca o último estado salvo no backend. Retorna null se nunca foi salvo nada ainda
// (mesmo princípio da lista de alunos: "não achou arquivo -> usa os dados padrão").
export async function fetchDados() {
  const response = await client.get("/api/dados");
  return response.data.dados;
}

// Envia o estado inteiro do painel para o backend gravar em disco.
// Usada tanto pelo botão de salvar manual quanto pelo auto-save.
export async function saveDados(dados) {
  const response = await client.post("/api/dados", dados);
  return response.data;
}
