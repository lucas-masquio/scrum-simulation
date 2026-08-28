import { useRef } from "react";
import { TABS } from "../models/modeloPainel";

function StatusSalvamento({ status }) {
  const labels = {
    idle: "aguardando alterações",
    saving: "salvando...",
    saved: "salvo no servidor",
    erro: "falha ao salvar",
  };

  return <span className={`save-status save-status-${status}`}>{labels[status] || labels.idle}</span>;
}

export default function Cabecalho({ controller }) {
  const fileInput = useRef(null);

  function carregarArquivo(event) {
    const file = event.target.files[0];
    if (file) controller.carregarDados(file);
    event.target.value = "";
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Painel de Avaliação Scrum</h1>
          <div className="sub">
            {controller.fileName} · <StatusSalvamento status={controller.saveStatus} />
          </div>
        </div>

        <div className="topbar-actions">
          <button className="btn btn-save" type="button" onClick={controller.salvarPainel}>Salvar agora</button>
          <button className="btn btn-load" type="button" onClick={() => fileInput.current?.click()}>Importar backup</button>
          <button className="btn btn-load" type="button" onClick={controller.exportarBackup}>Exportar backup</button>
          <button className="btn btn-reset" type="button" onClick={controller.limparDados}>Limpar tudo</button>
          <input ref={fileInput} hidden type="file" accept=".json,application/json" onChange={carregarArquivo} />
        </div>
      </header>

      <nav className="tabs" aria-label="Abas do painel">
        {TABS.map(([key, label]) => (
          <button className={`tab ${controller.tab === key ? "active" : ""}`} key={key} type="button" onClick={() => controller.setTab(key)}>
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
