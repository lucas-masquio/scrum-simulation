export const AUTO_SAVE_DELAY_MS = 1500;
export const SPRINTS = [1, 2, 3];
export const TIMES = ["Caça", "Transporte"];
export const BUYERS = ["Governo", "Militar", "Setor Privado"];
export const PAPEIS = [
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
  "ALAN FERREIRA DE OLIVEIRA", "ANDRÉ LUIZ VICENZI RIGO", "ARTHUR HENRIQUE LORENZETT",
  "BRUNO DE DAVID REIS", "CARLOS EDUARDO ALMEIDA DA CONCEICAO", "CARLOS JHONATAS DE SOUZA AMORIM",
  "CAUAN BRUNO ALTHAUS RIFFEL", "FILIPE GABRIEL HOLLMANN", "FILIPE JOSÉ DA COSTA NUNES",
  "GABRIEL CRISTIAN VIVIAN SOMARIVA", "GABRIEL DE CARVALHO BARRETO", "GIOVANI RICARDO POTT",
  "GUSTAVO SCHWITZKI PERETTI", "ISAEL SOARES DOS SANTOS", "JADSON BUTZK", "JÉSSICA FERNANDA RUBAS",
  "JOÃO VITOR RAIMUNDI", "KAUAN LUCAS TOLDO", "LEONARDO SCHIMIDT LOPES", "LORENZO PIVA MAY",
  "MARIA EDUARDA EMELAU JOBIM", "MATTEO DALLA COSTA THOMÉ", "NATAN ELIAS PATZLAFF",
  "NICOLAS LISBOA FIGUEIREDO MULLER", "NICOLE BONASSI BET", "RAFAEL WILLIAM HAUPT FLORES",
  "SAMIRA GREGORIO VIEIRA", "VICENTE DAGOSTIN PILONETTO", "VINICIUS TEBALDI BORSATTI",
  "WILLIAM KUNZLER", "YASMIN MARIA ZERBIELLI",
];

export const DEFAULT_A = "Maverick Aviation";
export const DEFAULT_B = "SkyForge Ind. Aeronáutica";
export const TEAM_IMAGES = {
  [DEFAULT_A]: { logo: "/images/maverick_caca.jpg", Caça: "/images/maverick_caca.jpg", Transporte: "/images/maverick_cargo.jpg" },
  [DEFAULT_B]: { logo: "/images/skyforge_caca.jpg", Caça: "/images/skyforge_caca.jpg", Transporte: "/images/skyforge_cargo.jpg" },
};
export const BUYER_IMAGES = {
  Governo: "/images/governo_caca.jpg",
  Militar: "/images/militar.jpg",
  "Setor Privado": "/images/empresa_privada.jpg",
};
export const ROLE_COLORS = {
  "Scrum Master": "#455F51", "Product Owner": "#029676", "Owner/Stakeholder": "#0989B1",
  Developer: "#549E39", "Comprador - Governo": "#E8871E", "Comprador - Militar": "#B33A3A",
  "Comprador - Setor Privado": "#E8871E",
};
export const WEIGHT_LABELS = { sm: "Scrum Master", owner: "Owner", po: "Product Owner", dev: "Developers", buyer: "Avaliação dos Compradores" };
export const TABS = [
  ["setup", "Configuração"], ["alunos", "Alunos"], ["escalacao", "Escalação"], ["sm", "Scrum Master"],
  ["owner", "Owner"], ["po", "Product Owner"], ["dev", "Developers"], ["buyerProf", "Compradores (Papel)"],
  ["buyerProduct", "Compradores (Produto)"], ["corrupsab", "Corrupção & Sabotagem"], ["result", "Resultado Final"],
];

