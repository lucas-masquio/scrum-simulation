import { useEffect, useMemo, useRef, useState } from "react";

const SPRINTS = [1, 2, 3];
const TIMES = ["Caça", "Transporte"];
const BUYERS = ["Governo", "Militar", "Setor Privado"];
const PAPEIS = [
  "",
  "Scrum Master",
  "Product Owner",
  "Owner/Stakeholder",
  "Developer",
  "Comprador - Governo",
  "Comprador - Militar",
  "Comprador - Setor Privado",
];

const SEED_NAMES = [
  "ALAN FERREIRA DE OLIVEIRA",
  "ANDRÉ LUIZ VICENZI RIGO",
  "ARTHUR HENRIQUE LORENZETT",
  "BRUNO DE DAVID REIS",
  "CARLOS EDUARDO ALMEIDA DA CONCEICAO",
  "CARLOS JHONATAS DE SOUZA AMORIM",
  "CAUAN BRUNO ALTHAUS RIFFEL",
  "FILIPE GABRIEL HOLLMANN",
  "FILIPE JOSÉ DA COSTA NUNES",
  "GABRIEL CRISTIAN VIVIAN SOMARIVA",
  "GABRIEL DE CARVALHO BARRETO",
  "GIOVANI RICARDO POTT",
  "GUSTAVO SCHWITZKI PERETTI",
  "ISAEL SOARES DOS SANTOS",
  "JADSON BUTZK",
  "JÉSSICA FERNANDA RUBAS",
  "JOÃO VITOR RAIMUNDI",
  "KAUAN LUCAS TOLDO",
  "LEONARDO SCHIMIDT LOPES",
  "LORENZO PIVA MAY",
  "MARIA EDUARDA EMELAU JOBIM",
  "MATTEO DALLA COSTA THOMÉ",
  "NATAN ELIAS PATZLAFF",
  "NICOLAS LISBOA FIGUEIREDO MULLER",
  "NICOLE BONASSI BET",
  "RAFAEL WILLIAM HAUPT FLORES",
  "SAMIRA GREGORIO VIEIRA",
  "VICENTE DAGOSTIN PILONETTO",
  "VINICIUS TEBALDI BORSATTI",
  "WILLIAM KUNZLER",
  "YASMIN MARIA ZERBIELLI",
];

const DEFAULT_A = "Maverick Aviation";
const DEFAULT_B = "SkyForge Ind. Aeronáutica";

const TEAM_IMAGES = {
  [DEFAULT_A]: {
    logo: "/images/maverick_caca.jpg",
    Caça: "/images/maverick_caca.jpg",
    Transporte: "/images/maverick_cargo.jpg",
  },
  [DEFAULT_B]: {
    logo: "/images/skyforge_caca.jpg",
    Caça: "/images/skyforge_caca.jpg",
    Transporte: "/images/skyforge_cargo.jpg",
  },
};

const BUYER_IMAGES = {
  Governo: "/images/governo_caca.jpg",
  Militar: "/images/militar.jpg",
  "Setor Privado": "/images/empresa_privada.jpg",
};

const ROLE_COLORS = {
  "Scrum Master": "#455F51",
  "Product Owner": "#029676",
  "Owner/Stakeholder": "#0989B1",
  Developer: "#549E39",
  "Comprador - Governo": "#E8871E",
  "Comprador - Militar": "#B33A3A",
  "Comprador - Setor Privado": "#E8871E",
};

const weightLabels = {
  sm: "Scrum Master",
  owner: "Owner",
  po: "Product Owner",
  dev: "Developers",
  buyer: "Avaliação dos Compradores",
};

const tabs = [
  ["setup", "Configuração"],
  ["alunos", "Alunos"],
  ["escalacao", "Escalação"],
  ["sm", "Scrum Master"],
  ["owner", "Owner"],
  ["po", "Product Owner"],
  ["dev", "Developers"],
  ["buyerProf", "Compradores (Papel)"],
  ["buyerProduct", "Compradores (Produto)"],
  ["corrupsab", "Corrupção & Sabotagem"],
  ["result", "Resultado Final"],
];

