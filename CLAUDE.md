# CLAUDE.md: Azulejaria

Este arquivo dá o contexto completo do projeto para o Claude Code. Leia inteiro antes de mudar qualquer coisa.

## 1. O que é o projeto

**Azulejaria** é um jogo mobile de quebra-cabeça de encaixe (gênero "block puzzle") para Android, inspirado na mecânica do Block Blast!, mas com identidade própria: as peças são **azulejos portugueses esmaltados** (azul-cobalto, ocre, verde, manganês e turquesa, com motivo de losango e ponto branco).

- **Plataforma:** Android (Play Store). O jogo é web (HTML/CSS/JS puro) empacotado com **Capacitor 8**.
- **Monetização:** apenas anúncios do **Google AdMob** (banner, intersticial e vídeo premiado). Sem compras dentro do app por enquanto.
- **Idioma da interface:** português do Brasil.
- **Público:** casual, 13 anos ou mais (não marcar como infantil na Play Store).
- **Dono:** desenvolvedor solo, iniciante em publicação Android. Explique comandos e passos de forma simples quando ele pedir ajuda.

## 2. Meta do projeto

Publicar o Azulejaria na Google Play Store e gerar receita com anúncios, seguindo o modelo do Block Blast!:

1. **Curto prazo:** app aprovado na Play Store, com anúncios reais funcionando e teste fechado concluído (12 testadores por 14 dias).
2. **Médio prazo:** retenção do dia 1 acima de 35–40% e crescimento orgânico por vídeos curtos (TikTok, Reels, Shorts) e ASO.
3. **Longo prazo:** quando a receita por jogador superar o custo por instalação, investir em aquisição paga.

Toda decisão deve priorizar, nesta ordem: **(1) o jogador voltar no dia seguinte**, **(2) estabilidade e conformidade com as políticas do Google**, **(3) receita**. Anúncio que irrita e derruba a retenção é prejuízo.

## 3. Restrições importantes (não violar)

- **Não copiar nada do Block Blast!**: nome, logo, ícone, cores, sons, textos ou imagens. A mecânica de jogo pode ser parecida; os assets e a marca precisam ser originais.
- **Não clicar em anúncios reais** nem incentivar cliques. Contas AdMob são banidas por isso.
- **Não mostrar intersticial no meio de uma jogada**, só em transições (nova partida).
- **Vídeo premiado sempre opcional** e com recompensa clara antes de assistir.
- **targetSdkVersion e compileSdkVersion = 36 ou mais**. É exigência da Play Store para apps novos desde 31/08/2026.
- **O jogo deve funcionar 100% offline.** Sem internet, apenas não aparecem anúncios. Nunca bloquear a jogabilidade esperando anúncio.
- **Não adicionar bibliotecas pesadas ou frameworks** (React, bundlers) sem necessidade. O jogo é JS puro de propósito: leve e rápido em celulares fracos.
- **Nunca commitar** a keystore (`*.jks`, `*.keystore`) nem senhas.

## 4. Estrutura de arquivos

```
azulejaria/
├── CLAUDE.md                  ← este arquivo
├── GUIA.md                    ← passo a passo de publicação para o dono (linguagem leiga)
├── package.json               ← dependências e scripts npm
├── capacitor.config.json      ← appId (pacote), appName, webDir=www
├── admob.config.json          ← IDs do AdMob, modoTeste, frequência de anúncios (FONTE ÚNICA)
├── politica-de-privacidade.html ← hospedar no GitHub Pages; link vai na Play Console
├── www/                       ← o jogo (é o que vai dentro do app)
│   ├── index.html             ← jogo completo: HTML + CSS + JS em um arquivo
│   ├── ads.js                 ← camada de anúncios (window.Anuncios)
│   ├── sons.js                ← efeitos sonoros sintetizados com Web Audio (window.Sons)
│   ├── ads-config.js          ← GERADO por scripts/preparar.mjs — não editar
│   └── fonts/                 ← GERADO (copiado de node_modules/@fontsource)
├── scripts/
│   ├── preparar.mjs           ← copia fontes e gera www/ads-config.js
│   ├── configurar-android.mjs ← insere App ID do AdMob no AndroidManifest, trava retrato, checa targetSdk
│   └── gerar-imagens.mjs      ← gera ícone, splash e gráficos da loja a partir da arte do jogo (opcional, usa Playwright)
├── resources/                 ← ícone/splash fonte para @capacitor/assets
├── loja/                      ← ícone 512px e gráfico de destaque 1024x500 da Play Store
└── android/                   ← GERADO por "npx cap add android" (não existe até rodar)
```

## 5. Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências |
| `npm run web` | Roda o jogo no navegador (anúncios simulados) |
| `npm run android:criar` | Cria a pasta `android/`, configura AdMob e gera ícones. Só na primeira vez |
| `npm run android:sync` | Copia mudanças de `www/` e `admob.config.json` para o Android. **Rodar sempre após editar** |
| `npm run android:abrir` | Abre o projeto no Android Studio |

