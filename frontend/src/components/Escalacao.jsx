import { BUYERS, BUYER_IMAGES, ROLE_COLORS, TEAM_IMAGES } from "../models/modeloPainel";

export default function Escalacao({ data, empresas }) {
  return (
    <section className="panel">
      <h2>Escalação</h2>
      {empresas.map((empresa) => {
        const image = TEAM_IMAGES[empresa]?.logo;
        const students = data.alunos.filter((aluno) => aluno.empresa === empresa);

        return (
          <div className="company-block" key={empresa}>
            {image && <img src={image} alt={empresa} />}
            <h3>{empresa}</h3>
            <ul>
              {students.map((aluno) => (
                <li key={aluno.id}>
                  {aluno.nome}
                  <span className="role-badge" style={{ background: ROLE_COLORS[aluno.papel] }}>{aluno.papel}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="buyers-strip">
        {BUYERS.map((buyer) => (
          <div className="buyer-card" key={buyer}>
            <img src={BUYER_IMAGES[buyer]} alt={buyer} />
            <h3>{buyer}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
