// Copia as fontes para dentro do app (para funcionar offline) e gera www/ads-config.js
// a partir de admob.config.json. Rodado automaticamente por "npm run android:sync".
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const www = join(raiz, "www");
const fontesDir = join(www, "fonts");
mkdirSync(fontesDir, { recursive: true });

const fontes = [
  ["@fontsource/young-serif", "young-serif-latin-400-normal.woff2"],
  ["@fontsource/figtree", "figtree-latin-400-normal.woff2"],
  ["@fontsource/figtree", "figtree-latin-600-normal.woff2"],
  ["@fontsource/figtree", "figtree-latin-800-normal.woff2"],
];
for (const [pkg, arquivo] of fontes) {
  const origem = join(raiz, "node_modules", pkg, "files", arquivo);
  if (existsSync(origem)) copyFileSync(origem, join(fontesDir, arquivo));
  else console.warn(`Aviso: fonte não encontrada (${arquivo}). Rode "npm install". O jogo usa uma fonte do sistema no lugar.`);
}

const cfg = JSON.parse(readFileSync(join(raiz, "admob.config.json"), "utf8"));
const publico = {
  modoTeste: !!cfg.modoTeste,
  banner: cfg.banner,
  intersticial: cfg.intersticial,
  premiado: cfg.premiado,
  intersticialACadaPartidas: cfg.intersticialACadaPartidas ?? 3,
  intervaloMinimoIntersticialSegundos: cfg.intervaloMinimoIntersticialSegundos ?? 90,
};
writeFileSync(
  join(www, "ads-config.js"),
  "// Gerado por scripts/preparar.mjs a partir de admob.config.json. Não edite aqui.\nwindow.ADS_CONFIG = " +
    JSON.stringify(publico, null, 2) + ";\n"
);

if (cfg.modoTeste) console.log("AdMob: MODO TESTE ligado (anúncios de teste). Desligue antes de publicar.");
else if (String(cfg.appId).startsWith("ca-app-pub-3940256099942544"))
  console.warn("ATENÇÃO: modoTeste está false mas os IDs ainda são os de teste do Google. Troque pelos seus IDs do AdMob.");
console.log("www pronto.");
