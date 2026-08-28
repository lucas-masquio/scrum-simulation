import { calcularNotaEmpresa } from "../models/modeloPainel";

export default function Resultado({ data, empresas }) {
  return (
    <section className="panel">
      <h2>Resultado Final</h2>
      <div className="grid2">
        {empresas.map((empresa) => {
          const score = calcularNotaEmpresa(data, empresa);
          return (
            <div className="dash-card" key={empresa}>
              <h3>{empresa}</h3>
              <div className="big">{score.final === null ? "-" : score.final.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
