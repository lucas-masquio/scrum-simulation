require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dadosRouter = require("./routes/dados");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/dados", dadosRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
