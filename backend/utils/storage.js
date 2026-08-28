
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
