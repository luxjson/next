# LUXJSON — Next.js

Projeto portado para **um único aplicativo Next.js**. O backend Express original foi integrado ao App Router como Route Handlers, preservando os endpoints `/api/auth/*`, `/api/blog/*` e `/api/health`, além da conexão PostgreSQL, JWT, bcrypt, sanitização HTML e validações existentes.

## Executar

1. Copie `.env.example` para `.env.local`.
2. Preencha `DATABASE_URL` e `JWT_SECRET`.
3. Instale as dependências: `npm install`.
4. Desenvolvimento: `npm run dev`.
5. Produção: `npm run build && npm start`.

Não é necessário iniciar um segundo servidor Express.
