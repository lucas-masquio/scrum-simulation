import Cabecalho from "./Cabecalho";
import Configuracao from "./Configuracao";
import Alunos from "./Alunos";
import TabelaAvaliacao from "./TabelaAvaliacao";
import Escalacao from "./Escalacao";
import CorrupcaoSabotagem from "./Sabotagem";
import Resultado from "./Resultado";
import { TABS } from "../models/modeloPainel";

function pegarConteudo(controller, data, empresas) {
  const { tab, atualizarCaminho } = controller;

  if (tab === "setup") return <Configuracao {...controller} empresas={empresas} />;
  if (tab === "alunos") return <Alunos data={data} empresas={empresas} atualizarCaminho={atualizarCaminho} />;
  if (tab === "escalacao") return <Escalacao data={data} empresas={empresas} />;
  if (tab === "corrupsab") return <CorrupcaoSabotagem data={data} empresas={empresas} atualizarCaminho={atualizarCaminho} />;
  if (tab === "result") return <Resultado data={data} empresas={empresas} />;

  const currentTab = TABS.find(([key]) => key === tab);
  return <TabelaAvaliacao data={data} tableKey={tab} title={currentTab ? currentTab[1] : tab} atualizarCaminho={atualizarCaminho} />;
}

export default function Painel({ controlador }) {
  const controller = controlador;
  const { data } = controller;
  const empresas = [data.meta.empresaA, data.meta.empresaB];

  if (controller.loadingInicial) {
    return (
      <div className="app-shell app-loading">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="app-shell" style={{ fontSize: `${data.meta.fontScale}px` }}>
      <Cabecalho controller={controller} />
      <main className="wrap">{pegarConteudo(controller, data, empresas)}</main>
    </div>
  );
}
