import { CaixaSelecao, CampoSelecao } from "./CamposFormulario";
import { TIMES, calcularPontosCorrupcao, calcularPontosSabotagem } from "../models/modeloPainel";

export default function CorrupcaoSabotagem({ data, empresas, atualizarCaminho }) {
  const corruption = calcularPontosCorrupcao(data.corrupcao);
  const sabotage = calcularPontosSabotagem(data.sabotagem);

  return (
    <section className="panel">
      <h2>Corrupção & Sabotagem</h2>
      <div className="grid2">
        <div className="mini-card">
          <h3>Corrupção</h3>
          <CampoSelecao value={data.corrupcao.empresaCorruptora} options={empresas} onChange={(value) => atualizarCaminho("corrupcao.empresaCorruptora", value)} />
          <CaixaSelecao label="Primeira descoberta" checked={data.corrupcao.primeiraDescoberta} onChange={(value) => atualizarCaminho("corrupcao.primeiraDescoberta", value)} />
          <CaixaSelecao label="Segunda descoberta" checked={data.corrupcao.segundaDescoberta} onChange={(value) => atualizarCaminho("corrupcao.segundaDescoberta", value)} />
          <p>Pontos: {corruption.corruptor}</p>
        </div>

        <div className="mini-card">
          <h3>Sabotagem</h3>
          <CampoSelecao value={data.sabotagem.empresaSabotador} options={empresas} onChange={(value) => atualizarCaminho("sabotagem.empresaSabotador", value)} />
          <CampoSelecao value={data.sabotagem.timeSabotador} options={TIMES} onChange={(value) => atualizarCaminho("sabotagem.timeSabotador", value)} />
          <CaixaSelecao label="Foi descoberto" checked={data.sabotagem.descoberto} onChange={(value) => atualizarCaminho("sabotagem.descoberto", value)} />
          <p>Área: {sabotage.area} · Sabotador: {sabotage.sabotador}</p>
        </div>
      </div>
    </section>
  );
}
