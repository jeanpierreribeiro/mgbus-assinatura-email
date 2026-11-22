# Gerador de assinaturas de e-mail · MG Bus & Facin Serviços

Aplicativo interno para montar e instalar a assinatura de e-mail padrão da empresa (Outlook e Gmail). O acesso é protegido por um código.

## Estrutura

```
public/            arquivos do site (o que a Vercel publica)
  index.html       o gerador (HTML/CSS/JS, sem build)
  login.html       tela do código de acesso
  logo.png         logo padrão (público: os e-mails precisam carregá-lo)
  icones/          ícones das redes sociais (públicos pelo mesmo motivo)
middleware.js      proteção por código de acesso (roda no servidor da Vercel)
vercel.json        configuração da Vercel
docs/              levantamento original do projeto
```

## Como a proteção funciona

- O `middleware.js` roda no servidor **antes** de qualquer página ser entregue. Sem login, qualquer endereço (inclusive `/index.html`) redireciona para `/login`.
- Ao digitar o código certo, o navegador recebe um cookie assinado (HttpOnly, Secure) válido por 7 dias.
- `/logout` (botão **Sair** no topo) encerra a sessão.
- Só `logo.png` e `icones/` ficam abertos, porque o Gmail e o Outlook precisam baixar essas imagens para exibir a assinatura.
- O código **não** fica no repositório: ele é lido da variável de ambiente `ACCESS_CODE`.

## Publicar na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe este repositório do GitHub.
2. Em **Framework Preset**, deixe **Other**. Não precisa de comando de build.
3. Antes de clicar em **Deploy**, abra **Environment Variables** e crie:
   - `ACCESS_CODE`: o código de acesso;
   - `SESSION_SECRET` (recomendado): um texto aleatório e longo, usado para assinar o cookie.
4. Clique em **Deploy**.

Para trocar o código depois: **Project → Settings → Environment Variables**, altere `ACCESS_CODE` e faça um novo deploy (**Deployments → ⋯ → Redeploy**). Trocar o código desconecta todo mundo.

## Uso local

Abra `public/index.html` direto no navegador. Localmente não há tela de login, e o logo e os ícones só aparecem no preview (a assinatura exportada precisa das imagens hospedadas em HTTPS, o que acontece automaticamente na Vercel).