O build de release (.aab) é feito no Android Studio: **Build → Generate Signed App Bundle**. A cada atualização publicada, incrementar `versionCode` e `versionName` em `android/app/build.gradle`.

## 6. Regras do jogo (implementação atual em `www/index.html`)

- **Tabuleiro:** 8×8 (`N = 8`). Estado em `S.grid`, array de 64 posições: `0` = vazio, `1`–`5` = cor do azulejo.
- **Bandeja:** 3 peças (`S.tray`). Quando as 3 são usadas, vêm 3 novas aleatórias.
- **Peças:** 17 formatos base em `BASES` (strings tipo `"#./##"`, onde `/` separa linhas), com todas as rotações geradas automaticamente em `FAMILIES`. Inclui: 1 a 5 em linha, quadrado 2×2, 3×3, retângulo 2×3, cantos pequeno/grande, L, J, T, S, Z e diagonais de 2 e 3.
- **Jogada:** arrastar a peça (pointer events). No toque, a peça fica 1,8 célula acima do dedo para ficar visível. Prévia mostra onde cai e quais linhas vão sumir.
- **Limpeza:** linhas e colunas completas somem ao mesmo tempo.
- **Pontuação:**
  - +1 ponto por azulejo colocado;
  - linhas: `linhas × 10 × (linhas > 1 ? linhas : 1) × max(1, combo)`;
  - **Painel limpo** (tabuleiro vazio após limpeza): +300.
- **Combo:** cada jogada que limpa linha aumenta `S.combo`. Após **3 jogadas seguidas sem limpar** (`S.since >= 3`), o combo zera.
- **Fim de jogo:** quando nenhuma peça da bandeja cabe em lugar nenhum (`S.over = true`).
- **Continuar (revive):** 1 vez por partida (`S.revived`), após vídeo premiado. Dá 3 peças pequenas (índices `PEQUENAS` em `BASES`) que cabem.
- **Persistência:** `localStorage` com as chaves `azulejaria-estado` (partida atual) e `azulejaria-best` (recorde). Sempre em try/catch.
- **Sons (`www/sons.js`):** sintetizados na hora com Web Audio, sem arquivos de áudio e 100% originais. Identidade sonora: azulejo + guitarra portuguesa (cordas de aço em pares, algoritmo Karplus-Strong). Encaixe = "clinc" de cerâmica; limpar = notas dedilhadas na pentatônica de Lá que sobem com o combo; painel limpo = acorde rasgado; recorde = arpejo; fim de jogo = descida em Lá menor harmônico ("suspiro" de fado). Botão de alto-falante no topo, salvo na chave `azulejaria-som`. O áudio começa após o primeiro toque e pausa em segundo plano.
- **Depuração:** `window.__azulejaria` expõe `S`, `fits`, `anyFit`, `fullLines`, `place`, `revive` e `FAMILIES` para testes automatizados.

## 7. Anúncios (`www/ads.js` + `admob.config.json`)

Plugin: **@capacitor-community/admob**, acessado via `Capacitor.Plugins.AdMob` (sem bundler). No navegador, tudo é simulado.

| Formato | Quando | Regra |
|---|---|---|
| Banner adaptativo | Sempre, embaixo | A altura vira a variável CSS `--banner-h`, e o layout sobe para não ficar coberto |
| Intersticial | Ao iniciar nova partida (`Anuncios.talvezIntersticial()`) | Só a cada `intersticialACadaPartidas` (3) e `intervaloMinimoIntersticialSegundos` (90 s). Nunca logo ao abrir o app |
| Premiado | Botão "Continuar" no fim de jogo | `Anuncios.mostrarPremiado()` resolve `true` só se o jogador ganhou a recompensa |

- Consentimento GDPR/UMP: `requestConsentInfo` + `showConsentForm` na inicialização.
- `modoTeste: true` usa os IDs de teste oficiais do Google (`ca-app-pub-3940256099942544...`). **Antes de publicar**: IDs reais e `modoTeste: false`, depois `npm run android:sync`. O `preparar.mjs` avisa se estiver inconsistente.
- API pública: `window.Anuncios = { iniciar, talvezIntersticial, premiadoDisponivel, mostrarPremiado }`. Ao mudar a lógica de anúncios, mantenha essa interface.

## 8. Identidade visual

Conceito: **um painel de azulejos de Lisboa**. Tema único, sempre escuro-azulado (não segue o modo claro do sistema).

