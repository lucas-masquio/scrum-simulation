import { useMemo, useState } from "react";
import { construirResumoAlunos, PAPEIS, TIMES } from "../models/modeloPainel";
import { CampoSelecao } from "./CamposFormulario";

function LinhaAluno({ aluno, index, empresas, atualizarCaminho }) {
  const companyRoles = ["Scrum Master", "Owner/Stakeholder", "Product Owner", "Developer"];
  const teamRoles = ["Product Owner", "Developer"];
  const needsCompany = companyRoles.includes(aluno.papel);
  const needsTeam = teamRoles.includes(aluno.papel);

  function alterarPapel(value) {
    atualizarCaminho(`alunos.${index}.papel`, value);
    if (!companyRoles.includes(value)) atualizarCaminho(`alunos.${index}.empresa`, "");
    if (!teamRoles.includes(value)) atualizarCaminho(`alunos.${index}.time`, "");
  }

  return (
    <tr>
      <td>{aluno.id}</td>
      <td>{aluno.nome}</td>
      <td><CampoSelecao value={aluno.papel} options={PAPEIS} onChange={alterarPapel} /></td>
      <td>{needsCompany && <CampoSelecao value={aluno.empresa} options={empresas} onChange={(value) => atualizarCaminho(`alunos.${index}.empresa`, value)} />}</td>
      <td>{needsTeam && <CampoSelecao value={aluno.time} options={TIMES} onChange={(value) => atualizarCaminho(`alunos.${index}.time`, value)} />}</td>
    </tr>
  );
}

export default function Alunos({ data, empresas, atualizarCaminho }) {
  const [search, setSearch] = useState("");
  const summary = useMemo(() => construirResumoAlunos(data, empresas), [data, empresas]);
  const query = search.trim().toLowerCase();
  const students = data.alunos.map((aluno, index) => ({ aluno, index })).filter(({ aluno }) => aluno.nome.toLowerCase().includes(query));

  return (
    <section className="panel">
      <h2>Alunos</h2>
      <input className="roster-search" placeholder="Buscar aluno" value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="table-scroll">
        <table className="roster-table">
          <thead><tr><th>#</th><th>Nome</th><th>Papel</th><th>Empresa</th><th>Time</th></tr></thead>
          <tbody>{students.map(({ aluno, index }) => <LinhaAluno key={aluno.id} aluno={aluno} index={index} empresas={empresas} atualizarCaminho={atualizarCaminho} />)}</tbody>
        </table>
      </div>
      <div className="note note-orange">{summary.naoAtribuidos} de {data.alunos.length} alunos sem papel.</div>
    </section>
  );
}
