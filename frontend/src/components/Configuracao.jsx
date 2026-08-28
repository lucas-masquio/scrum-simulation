import { Campo, CampoNome } from "./CamposFormulario";
import { WEIGHT_LABELS } from "../models/modeloPainel";

export default function Configuracao({ data, empresas, atualizarCaminho, renomearEmpresa, atualizarNomeTime }) {
  return (
    <section className="panel">
      <h2>Configuração</h2>
      <div className="fields-row">
        <Campo label="Turma" value={data.meta.turma} onChange={(value) => atualizarCaminho("meta.turma", value)} />
        <Campo label="Data" value={data.meta.data} onChange={(value) => atualizarCaminho("meta.data", value)} />
      </div>

      {empresas.map((empresa, index) => {
        const key = index === 0 ? "empresaA" : "empresaB";
        return (
          <div className="fields-row" key={empresa}>
            <CampoNome label={`Empresa ${index === 0 ? "A" : "B"}`} value={empresa} onChange={(value) => renomearEmpresa(key, value)} />
            <Campo label="Time Caça" value={data.teamNames[empresa]?.Caça || ""} onChange={(value) => atualizarNomeTime(empresa, "Caça", value)} />
            <Campo label="Time Transporte" value={data.teamNames[empresa]?.Transporte || ""} onChange={(value) => atualizarNomeTime(empresa, "Transporte", value)} />
          </div>
        );
      })}

      <h2 className="section-title">Pesos da nota final</h2>
      <div className="weights-panel">
        {Object.entries(data.weights).map(([key, value]) => (
          <label className="weight-field" key={key}>
            <span>{WEIGHT_LABELS[key]}</span>
            <input type="number" min="0" value={value} onChange={(event) => atualizarCaminho(`weights.${key}`, Number(event.target.value) || 0)} />
          </label>
        ))}
      </div>
    </section>
  );
}