- **Logotipo:** "placa de rua" esmaltada no estilo das placas de azulejo de Lisboa: azulejos brancos com rejunte, moldura dupla cobalto, cantos com rosetas douradas e o nome em Young Serif cobalto. É um SVG inline no `<header>` de `www/index.html` (também usado nas imagens da loja).
- **Fundo:** gradiente azul-royal com um padrão de azulejo (estrela de 4 pontas + quartos de círculo nos cantos) em branco bem suave.
- **Painel:** moldura creme com cercadura cobalto (losangos), filete dourado, casas vazias azul-noite com um losango "gravado".
- **Azulejos:** cada cor tem seu desenho (ajuda daltônicos): `t1` cobalto `#2F6BFF` = flor de 4 pétalas; `t2` âmbar `#FFB21A` = losango; `t3` esmeralda `#16C47A` = anel com 4 pontos; `t4` manganês `#B04BF5` = estrela; `t5` turquesa `#16CFE0` = quadrifólio. Todos têm quartos de círculo nos cantos, então azulejos vizinhos formam círculos, como num padrão de azulejaria real. Os desenhos são SVGs em data URI na variável `--m` de cada `.tN`.
- **Placas de diálogo** (fim de jogo e confirmação): mesmo esmalte creme com moldura cobalto (`.cartao`).
- **Textos:** elogios ao limpar 2/3/4+ linhas: "Primoroso!", "Magnífico!", "Obra-prima!"; "Painel limpo!" e "Novo recorde!" (avisado na hora em que o recorde é batido). Fim de jogo: "Painel cheio". Dica inicial no rodapé: "Arraste os azulejos para o painel".
- **Efeitos:** azulejo "pula" ao encaixar, estilhaços coloridos (canvas `#fx`) ao limpar, peças novas entram com salto. Tudo desligado com `prefers-reduced-motion`.
- **Fontes:** Young Serif (logo, títulos, elogios) e Figtree (textos), servidas localmente de `www/fonts/`.
- **Layout:** retrato, 360 a 440 px de largura. O painel encolhe em telas baixas (`--banner-h` e `100dvh`), com safe areas (`env(safe-area-inset-*)`).

## 9. Como testar

1. **Navegador:** `npm run web` e testar no modo celular do DevTools.
2. **Automatizado:** dá para usar Playwright, abrindo `www/index.html` em viewport 390×800 e jogando via `window.__azulejaria` (preencher jogadas até `S.over`, clicar em `#revive`, recarregar e conferir que a partida foi retomada).
3. **Celular real:** `npm run android:sync` e ▶ no Android Studio. Os anúncios de teste aparecem com a etiqueta "Test Ad".

Antes de considerar uma mudança pronta: jogo abre sem erro no console, arrastar funciona no toque, fim de jogo aparece, "Continuar" funciona uma vez só e a partida é retomada ao reabrir.

## 10. Requisitos da Play Store (checklist)

- [ ] `appId` único em `capacitor.config.json` (não dá para mudar depois de publicar)
- [ ] targetSdk/compileSdk 36+ em `android/variables.gradle`
- [ ] IDs reais do AdMob e `modoTeste: false`
- [ ] Política de privacidade hospedada (GitHub Pages) e link na Play Console
- [ ] Declarações: contém anúncios = sim; usa ID de publicidade = sim; público 13+
- [ ] Segurança dos dados: IDs do dispositivo, interações com o app e diagnósticos (via AdMob)
- [ ] Classificação de conteúdo (questionário IARC)
- [ ] Ícone 512px, gráfico de destaque 1024×500 (em `loja/`) e pelo menos 2 capturas de tela
- [ ] Teste fechado: 12 testadores por 14 dias seguidos (contas pessoais novas)
- [ ] Após publicar: vincular o app à loja no AdMob e publicar `app-ads.txt` no site do desenvolvedor

## 11. Próximos passos sugeridos (backlog)

Em ordem de prioridade, sempre pensando em retenção primeiro:

1. **Firebase Analytics + Crashlytics**: medir retenção D1/D7, duração das partidas e uso do "Continuar".
2. ~~**Sons e efeitos**~~ (feito: `www/sons.js`).
3. **Missão/desafio diário** para trazer o jogador de volta todo dia.
4. **Tutorial** de 3 passos na primeira partida.
5. **Modo aventura**: fases com objetivos (ex.: limpar azulejos especiais).
6. **Remote Config** para ajustar frequência de anúncios sem nova versão.
7. Avaliar **"remover anúncios" pago** só depois de ter dados de retenção.

Ao implementar qualquer item: mudanças pequenas, uma por vez, testadas e sem quebrar o funcionamento offline.

## 12. Convenções de código

- JS puro, sem build. Funções curtas, nomes em português ou inglês (manter o estilo do arquivo que está editando).
- Textos visíveis ao jogador sempre em **português do Brasil**, curtos e diretos.
- Todo acesso a `localStorage` em try/catch.
- Não editar arquivos gerados (`www/ads-config.js`, `www/fonts/`, partes geradas de `android/`), exceto `AndroidManifest.xml` e `variables.gradle` quando necessário.
- Após mudar `www/` ou `admob.config.json`: lembrar o dono de rodar `npm run android:sync`.
