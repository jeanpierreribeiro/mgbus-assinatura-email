// Proteção por código de acesso (Vercel Routing Middleware).
//
// Roda no servidor ANTES de qualquer arquivo ser entregue, então abrir
// /index.html ou qualquer outro endereço direto não funciona sem login.
//
// Variáveis de ambiente (Vercel → Settings → Environment Variables):
//   ACCESS_CODE     código que as pessoas digitam para entrar (obrigatório)
//   SESSION_SECRET  texto aleatório e longo usado para assinar o cookie
//                   (opcional; se faltar, usa o ACCESS_CODE)
// Trocar o ACCESS_CODE (ou o SESSION_SECRET) desconecta todo mundo.

import { next } from '@vercel/functions';

// Ficam públicos só o logo e os ícones: os clientes de e-mail (Gmail,
// Outlook) precisam baixá-los para exibir a assinatura.
export const config = {
  matcher: ['/((?!logo\\.png|icones/|favicon\\.ico).*)'],
};

const COOKIE = 'mgb_sessao';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias
const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
  let s = '';
  for (const b of sig) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Compara sem vazar informação pelo tempo de resposta
async function same(a, b, secret) {
  const [x, y] = await Promise.all([hmac(secret, 'cmp:' + a), hmac(secret, 'cmp:' + b)]);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

async function validSession(token, secret) {
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return same(sig, await hmac(secret, 'sessao:' + exp), secret);
}

const redirect = (to, request, headers = {}) =>
  new Response(null, { status: 303, headers: { Location: new URL(to, request.url).toString(), 'Cache-Control': 'no-store', ...headers } });

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  // Arquivos públicos (reforço caso o filtro do config não se aplique)
  if (path === '/logo.png' || path === '/favicon.ico' || path.startsWith('/icones/')) return next();

  const code = process.env.ACCESS_CODE || '';
  const secret = process.env.SESSION_SECRET || code;

  if (!code) {
    return new Response('Configure a variável de ambiente ACCESS_CODE na Vercel e publique de novo.', {
      status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // Sair
  if (path === '/logout') {
    return redirect('/login', request, { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` });
  }

  // Página e envio do login
  if (path === '/login' || path === '/login.html') {
    if (request.method === 'POST') {
      let typed = '';
      try { typed = String((await request.formData()).get('codigo') || '').trim(); } catch (e) {}
      if (typed && await same(typed, code, secret)) {
        const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
        const token = `${exp}.${await hmac(secret, 'sessao:' + exp)}`;
        return redirect('/', request, { 'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}` });
      }
      await new Promise(r => setTimeout(r, 800)); // freia tentativas em sequência
      return redirect('/login?erro=1', request);
    }
    // Já logado? vai direto para o gerador
    if (await validSession(readCookie(request, COOKIE), secret)) return redirect('/', request);
    return next();
  }

  // Todo o resto exige sessão válida
  if (await validSession(readCookie(request, COOKIE), secret)) {
    return next({ headers: { 'Cache-Control': 'private, no-store' } });
  }
  return redirect('/login', request);
}