export function construirDadosIniciais(empresaA = DEFAULT_A, empresaB = DEFAULT_B) {
  const empresas = [empresaA, empresaB];
  const sm = [], owner = [], po = [], dev = [], buyerProf = [], buyerProduct = [];
  SPRINTS.forEach((sprint) => {
    empresas.forEach((empresa) => {
      sm.push({ sprint, empresa, conduziu: "", removeu: "", ajudou: "", nota: "", obs: "" });
      owner.push({ sprint, empresa, comunicacao: "", negociacao: "", alinhamento: "", notaGeral: "", obs: "" });
      TIMES.forEach((time) => {
        po.push({ sprint, empresa, time, requisitos: "", testes: "", reuniao: "", nota: "", obs: "" });
        dev.push({ sprint, empresa, time, qualidade: "", processo: "", colaboracao: "", notaTime: "", destaque: "" });
      });
    });
    BUYERS.forEach((comprador) => buyerProf.push({ sprint, comprador, checklist: "", decisoes: "", feedback: "", nota: "", obs: "" }));
    empresas.forEach((empresa) => {
      [["Governo", "Caça"], ["Governo", "Transporte"], ["Militar", "Caça"], ["Setor Privado", "Transporte"]].forEach(([comprador, produto]) => {
        buyerProduct.push({ sprint, comprador, empresa, produto, pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      });
    });
  });
  return {
    meta: { turma: "", data: "", empresaA, empresaB, fontScale: 16 }, sm, owner, po, dev, buyerProf, buyerProduct,
    corrupcao: { empresaCorruptora: empresaA, primeiraDescoberta: false, primeiroComprador: "", segundaDescoberta: false, segundoComprador: "" },
    sabotagem: { empresaSabotador: empresaA, timeSabotador: "Caça", tipoAcao: "atrapalhar", denunciasConsecutivas: 0, descoberto: false, areaSoubeECalou: false },
    weights: { sm: 1, owner: 1, po: 1, dev: 2, buyer: 2 },
    teamNames: { [empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" }, [empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" } },
    alunos: SEED_NAMES.map((nome, index) => ({ id: index + 1, nome, empresa: "", time: "", papel: "" })),
  };
}

export function garantirDadosCarregados(parsed) {
  const fallback = construirDadosIniciais();
  return { ...fallback, ...parsed, meta: { ...fallback.meta, ...(parsed.meta || {}), fontScale: parsed.meta?.fontScale || 16 }, weights: { ...fallback.weights, ...(parsed.weights || {}) }, teamNames: parsed.teamNames || fallback.teamNames, alunos: parsed.alunos || fallback.alunos };
}

const average = (values) => { const numbers = values.map(Number).filter((value) => !Number.isNaN(value)); return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null; };
export function calcularPontosCorrupcao(corrupcao) {
  let corruptor = 0; const compradores = {};
  if (corrupcao.primeiraDescoberta) { corruptor -= 1; if (corrupcao.primeiroComprador) compradores[corrupcao.primeiroComprador] = (compradores[corrupcao.primeiroComprador] || 0) - 1; }
  if (corrupcao.segundaDescoberta) { corruptor -= 1; if (corrupcao.segundoComprador) compradores[corrupcao.segundoComprador] = (compradores[corrupcao.segundoComprador] || 0) - 1; }
  return { corruptor, compradores };
}
export function calcularPontosSabotagem(sabotagem) {
  let sabotador = 0, area = 0, demitido = false;
  if (sabotagem.descoberto) { sabotador -= 1; area += sabotagem.areaSoubeECalou ? -1 : 1; if (sabotagem.tipoAcao === "vazar" && sabotagem.denunciasConsecutivas >= 1) demitido = true; if (sabotagem.tipoAcao === "atrapalhar" && sabotagem.denunciasConsecutivas >= 2) demitido = true; }
  return { sabotador, area, demitido };
}
export function calcularNotaEmpresa(data, empresa) {
  const parts = [
    { key: "Scrum Master", val: average(data.sm.filter((row) => row.empresa === empresa).map((row) => row.nota)), w: data.weights.sm },
    { key: "Owner", val: average(data.owner.filter((row) => row.empresa === empresa).map((row) => row.notaGeral)), w: data.weights.owner },
    { key: "Product Owner", val: average(data.po.filter((row) => row.empresa === empresa).map((row) => row.nota)), w: data.weights.po },
    { key: "Developers", val: average(data.dev.filter((row) => row.empresa === empresa).map((row) => row.notaTime)), w: data.weights.dev },
    { key: "Avaliação dos Compradores", val: average(data.buyerProduct.filter((row) => row.empresa === empresa).map((row) => row.nota)), w: data.weights.buyer },
  ];
  const scored = parts.filter((part) => part.val !== null); const sumW = scored.reduce((sum, part) => sum + Number(part.w || 0), 0); const base = sumW ? scored.reduce((sum, part) => sum + part.val * Number(part.w || 0), 0) / sumW : null;
  const cPts = calcularPontosCorrupcao(data.corrupcao); const sPts = calcularPontosSabotagem(data.sabotagem); let ajuste = 0;
  if (data.corrupcao.empresaCorruptora === empresa) ajuste += cPts.corruptor;
  if (data.sabotagem.empresaSabotador === empresa) ajuste += sPts.sabotador + sPts.area;
  return { base, ajuste, final: base !== null ? base + ajuste : null, parts };
}

export function construirResumoAlunos(data, empresas) {
  const counts = {}; empresas.forEach((empresa) => { counts[empresa] = { "Scrum Master": 0, "Owner/Stakeholder": 0, "Product Owner-Caça": 0, "Product Owner-Transporte": 0, "Developer-Caça": 0, "Developer-Transporte": 0 }; });
  const buyerCounts = { "Comprador - Governo": 0, "Comprador - Militar": 0, "Comprador - Setor Privado": 0 };
  data.alunos.forEach((aluno) => { if (buyerCounts[aluno.papel] !== undefined) buyerCounts[aluno.papel] += 1; else if (["Scrum Master", "Owner/Stakeholder"].includes(aluno.papel)) counts[aluno.empresa]?.[aluno.papel] !== undefined && (counts[aluno.empresa][aluno.papel] += 1); else if (["Product Owner", "Developer"].includes(aluno.papel) && aluno.time) counts[aluno.empresa]?.[`${aluno.papel}-${aluno.time}`] !== undefined && (counts[aluno.empresa][`${aluno.papel}-${aluno.time}`] += 1); });
  return { counts, buyerCounts, naoAtribuidos: data.alunos.filter((aluno) => !aluno.papel).length };
}
