const express = require("express");
const { readDados, writeDados } = require("../utils/storage");

const router = express.Router();

// GET /api/dados -> devolve o último estado salvo (ou null se nunca salvou nada ainda)
router.get("/", (req, res) => {
  try {
    const dados = readDados();
    res.json({ dados });
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    res.status(500).json({ erro: "Não foi possível ler os dados salvos." });
  }
});

// POST /api/dados -> grava o estado inteiro do painel, sobrescrevendo o anterior
// Usada tanto pelo botão "Salvar" (manual) quanto pelo auto-save (a cada mudança relevante)
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
