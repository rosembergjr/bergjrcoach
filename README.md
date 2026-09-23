# Berg Junior Coach

## Estrutura

- `public/index.html`: landing page da consultoria.
- `public/css/style.css`: visual preto e vermelho, responsivo.
- `public/js/main.js`: envia a avaliação para `/api/leads`.
- `server.js` e `src/`: API e banco local/remoto.
- `public/assets/`: três fotos fornecidas, já posicionadas na página.

## Rodar no Windows / VS Code

Extraia este ZIP e abra a pasta no VS Code. No terminal, execute `npm ci` e `npm start`. Abra `http://localhost:3000`. Caso a porta 3000 já esteja ocupada, encerre a outra instância ou defina `PORT=3001` no `.env` e acesse a porta 3001.

Crie um `.env` na raiz usando `.env.example` como referência. Escolha uma chave aleatória para `ADMIN_API_KEY` e não divulgue o arquivo. Em desenvolvimento, o banco local é criado automaticamente em `database/leads.sqlite`.

Para consultar os leads no PowerShell, em outro terminal na pasta do projeto:

```powershell
$chave = (Get-Content .env | Where-Object { $_ -match '^ADMIN_API_KEY=' }) -replace '^ADMIN_API_KEY=', ''
Invoke-RestMethod -Uri 'http://localhost:3000/api/leads' -Headers @{ 'x-admin-key' = $chave }
```

Ajuste a porta do comando se estiver usando 3001. Os arquivos `database/leads.sqlite` antigos não estão no ZIP: guarde o banco anterior se precisar preservar os leads já coletados.

## Publicação

O projeto reconhece `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` para salvar leads em banco persistente. Configure essas duas variáveis e `ADMIN_API_KEY` em Production na Vercel; não publique `.env`, `database/` ou tokens. Os leads locais não são transferidos automaticamente para o banco remoto. A Vercel usa `server.js` como Express e serve `public/` como arquivos estáticos. Teste envio e consulta protegida no ambiente publicado antes de divulgar o endereço.

Antes de captar leads em produção, publique uma política de privacidade e defina retenção e canal de exclusão de dados adequados ao negócio.
