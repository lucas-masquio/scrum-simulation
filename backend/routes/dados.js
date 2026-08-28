const express = require("express");
const { readDados, writeDados } = require("../utils/storage");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const dados = readDados();
    res.json({ dados });
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    res.status(500).json({ erro: "Não foi possível ler os dados salvos." });
  }
});

router.post("/", (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== "object") {
      return res.status(400).json({ erro: "Corpo da requisição inválido." });
    }
    writeDados(dados);
    res.json({ ok: true, salvoEm: new Date().toISOString() });
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    res.status(500).json({ erro: "Não foi possível salvar os dados." });
  }
});

module.exports = router;
