// Persistência simples em arquivo JSON.
// Segue o mesmo princípio já usado no frontend para carregar a lista de
// alunos (ler um arquivo do disco e devolver os dados prontos para o
// estado do React): aqui fazemos a mesma coisa, só que para o painel
// inteiro, e também sabemos escrever de volta no arquivo.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "dados.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDados() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return null;

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  if (!raw.trim()) return null;

  return JSON.parse(raw);
}

function writeDados(dados) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2), "utf-8");
}

module.exports = { readDados, writeDados };
