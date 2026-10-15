// Gera ícone, splash e gráficos da Play Store a partir da própria arte do jogo
// (desenhos dos azulejos e placa do logotipo que estão em www/index.html).
// Opcional: só é preciso rodar se a arte mudar. Requer o Playwright:
//   npm run preparar && npx -y playwright@1 install chromium && node scripts/gerar-imagens.mjs
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const www = join(raiz, "www");
const html = readFileSync(join(www, "index.html"), "utf8");

const motivo = n => html.match(new RegExp(`\\.t${n}\\{--c:var\\(--t${n}\\);--m:(url\\("[^"]+"\\))`))[1];
const cores = { 1: "#2F6BFF", 2: "#FFB21A", 3: "#16C47A", 4: "#B04BF5", 5: "#16CFE0" };
const placa = html.match(/<svg viewBox="0 0 220 66"[\s\S]*?<\/svg>/)[0];
const padrao = html.match(/background-image:\s*\n\s*(url\("[^"]+"\))/)[1];
const fonte = f => "data:font/woff2;base64," + readFileSync(join(www, "fonts", f)).toString("base64");

const css = `
@font-face{font-family:"Young Serif";src:url(${fonte("young-serif-latin-400-normal.woff2")})}
@font-face{font-family:"Figtree";font-weight:800;src:url(${fonte("figtree-latin-800-normal.woff2")})}
html,body{margin:0;width:100%;height:100%}
.fundo{background:${padrao} center/calc(var(--u)*72) calc(var(--u)*72),radial-gradient(120% 90% at 50% 0%,#3A78FF 0%,#1546C9 50%,#0A1F6B 100%)}
.az{position:absolute;border-radius:12%;box-shadow:inset 0 0 0 calc(var(--u)*2.4) rgba(255,255,255,.45),inset 0 calc(var(--u)*-5) 0 rgba(0,0,0,.26),inset 0 calc(var(--u)*4) 0 rgba(255,255,255,.4),0 calc(var(--u)*5) calc(var(--u)*10) rgba(0,0,0,.35);
  background:var(--m) center/100% 100% no-repeat,linear-gradient(180deg,rgba(255,255,255,.32),rgba(255,255,255,0) 46%,rgba(0,0,0,.2)),var(--c)}
${[1, 2, 3, 4, 5].map(n => `.t${n}{--c:${cores[n]};--m:${motivo(n)}}`).join("\n")}
.placa{position:absolute;filter:drop-shadow(0 calc(var(--u)*5) 0 rgba(4,12,52,.55)) drop-shadow(0 calc(var(--u)*10) calc(var(--u)*16) rgba(2,8,40,.35))}
.placa svg{display:block;width:100%;height:auto}
`;
// 2x2 azulejos centralizados; "lado" é a fração da tela ocupada pelo bloco.
function bloco(W, lado, cy = 0.5) {
  const L = W * lado, g = L * 0.06, s = (L - g) / 2, x0 = (W - L) / 2, y0 = W * cy - L / 2;
  return [[0, 0, 2], [1, 0, 5], [0, 1, 4], [1, 1, 3]].map(([c, r, t]) =>
    `<div class="az t${t}" style="left:${x0 + c * (s + g)}px;top:${y0 + r * (s + g)}px;width:${s}px;height:${s}px"></div>`).join("");
}
function pagina(W, H, corpo, { fundo = true, u = W / 400 } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
  <body class="${fundo ? "fundo" : ""}" style="--u:${u}px;position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</body></html>`;
}
function painel(x, y, cel, grade) {
  const gap = cel * 0.06, pad = cel * 0.12, W = grade[0].length * (cel + gap) - gap + pad * 2;
  let out = `<div style="position:absolute;left:${x}px;top:${y}px;padding:${cel * 0.14}px;border-radius:${cel * 0.3}px;transform:rotate(-6deg);
    background:linear-gradient(180deg,#FBF8F1,#ECE6D8);box-shadow:0 0 0 ${cel * .05}px #1C3FAA,0 ${cel * .12}px 0 rgba(4,12,52,.6),0 ${cel * .3}px ${cel * .6}px rgba(2,8,40,.5)">
    <div style="position:relative;width:${W}px;height:${W}px;background:#0B1B5C;border-radius:${cel * 0.22}px;box-shadow:0 0 0 ${cel * .06}px #FFC93C">`;
  grade.forEach((linha, r) => [...linha].forEach((ch, c) => {
    const st = `left:${pad + c * (cel + gap)}px;top:${pad + r * (cel + gap)}px;width:${cel}px;height:${cel}px`;
    out += ch === "." ? `<div style="position:absolute;${st};border-radius:12%;background:#0A1850;box-shadow:inset 0 0 0 1px rgba(120,160,255,.14)"></div>`
      : `<div class="az t${ch}" style="${st}"></div>`;
  }));
  return out + "</div></div>";
}

const { chromium } = await import("playwright");
const nav = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
async function salvar(arquivo, W, H, conteudo, transparente = false) {
  const p = await nav.newPage({ viewport: { width: W, height: H } });
  await p.setContent(conteudo); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(raiz, arquivo), omitBackground: transparente });
  await p.close(); console.log("gerado:", arquivo);
}
mkdirSync(join(raiz, "resources"), { recursive: true }); mkdirSync(join(raiz, "loja"), { recursive: true });

await salvar("resources/icon-only.png", 1024, 1024, pagina(1024, 1024, bloco(1024, 0.62)));
await salvar("resources/icon-background.png", 1024, 1024, pagina(1024, 1024, ""));
await salvar("resources/icon-foreground.png", 1024, 1024, pagina(1024, 1024, bloco(1024, 0.44), { fundo: false }), true);
await salvar("loja/icone-play-store-512.png", 512, 512, pagina(512, 512, bloco(512, 0.62)));
const splash = pagina(2732, 2732, bloco(2732, 0.16, 0.405) + `<div class="placa" style="left:${(2732 - 1000) / 2}px;top:1380px;width:1000px">${placa}</div>`, { u: 2732 / 900 });
await salvar("resources/splash.png", 2732, 2732, splash);
await salvar("resources/splash-dark.png", 2732, 2732, splash);
await salvar("loja/grafico-destaque-1024x500.png", 1024, 500, pagina(1024, 500,
  `<div class="placa" style="left:56px;top:120px;width:470px">${placa}</div>
   <div style="position:absolute;left:60px;top:300px;width:470px;text-align:center;font:800 30px Figtree,sans-serif;color:#fff;text-shadow:0 3px 0 rgba(4,12,52,.6)">Encaixe azulejos.<br><span style="color:#FFC93C">Complete o painel.</span></div>` +
  painel(612, 66, 58, ["21.3.", "41352", ".52.1", "3.415", "1243."]), { u: 1.6 }));
await nav.close();
