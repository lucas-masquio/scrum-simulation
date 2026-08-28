import { useEffect, useRef, useState } from "react";
import { buscarDados, salvarDados } from "../api";
import { AUTO_SAVE_DELAY_MS, construirDadosIniciais, garantirDadosCarregados } from "../models/modeloPainel";

export function ControladorPainel() {
  const [data, setData] = useState(() => construirDadosIniciais());
  const [tab, setTab] = useState("setup");
  const [fileName, setFileName] = useState("(nenhum arquivo carregado)");
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle");
  const autoSaveTimer = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    let ativo = true;
    buscarDados().then((dados) => {
      if (ativo && dados) { setData(garantirDadosCarregados(dados)); setFileName("dados salvos no servidor"); }
    }).catch((error) => console.error("Não foi possível carregar dados do servidor:", error)).finally(() => {
      if (ativo) setLoadingInicial(false);
    });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return undefined; }
    if (loadingInicial) return undefined;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      salvarDados(data).then(() => setSaveStatus("saved")).catch((error) => { console.error("Falha no salvamento automático:", error); setSaveStatus("erro"); });
    }, AUTO_SAVE_DELAY_MS);
    return () => clearTimeout(autoSaveTimer.current);
  }, [data, loadingInicial]);

  function atualizarCaminho(path, value) {
    setData((current) => {
      const next = structuredClone(current); const parts = path.split("."); let cursor = next;
      for (let index = 0; index < parts.length - 1; index += 1) cursor = cursor[parts[index]];
      cursor[parts.at(-1)] = value; return next;
    });
  }

  function renomearEmpresa(which, novoNome) {
    setData((current) => {
      const oldVal = current.meta[which]; const cleanName = novoNome.trim();
      if (!cleanName || cleanName === oldVal) return current;
      const next = structuredClone(current); const rename = (value) => value === oldVal ? cleanName : value;
      ["sm", "owner", "po", "dev", "buyerProduct"].forEach((key) => next[key].forEach((row) => { row.empresa = rename(row.empresa); }));
      next.alunos.forEach((aluno) => { aluno.empresa = rename(aluno.empresa); });
      next.corrupcao.empresaCorruptora = rename(next.corrupcao.empresaCorruptora); next.sabotagem.empresaSabotador = rename(next.sabotagem.empresaSabotador);
      next.teamNames[cleanName] = next.teamNames[oldVal] || { Caça: "", Transporte: "" }; delete next.teamNames[oldVal]; next.meta[which] = cleanName; return next;
    });
  }

  function atualizarNomeTime(empresa, time, value) { setData((current) => ({ ...current, teamNames: { ...current.teamNames, [empresa]: { ...current.teamNames[empresa], [time]: value } } })); }
  async function salvarPainel() { setSaveStatus("saving"); try { await salvarDados(data); setSaveStatus("saved"); } catch (error) { console.error("Falha ao salvar manualmente:", error); setSaveStatus("erro"); window.alert("Não foi possível salvar no servidor. Verifique se o backend está rodando."); } }
  function exportarBackup() { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); const turma = (data.meta.turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_"); anchor.href = url; anchor.download = `scrum_simulacao_${turma}.json`; anchor.click(); URL.revokeObjectURL(url); }
  function carregarDados(file) { const reader = new FileReader(); reader.onload = (event) => { try { setData(garantirDadosCarregados(JSON.parse(event.target.result))); setFileName(file.name); } catch { window.alert("Não foi possível ler este arquivo. Verifique se é um .json válido."); } }; reader.readAsText(file); }
  function limparDados() { if (window.confirm("Isso apaga todos os dados lançados nesta sessão. Continuar?")) { setData(construirDadosIniciais()); setFileName("(nenhum arquivo carregado)"); setTab("setup"); } }
  function alterarTamanhoFonte(delta) { atualizarCaminho("meta.fontScale", Math.max(12, Math.min(24, data.meta.fontScale + delta))); }
  return { data, tab, setTab, fileName, loadingInicial, saveStatus, atualizarCaminho, renomearEmpresa, atualizarNomeTime, salvarPainel, exportarBackup, carregarDados, limparDados, alterarTamanhoFonte };
}