function buildInitialData(empresaA = DEFAULT_A, empresaB = DEFAULT_B) {
  const empresas = [empresaA, empresaB];
  const sm = [];
  const owner = [];
  const po = [];
  const dev = [];
  const buyerProf = [];
  const buyerProduct = [];

  SPRINTS.forEach((sprint) => {
    empresas.forEach((empresa) => {
      sm.push({ sprint, empresa, conduziu: "", removeu: "", ajudou: "", nota: "", obs: "" });
      owner.push({ sprint, empresa, comunicacao: "", negociacao: "", alinhamento: "", notaGeral: "", obs: "" });
      TIMES.forEach((time) => {
        po.push({ sprint, empresa, time, requisitos: "", testes: "", reuniao: "", nota: "", obs: "" });
        dev.push({ sprint, empresa, time, qualidade: "", processo: "", colaboracao: "", notaTime: "", destaque: "" });
      });
    });
    BUYERS.forEach((comprador) => {
      buyerProf.push({ sprint, comprador, checklist: "", decisoes: "", feedback: "", nota: "", obs: "" });
    });
    empresas.forEach((empresa) => {
      buyerProduct.push({ sprint, comprador: "Governo", empresa, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint, comprador: "Governo", empresa, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint, comprador: "Militar", empresa, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint, comprador: "Setor Privado", empresa, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
    });
  });

  return {
    meta: { turma: "", data: "", empresaA, empresaB, fontScale: 16 },
    sm,
    owner,
    po,
    dev,
    buyerProf,
    buyerProduct,
    corrupcao: { empresaCorruptora: empresaA, primeiraDescoberta: false, primeiroComprador: "", segundaDescoberta: false, segundoComprador: "" },
    sabotagem: { empresaSabotador: empresaA, timeSabotador: "Caça", tipoAcao: "atrapalhar", denunciasConsecutivas: 0, descoberto: false, areaSoubeECalou: false },
    weights: { sm: 1, owner: 1, po: 1, dev: 2, buyer: 2 },
    teamNames: {
      [empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
      [empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
    },
    alunos: SEED_NAMES.map((nome, index) => ({ id: index + 1, nome, empresa: "", time: "", papel: "" })),
  };
}

function avg(values) {
  const nums = values.map(Number).filter((value) => !Number.isNaN(value));
  return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : null;
}

function computeCorrupcaoPontos(corrupcao) {
  let corruptor = 0;
  const compradores = {};

  if (corrupcao.primeiraDescoberta) {
    corruptor -= 1;
    if (corrupcao.primeiroComprador) compradores[corrupcao.primeiroComprador] = (compradores[corrupcao.primeiroComprador] || 0) - 1;
  }
  if (corrupcao.segundaDescoberta) {
    corruptor -= 1;
    if (corrupcao.segundoComprador) compradores[corrupcao.segundoComprador] = (compradores[corrupcao.segundoComprador] || 0) - 1;
  }

  return { corruptor, compradores };
}

function computeSabotagemPontos(sabotagem) {
  let sabotador = 0;
  let area = 0;
  let demitido = false;

  if (sabotagem.descoberto) {
    sabotador -= 1;
    area += sabotagem.areaSoubeECalou ? -1 : 1;
    if (sabotagem.tipoAcao === "vazar" && sabotagem.denunciasConsecutivas >= 1) demitido = true;
    if (sabotagem.tipoAcao === "atrapalhar" && sabotagem.denunciasConsecutivas >= 2) demitido = true;
  }

  return { sabotador, area, demitido };
}

function computeEmpresaScore(data, empresa) {
  const smAvg = avg(data.sm.filter((row) => row.empresa === empresa).map((row) => row.nota));
  const ownerAvg = avg(data.owner.filter((row) => row.empresa === empresa).map((row) => row.notaGeral));
  const poAvg = avg(data.po.filter((row) => row.empresa === empresa).map((row) => row.nota));
  const devAvg = avg(data.dev.filter((row) => row.empresa === empresa).map((row) => row.notaTime));
  const buyerAvg = avg(data.buyerProduct.filter((row) => row.empresa === empresa).map((row) => row.nota));
  const parts = [
    { key: "Scrum Master", val: smAvg, w: data.weights.sm },
    { key: "Owner", val: ownerAvg, w: data.weights.owner },
    { key: "Product Owner", val: poAvg, w: data.weights.po },
    { key: "Developers", val: devAvg, w: data.weights.dev },
    { key: "Avaliação dos Compradores", val: buyerAvg, w: data.weights.buyer },
  ];
  const scoredParts = parts.filter((part) => part.val !== null);
  const sumW = scoredParts.reduce((sum, part) => sum + Number(part.w || 0), 0);
  const sumV = scoredParts.reduce((sum, part) => sum + part.val * Number(part.w || 0), 0);
  const base = sumW > 0 ? sumV / sumW : null;
  let ajuste = 0;
  const cPts = computeCorrupcaoPontos(data.corrupcao);
  const sPts = computeSabotagemPontos(data.sabotagem);

  if (data.corrupcao.empresaCorruptora === empresa) ajuste += cPts.corruptor;
  if (data.sabotagem.empresaSabotador === empresa) ajuste += sPts.sabotador + sPts.area;

  return { base, ajuste, final: base !== null ? base + ajuste : null, parts };
}

function ensureLoadedData(parsed) {
  const fallback = buildInitialData();
  return {
    ...fallback,
    ...parsed,
    meta: { ...fallback.meta, ...(parsed.meta || {}), fontScale: parsed.meta?.fontScale || 16 },
    weights: { ...fallback.weights, ...(parsed.weights || {}) },
    teamNames: parsed.teamNames || fallback.teamNames,
    alunos: parsed.alunos || fallback.alunos,
  };
}

function App() {
  const [data, setData] = useState(() => buildInitialData());
  const [tab, setTab] = useState("setup");
  const [fileName, setFileName] = useState("(nenhum arquivo carregado)");
  const fileInputRef = useRef(null);

  const empresas = [data.meta.empresaA, data.meta.empresaB];

  function updatePath(path, value) {
    setData((current) => {
      const next = structuredClone(current);
      const parts = path.split(".");
      let cursor = next;
      for (let index = 0; index < parts.length - 1; index += 1) cursor = cursor[parts[index]];
      cursor[parts.at(-1)] = value;
      return next;
    });
  }

  function renameEmpresa(which, novoNome) {
    setData((current) => {
      const oldVal = which === "empresaA" ? current.meta.empresaA : current.meta.empresaB;
      const cleanName = novoNome.trim();
      if (!cleanName || cleanName === oldVal) return current;

      const next = structuredClone(current);
      const rename = (value) => (value === oldVal ? cleanName : value);
      ["sm", "owner", "po", "dev", "buyerProduct"].forEach((key) => {
        next[key].forEach((row) => {
          row.empresa = rename(row.empresa);
        });
      });
      next.alunos.forEach((aluno) => {
        aluno.empresa = rename(aluno.empresa);
      });
      next.corrupcao.empresaCorruptora = rename(next.corrupcao.empresaCorruptora);
      next.sabotagem.empresaSabotador = rename(next.sabotagem.empresaSabotador);
      next.teamNames[cleanName] = next.teamNames[oldVal] || { Caça: "", Transporte: "" };
      delete next.teamNames[oldVal];
      next.meta[which] = cleanName;
      return next;
    });
  }

  function updateTeamName(empresa, time, value) {
    setData((current) => ({
      ...current,
      teamNames: {
        ...current.teamNames,
        [empresa]: {
          ...current.teamNames[empresa],
          [time]: value,
        },
      },
    }));
  }

  function saveData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeTurma = (data.meta.turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_");
    anchor.href = url;
    anchor.download = `scrum_simulacao_${safeTurma}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function loadData(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setData(ensureLoadedData(JSON.parse(event.target.result)));
        setFileName(file.name);
      } catch {
        window.alert("Não foi possível ler este arquivo. Verifique se é um .json válido gerado por este painel.");
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (window.confirm("Isso apaga todos os dados lançados nesta sessão. Continuar?")) {
      setData(buildInitialData());
      setFileName("(nenhum arquivo carregado)");
      setTab("setup");
    }
  }

  function changeFontScale(delta) {
    const nextScale = Math.max(12, Math.min(24, data.meta.fontScale + delta));
    updatePath("meta.fontScale", nextScale);
  }

  return (
    <div className="app-shell" style={{ fontSize: `${data.meta.fontScale}px` }}>
      <header className="topbar">
        <div>
          <h1>Painel de Avaliação — Simulação Scrum Competitiva</h1>
          <div className="sub">{fileName}</div>
        </div>
        <div className="topbar-actions">
          <div className="fontctrl">
            <span className="lbl">Fonte</span>
            <button type="button" title="Diminuir fonte" onClick={() => changeFontScale(-1)}>A−</button>
            <button type="button" title="Restaurar fonte padrão" onClick={() => updatePath("meta.fontScale", 16)}>A</button>
            <button type="button" title="Aumentar fonte" onClick={() => changeFontScale(1)}>A+</button>
            <span className="lbl">{data.meta.fontScale}px</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              if (event.target.files[0]) loadData(event.target.files[0]);
              event.target.value = "";
            }}
          />
          <button type="button" className="btn btn-load" onClick={() => fileInputRef.current?.click()}>Carregar dados (.json)</button>
          <button type="button" className="btn btn-save" onClick={saveData}>Salvar dados (.json)</button>
          <button type="button" className="btn btn-reset" onClick={resetData}>Limpar tudo</button>
        </div>
      </header>

      <nav className="tabs" aria-label="Abas do painel">
        {tabs.map(([key, label]) => (
          <button key={key} type="button" className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      <main className="wrap">
        {tab === "setup" && <SetupPanel data={data} empresas={empresas} updatePath={updatePath} renameEmpresa={renameEmpresa} updateTeamName={updateTeamName} />}
        {tab === "alunos" && <AlunosPanel data={data} empresas={empresas} setData={setData} updatePath={updatePath} />}
        {tab === "escalacao" && <EscalacaoPanel data={data} empresas={empresas} />}
        {tab === "sm" && <EvaluationTable data={data} tableKey="sm" title="Scrum Master" desc="Avaliação de processo — um Scrum Master por empresa, atendendo os dois times." columns={smColumns} noteClass="note-dark" note="Critério-guia: o SM não é avaliado por produzir, mas por garantir que o Scrum aconteça de verdade e por ajudar o time a evoluir de uma Sprint para a outra." updatePath={updatePath} />}
        {tab === "owner" && <EvaluationTable data={data} tableKey="owner" title="Stakeholder / Owner" desc="Avaliação de comunicação e negociação — independente dos pontos de corrupção, registrados na aba Corrupção & Sabotagem." columns={ownerColumns} noteClass="note-blue" note="Esta nota avalia o desempenho no papel. Os pontos ganhos ou perdidos no mecanismo de corrupção são calculados automaticamente na aba própria." updatePath={updatePath} />}
        {tab === "po" && <EvaluationTable data={data} tableKey="po" title="Product Owner" desc="Um Product Owner por time, com dois times por empresa." columns={poColumns} noteClass="note-teal" note="Critério-guia: o PO é avaliado pela clareza dos requisitos e pelo acompanhamento ativo da produção, não pela qualidade técnica do avião em si." updatePath={updatePath} />}
        {tab === "dev" && <EvaluationTable data={data} tableKey="dev" title="Developers" desc="Avaliação por time, usando a qualidade do produto como principal indicador de entendimento do processo pelo grupo." columns={devColumns} noteClass="note-green" note="Reserve a coluna de destaque individual apenas para casos que realmente chamem atenção, positiva ou negativamente." updatePath={updatePath} />}
        {tab === "buyerProf" && <EvaluationTable data={data} tableKey="buyerProf" title="Compradores — Desempenho no Papel" desc="Avaliação do professor sobre como cada comprador exerceu seu papel." columns={buyerProfColumns} noteClass="note-orange" note="Critério-guia: avalie se o comprador aplicou o checklist a cada Sprint, se as decisões foram coerentes com o papel, e se o feedback nas Reviews foi útil." updatePath={updatePath} />}
        {tab === "buyerProduct" && <EvaluationTable data={data} tableKey="buyerProduct" title="Ficha do Comprador — Avaliação do Produto" desc="Transcreva aqui os dados que cada comprador preencheu na ficha em papel, ao final de cada Sprint." columns={buyerProductColumns} noteClass="note-orange" note="Militar só avalia Caça; Setor Privado só avalia Transporte; Governo avalia os dois. Linhas fora do papel do comprador podem ficar em branco." updatePath={updatePath} />}
        {tab === "corrupsab" && <CorrupSabPanel data={data} empresas={empresas} updatePath={updatePath} />}
        {tab === "result" && <ResultPanel data={data} empresas={empresas} />}
        <div className="footer-note">Os dados ficam apenas nesta janela até você clicar em Salvar dados (.json). Salve com frequência, especialmente ao final de cada Sprint.</div>
      </main>
    </div>
  );
}

function SetupPanel({ data, empresas, updatePath, renameEmpresa, updateTeamName }) {
  return (
    <section className="panel">
      <h2>Configuração</h2>
      <div className="desc">Identificação da turma e nomes das empresas/times. Alterar os nomes atualiza todas as abas automaticamente.</div>
      <div className="fields-row">
        <TextField label="Turma" value={data.meta.turma} onChange={(value) => updatePath("meta.turma", value)} />
        <TextField label="Data" value={data.meta.data} onChange={(value) => updatePath("meta.data", value)} />
      </div>
      {empresas.map((empresa, index) => (
        <div className="fields-row" key={empresa}>
          <RenameField label={`Nome — Empresa ${index === 0 ? "A" : "B"}`} value={empresa} onBlur={(value) => renameEmpresa(index === 0 ? "empresaA" : "empresaB", value)} />
          <TextField label={`Time Caça — Empresa ${index === 0 ? "A" : "B"}`} value={data.teamNames[empresa]?.Caça || ""} onChange={(value) => updateTeamName(empresa, "Caça", value)} />
          <TextField label={`Time Transporte — Empresa ${index === 0 ? "A" : "B"}`} value={data.teamNames[empresa]?.Transporte || ""} onChange={(value) => updateTeamName(empresa, "Transporte", value)} />
        </div>
      ))}
      <div className="note note-dark">Dica: os nomes de empresa já vêm pré-preenchidos a partir das imagens do projeto original. Pode alterar se quiser.</div>

      <h2 className="section-title">Pesos da Nota Final</h2>
      <div className="desc">Ajuste o peso de cada papel no cálculo da nota final da empresa.</div>
      <div className="weights-panel">
        {Object.entries(data.weights).map(([key, value]) => (
          <label className="weight-field" key={key}>
            <span>{weightLabels[key]}</span>
            <input type="number" min="0" step="0.5" value={value} onChange={(event) => updatePath(`weights.${key}`, Number(event.target.value) || 0)} />
          </label>
        ))}
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, onBlur }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(event) => onChange?.(event.target.value)} onBlur={(event) => onBlur?.(event.target.value)} />
    </label>
  );
}

function RenameField({ label, value, onBlur }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => onBlur?.(event.target.value)}
      />
    </label>
  );
}

function EvaluationTable({ data, tableKey, title, desc, columns, noteClass, note, updatePath }) {
  const rows = data[tableKey];

  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="desc">{desc}</div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${tableKey}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.key} className={column.key === "sprint" ? "sprint-label" : ""}>
                    {renderCell(column, row, rowIndex, rows, tableKey, updatePath)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`note ${noteClass}`}>{note}</div>
    </section>
  );
}

function renderCell(column, row, rowIndex, rows, tableKey, updatePath) {
  if (column.key === "sprint") return rowIndex === 0 || row.sprint !== rows[rowIndex - 1].sprint ? `Sprint ${row.sprint}` : "";
  if (column.type === "static") return row[column.key];
  const path = `${tableKey}.${rowIndex}.${column.key}`;
  if (column.type === "sn") return <SimNaoSelect value={row[column.key]} onChange={(value) => updatePath(path, value)} />;
  if (column.type === "score") return <ScoreSelect value={row[column.key]} onChange={(value) => updatePath(path, value)} />;
  if (column.type === "decisao") return <DecisaoSelect value={row[column.key]} onChange={(value) => updatePath(path, value)} />;
  return <input className="obs-input" type="text" value={row[column.key]} placeholder={column.placeholder || ""} onChange={(event) => updatePath(path, event.target.value)} />;
}

function SimNaoSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">—</option>
      <option value="S">Sim</option>
      <option value="N">Não</option>
    </select>
  );
}

function ScoreSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">—</option>
      {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
    </select>
  );
}

function DecisaoSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">—</option>
      <option value="A">Aceitou</option>
      <option value="I">Ignorou</option>
      <option value="D">Denunciou</option>
    </select>
  );
}

function AlunosPanel({ data, empresas, setData, updatePath }) {
  const [search, setSearch] = useState("");
  const filteredAlunos = data.alunos
    .map((aluno, index) => ({ aluno, index }))
    .filter(({ aluno }) => aluno.nome.toLowerCase().includes(search.trim().toLowerCase()));
  const summary = useMemo(() => buildRosterSummary(data, empresas), [data, empresas]);

  function importAlunos(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const XLSX = window.XLSX;
        if (!XLSX) {
          window.alert("A biblioteca de leitura de Excel ainda não carregou. Verifique a internet e tente novamente.");
          return;
        }
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const names = [];
        workbook.SheetNames.forEach((sheetName) => {
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
          rows.forEach((row) => {
            row.forEach((cell) => {
              if (typeof cell === "string" && cell.trim().split(" ").length >= 2 && cell.trim().length > 5 && !/\d/.test(cell)) {
                names.push(cell.trim());
              }
            });
          });
        });
        const unique = Array.from(new Set(names));
        if (!unique.length) {
          window.alert("Não encontrei nomes reconhecíveis nesse arquivo.");
          return;
        }
        if (!window.confirm(`Encontrei ${unique.length} nomes. Isso substitui a lista atual de alunos. Continuar?`)) return;
        setData((current) => ({
          ...current,
          alunos: unique.map((nome, index) => ({ id: index + 1, nome, empresa: "", time: "", papel: "" })),
        }));
      } catch {
        window.alert("Não foi possível ler este arquivo Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <section className="panel">
      <h2>Alunos</h2>
      <div className="desc">Atribua cada aluno a um papel e equipe. A turma não escolhe o lado — a atribuição é feita aqui pelo professor.</div>
      <div className="roster-search">
        <input type="text" value={search} placeholder="Buscar aluno por nome..." onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="table-scroll">
        <table className="roster-table">
          <thead>
            <tr><th>#</th><th>Nome</th><th>Papel</th><th>Empresa</th><th>Time</th></tr>
          </thead>
          <tbody>
            {filteredAlunos.map(({ aluno, index }) => (
              <AlunoRow key={aluno.id} aluno={aluno} index={index} empresas={empresas} updatePath={updatePath} />
            ))}
          </tbody>
        </table>
      </div>
      <div className={`note ${summary.naoAtribuidos > 0 ? "note-orange" : "note-green"}`}>
        {summary.naoAtribuidos} de {data.alunos.length} alunos ainda sem papel atribuído.
      </div>

      <h2 className="section-title">Resumo de Vagas Preenchidas</h2>
      <div className="grid2">
        {empresas.map((empresa) => (
          <div className="mini-card" key={empresa}>
            <h3>{empresa}</h3>
            <MiniRow label="Scrum Master" value={`${summary.counts[empresa]["Scrum Master"]} / 1`} />
            <MiniRow label="Owner/Stakeholder" value={`${summary.counts[empresa]["Owner/Stakeholder"]} / 1`} />
            <MiniRow label={`PO — ${data.teamNames[empresa]?.Caça || "Caça"}`} value={`${summary.counts[empresa]["Product Owner-Caça"]} / 1`} />
            <MiniRow label={`PO — ${data.teamNames[empresa]?.Transporte || "Transporte"}`} value={`${summary.counts[empresa]["Product Owner-Transporte"]} / 1`} />
            <MiniRow label={`Devs — ${data.teamNames[empresa]?.Caça || "Caça"}`} value={`${summary.counts[empresa]["Developer-Caça"]} / 4`} />
            <MiniRow label={`Devs — ${data.teamNames[empresa]?.Transporte || "Transporte"}`} value={`${summary.counts[empresa]["Developer-Transporte"]} / 5`} />
          </div>
        ))}
      </div>
      <div className="mini-card import-card">
        <h3>Compradores</h3>
        <MiniRow label="Governo" value={`${summary.buyerCounts["Comprador - Governo"]} / 1`} />
        <MiniRow label="Militar" value={`${summary.buyerCounts["Comprador - Militar"]} / 1`} />
        <MiniRow label="Setor Privado" value={`${summary.buyerCounts["Comprador - Setor Privado"]} / 1`} />
      </div>

      <h2 className="section-title">Importar Lista de Alunos</h2>
      <div className="desc">Substitui a lista atual por uma nova, a partir de um arquivo Excel (.xlsx).</div>
      <input type="file" accept=".xlsx,.xls" onChange={(event) => {
        if (event.target.files[0]) importAlunos(event.target.files[0]);
        event.target.value = "";
      }} />
    </section>
  );
}

function AlunoRow({ aluno, index, empresas, updatePath }) {
  const needsEmpresa = ["Scrum Master", "Owner/Stakeholder", "Product Owner", "Developer"].includes(aluno.papel);
  const needsTime = ["Product Owner", "Developer"].includes(aluno.papel);

  function setPapel(value) {
    updatePath(`alunos.${index}.papel`, value);
    if (!["Scrum Master", "Owner/Stakeholder", "Product Owner", "Developer"].includes(value)) updatePath(`alunos.${index}.empresa`, "");
    if (!["Product Owner", "Developer"].includes(value)) updatePath(`alunos.${index}.time`, "");
  }

  return (
    <tr>
      <td>{aluno.id}</td>
      <td>{aluno.nome}</td>
      <td>
        <select value={aluno.papel} onChange={(event) => setPapel(event.target.value)}>
          {PAPEIS.map((papel) => <option key={papel || "none"} value={papel}>{papel || "— não atribuído —"}</option>)}
        </select>
      </td>
      <td>
        {needsEmpresa && (
          <select value={aluno.empresa} onChange={(event) => updatePath(`alunos.${index}.empresa`, event.target.value)}>
            <option value="">—</option>
            {empresas.map((empresa) => <option key={empresa} value={empresa}>{empresa}</option>)}
          </select>
        )}
      </td>
      <td>
        {needsTime && (
          <select value={aluno.time} onChange={(event) => updatePath(`alunos.${index}.time`, event.target.value)}>
            <option value="">—</option>
            {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
          </select>
        )}
      </td>
    </tr>
  );
}

function buildRosterSummary(data, empresas) {
  const counts = {};
  empresas.forEach((empresa) => {
    counts[empresa] = {
      "Scrum Master": 0,
      "Owner/Stakeholder": 0,
      "Product Owner-Caça": 0,
      "Product Owner-Transporte": 0,
      "Developer-Caça": 0,
      "Developer-Transporte": 0,
    };
  });
  const buyerCounts = { "Comprador - Governo": 0, "Comprador - Militar": 0, "Comprador - Setor Privado": 0 };

  data.alunos.forEach((aluno) => {
    if (buyerCounts[aluno.papel] !== undefined) buyerCounts[aluno.papel] += 1;
    else if (aluno.papel === "Scrum Master" || aluno.papel === "Owner/Stakeholder") counts[aluno.empresa]?.[aluno.papel] !== undefined && (counts[aluno.empresa][aluno.papel] += 1);
    else if ((aluno.papel === "Product Owner" || aluno.papel === "Developer") && aluno.time) counts[aluno.empresa]?.[`${aluno.papel}-${aluno.time}`] !== undefined && (counts[aluno.empresa][`${aluno.papel}-${aluno.time}`] += 1);
  });

  return { counts, buyerCounts, naoAtribuidos: data.alunos.filter((aluno) => !aluno.papel).length };
}

function EscalacaoPanel({ data, empresas }) {
  return (
    <section className="panel">
      <h2>Escalação</h2>
      <div className="desc">Visão de equipe, com a identidade visual de cada empresa — útil para projetar em sala.</div>
      {empresas.map((empresa) => <CompanyBlock key={empresa} data={data} empresa={empresa} />)}

      <h2 className="section-title compact">Compradores</h2>
      <div className="buyers-strip">
        {BUYERS.map((buyer) => {
          const aluno = data.alunos.find((item) => item.papel === `Comprador - ${buyer}`);
          return (
            <div className="buyer-card" key={buyer}>
              <img src={BUYER_IMAGES[buyer]} alt={buyer} />
              <div className="buyer-body">
                <h3>{buyer}</h3>
                <div>{aluno ? aluno.nome : <span className="tag-unassigned">não atribuído</span>}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CompanyBlock({ data, empresa }) {
  const imgs = TEAM_IMAGES[empresa] || TEAM_IMAGES[empresa === data.meta.empresaA ? DEFAULT_A : DEFAULT_B] || {};
  const sm = data.alunos.find((aluno) => aluno.papel === "Scrum Master" && aluno.empresa === empresa);
  const owner = data.alunos.find((aluno) => aluno.papel === "Owner/Stakeholder" && aluno.empresa === empresa);

  return (
    <div className="company-block">
      <div className="company-header">
        {imgs.logo && <img src={imgs.logo} alt={empresa} />}
        <div>
          <h2>{empresa}</h2>
          <div className="company-meta">
            Scrum Master: {sm ? sm.nome : <span className="tag-unassigned">não atribuído</span>} · Owner: {owner ? owner.nome : <span className="tag-unassigned">não atribuído</span>}
          </div>
        </div>
      </div>
      <div className="teams-grid">
        {TIMES.map((time) => {
          const roster = data.alunos
            .filter((aluno) => aluno.empresa === empresa && aluno.time === time && ["Product Owner", "Developer"].includes(aluno.papel))
            .sort((a, b) => (a.papel === "Product Owner" ? -1 : 1) - (b.papel === "Product Owner" ? -1 : 1));
          return (
            <div className="team-card" key={time}>
              {imgs[time] && <img className="team-img" src={imgs[time]} alt={data.teamNames[empresa]?.[time] || time} />}
              <div className="team-body">
                <h3>{data.teamNames[empresa]?.[time] || time}</h3>
                <ul className="role-list">
                  {!roster.length && <li><span className="tag-unassigned">ninguém atribuído ainda</span></li>}
                  {roster.map((aluno) => (
                    <li key={aluno.id}>
                      <span>{aluno.nome}</span>
                      <span className="role-badge" style={{ background: ROLE_COLORS[aluno.papel] }}>{aluno.papel === "Product Owner" ? "PO" : "Dev"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CorrupSabPanel({ data, empresas, updatePath }) {
  const cPts = computeCorrupcaoPontos(data.corrupcao);
  const sPts = computeSabotagemPontos(data.sabotagem);
  const compradorOptions = BUYERS.filter((buyer) => buyer !== "Militar");

  return (
    <section className="panel">
      <h2>Corrupção & Sabotagem</h2>
      <div className="desc">Estes dois mecanismos são baseados em regras fixas — os pontos abaixo são calculados automaticamente.</div>
      <div className="grid2">
        <div className="mini-card">
          <h3>Corruptor (Owner)</h3>
          <SelectRow label="Empresa do corruptor" value={data.corrupcao.empresaCorruptora} options={empresas} onChange={(value) => updatePath("corrupcao.empresaCorruptora", value)} />
          <CheckRow label="1ª descoberta ocorreu" checked={data.corrupcao.primeiraDescoberta} onChange={(value) => updatePath("corrupcao.primeiraDescoberta", value)} />
          {data.corrupcao.primeiraDescoberta && <SelectRow label="Comprador que aceitou (1ª vez)" value={data.corrupcao.primeiroComprador} options={compradorOptions} onChange={(value) => updatePath("corrupcao.primeiroComprador", value)} includeBlank />}
          <CheckRow label="2ª descoberta ocorreu (mesmo assim)" checked={data.corrupcao.segundaDescoberta} disabled={!data.corrupcao.primeiraDescoberta} onChange={(value) => updatePath("corrupcao.segundaDescoberta", value)} />
          {data.corrupcao.segundaDescoberta && <SelectRow label="Comprador que aceitou (2ª vez)" value={data.corrupcao.segundoComprador} options={compradorOptions} onChange={(value) => updatePath("corrupcao.segundoComprador", value)} includeBlank />}
          <MiniRow label="Pontos do corruptor" value={cPts.corruptor.toFixed(1)} tone={cPts.corruptor < 0 ? "neg" : ""} strong />
          {Object.entries(cPts.compradores).map(([buyer, points]) => <MiniRow key={buyer} label={`Pontos — ${buyer}`} value={points.toFixed(1)} tone={points < 0 ? "neg" : ""} />)}
          <div className="note note-red">O corruptor nunca troca de papel e continua negociando normalmente, mesmo após ser descoberto.</div>
        </div>

        <div className="mini-card">
          <h3>Sabotador (Developer)</h3>
          <SelectRow label="Empresa do sabotador" value={data.sabotagem.empresaSabotador} options={empresas} onChange={(value) => updatePath("sabotagem.empresaSabotador", value)} />
          <SelectRow label="Time do sabotador" value={data.sabotagem.timeSabotador} options={TIMES} onChange={(value) => updatePath("sabotagem.timeSabotador", value)} />
          <SelectRow label="Tipo de ação" value={data.sabotagem.tipoAcao} options={[["vazar", "Vazar informação"], ["atrapalhar", "Atrapalhar decisões/produção"]]} onChange={(value) => updatePath("sabotagem.tipoAcao", value)} />
          <CheckRow label="Sabotador foi descoberto" checked={data.sabotagem.descoberto} onChange={(value) => updatePath("sabotagem.descoberto", value)} />
          {data.sabotagem.descoberto && (
            <>
              <SelectRow label="Denúncias consecutivas recebidas" value={data.sabotagem.denunciasConsecutivas} options={[0, 1, 2]} onChange={(value) => updatePath("sabotagem.denunciasConsecutivas", Number(value))} />
              <CheckRow label="PO/colegas da área sabiam e ficaram calados" checked={data.sabotagem.areaSoubeECalou} onChange={(value) => updatePath("sabotagem.areaSoubeECalou", value)} />
            </>
          )}
          <MiniRow label="Pontos do sabotador" value={sPts.sabotador.toFixed(1)} tone={sPts.sabotador < 0 ? "neg" : ""} strong />
          <MiniRow label="Pontos da área/time" value={`${sPts.area > 0 ? "+" : ""}${sPts.area.toFixed(1)}`} tone={sPts.area < 0 ? "neg" : sPts.area > 0 ? "pos" : ""} strong />
          <MiniRow label="Demitido?" value={sPts.demitido ? "SIM — vai para o time RIVAL" : "Não"} strong />
        </div>
      </div>
    </section>
  );
}

function ResultPanel({ data, empresas }) {
  const scores = empresas.map((empresa) => ({ empresa, ...computeEmpresaScore(data, empresa) }));
  return (
    <section className="panel">
      <h2>Resultado Final</h2>
      <div className="desc">Cálculo automático a partir das médias lançadas em cada aba, ajustado pelos pontos de corrupção/sabotagem.</div>
      <div className="grid2">
        {scores.map((score, index) => (
          <div className={`dash-card dash-card-${index + 1}`} key={score.empresa}>
            <h3>{score.empresa}</h3>
            <div className="big">{score.final !== null ? score.final.toFixed(2) : "—"}</div>
            <div className="breakdown">
              {score.parts.map((part) => (
                <div key={part.key}><span>{part.key}</span><span>{part.val !== null ? part.val.toFixed(2) : "—"}</span></div>
              ))}
              <div className="adjustment-row"><span>Ajuste (corrupção/sabotagem)</span><span>{score.ajuste >= 0 ? "+" : ""}{score.ajuste.toFixed(1)}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="note note-orange">A nota final é uma média ponderada das notas médias por papel, somada aos pontos fixos de corrupção/sabotagem. Ela não substitui seu julgamento.</div>
    </section>
  );
}

function SelectRow({ label, value, options, onChange, includeBlank = false }) {
  return (
    <label className="mini-row">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {includeBlank && <option value="">—</option>}
        {options.map((option) => {
          const optionValue = Array.isArray(option) ? option[0] : option;
          const labelText = Array.isArray(option) ? option[1] : option;
          return <option key={optionValue} value={optionValue}>{labelText}</option>;
        })}
      </select>
    </label>
  );
}

function CheckRow({ label, checked, disabled = false, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function MiniRow({ label, value, tone = "", strong = false }) {
  return (
    <div className="mini-row">
      <span>{strong ? <strong>{label}</strong> : label}</span>
      <span className={`pts ${tone}`}>{value}</span>
    </div>
  );
}

const smColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "empresa", header: "Empresa", type: "static" },
  { key: "conduziu", header: "Conduziu os eventos corretamente?", type: "sn" },
  { key: "removeu", header: "Removeu impedimentos?", type: "sn" },
  { key: "ajudou", header: "Ajudou o time a melhorar entre Sprints?", type: "sn" },
  { key: "nota", header: "Nota (1-5)", type: "score" },
  { key: "obs", header: "Observações", type: "text" },
];

const ownerColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "empresa", header: "Empresa", type: "static" },
  { key: "comunicacao", header: "Comunicação com a equipe (1-5)", type: "score" },
  { key: "negociacao", header: "Negociação com compradores (1-5)", type: "score" },
  { key: "alinhamento", header: "Alinhamento com SM/PO sobre qualidade (1-5)", type: "score" },
  { key: "notaGeral", header: "Nota Geral (1-5)", type: "score" },
  { key: "obs", header: "Observações", type: "text" },
];

const poColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "empresa", header: "Empresa", type: "static" },
  { key: "time", header: "Time", type: "static" },
  { key: "requisitos", header: "Requisitos claros ao time?", type: "sn" },
  { key: "testes", header: "Acompanhou os testes de perto?", type: "sn" },
  { key: "reuniao", header: "Reunião de priorização ocorreu?", type: "sn" },
  { key: "nota", header: "Nota (1-5)", type: "score" },
  { key: "obs", header: "Observações", type: "text" },
];

const devColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "empresa", header: "Empresa", type: "static" },
  { key: "time", header: "Time", type: "static" },
  { key: "qualidade", header: "Qualidade do produto (1-5)", type: "score" },
  { key: "processo", header: "Seguiu o processo?", type: "sn" },
  { key: "colaboracao", header: "Colaboração do time (1-5)", type: "score" },
  { key: "notaTime", header: "Nota Time (1-5)", type: "score" },
  { key: "destaque", header: "Destaque individual", type: "text", placeholder: "nome (se houver)" },
];

const buyerProfColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "comprador", header: "Comprador", type: "static" },
  { key: "checklist", header: "Aplicou o checklist de verificação?", type: "sn" },
  { key: "decisoes", header: "Decisões coerentes com o papel?", type: "sn" },
  { key: "feedback", header: "Feedback construtivo nas Reviews?", type: "sn" },
  { key: "nota", header: "Nota (1-5)", type: "score" },
  { key: "obs", header: "Observações", type: "text" },
];

const buyerProductColumns = [
  { key: "sprint", header: "Sprint" },
  { key: "comprador", header: "Comprador", type: "static" },
  { key: "empresa", header: "Empresa", type: "static" },
  { key: "produto", header: "Produto", type: "static" },
  { key: "pt", header: "Padrão Técnico", type: "sn" },
  { key: "pv", header: "Padrão Visual", type: "sn" },
  { key: "prazo", header: "Prazo", type: "sn" },
  { key: "comOwner", header: "Com. Owner (1-5)", type: "score" },
  { key: "sinal", header: "Sinal", type: "sn" },
  { key: "decisao", header: "Decisão", type: "decisao" },
  { key: "nota", header: "Nota (1-5)", type: "score" },
];

export default App;
