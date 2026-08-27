# Painel de Avaliação — Simulação Scrum Competitiva (React)

Port para React + Node/Express do painel usado em aula.

## Pré-requisitos
- Node.js 18+
- Git

## Como rodar

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Sobe em `http://localhost:3001`.

### 2. Frontend (outro terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Abre em `http://localhost:5173`.

## Salvamento
- Automático: salva sozinho 1,5s depois de qualquer alteração.
- Manual: botão "Salvar agora".
- Os dados ficam em `backend/data/dados.json` (não versionado no Git).

## Deploy
- Frontend: `<link>`
- Backend: `<link>`

## Equipe
- `<nome 1>`
- `<nome 2>`
- `<nome 3>`