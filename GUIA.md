# Azulejaria: do código à Play Store

Este projeto já tem o jogo pronto para Android, com anúncios do AdMob no mesmo modelo do Block Blast!:

| Anúncio | Onde aparece | Configuração |
|---|---|---|
| Banner | Fixo embaixo da tela, o tempo todo | Adaptativo, o jogo sobe para não ficar coberto |
| Intersticial | Ao começar uma nova partida | No máximo 1 a cada 3 partidas e 90 segundos (ajustável) |
| Vídeo premiado | Botão "Continuar" quando o jogador perde | 1 vez por partida; dá 3 peças pequenas que cabem |

Sem internet, o jogo funciona normalmente e simplesmente não mostra anúncios. A partida fica salva se o app for fechado.

---

## O que tem em cada pasta

```
azulejaria/
├── www/                    ← o jogo (HTML/JS). É aqui que você mexe na jogabilidade
│   ├── index.html          ← jogo completo
│   └── ads.js              ← lógica dos anúncios
├── admob.config.json       ← SEUS IDs do AdMob (único arquivo que precisa editar para anúncios)
├── capacitor.config.json   ← nome do app e ID do pacote
├── resources/              ← ícone e tela de abertura (geram os ícones do Android)
├── loja/                   ← imagens para a página da Play Store
├── scripts/                ← automações (não precisa mexer)
└── politica-de-privacidade.html
```

---

## Passo 1: instalar as ferramentas (uma vez só)

1. **Node.js** versão 22 ou mais nova: <https://nodejs.org> (baixe a versão LTS).
2. **Android Studio**: <https://developer.android.com/studio>. Na primeira abertura, aceite instalar o Android SDK.
3. Abra o terminal (no Windows, o "Prompt de Comando" ou "PowerShell") na pasta `azulejaria` e rode:

```bash
npm install
```

> Se der erro de versão no `@capacitor-community/admob`, rode `npm install @capacitor-community/admob@latest` e depois `npm install` de novo.

## Passo 2: testar no navegador (opcional, rápido)

```bash
npm run web
```

Abra o endereço que aparecer (ex.: http://localhost:3000). No navegador, os anúncios são simulados: o botão "Continuar" funciona direto, sem vídeo.

## Passo 3: mudar o ID do app (importante, não dá para trocar depois de publicar)

Em `capacitor.config.json`, troque `"br.app.azulejaria"` por algo único seu, por exemplo `com.seunome.azulejaria`. Só letras minúsculas, números e pontos.

## Passo 4: criar o projeto Android

```bash
npm run android:criar
```

Isso cria a pasta `android/`, coloca o App ID do AdMob no app, trava a tela em retrato e gera os ícones.

Depois abra `android/variables.gradle` e confira que estas linhas estão com **36** ou mais (exigência da Play Store desde 31/08/2026):

```
compileSdkVersion = 36
targetSdkVersion = 36
```

## Passo 5: rodar no seu celular

1. No celular: Configurações → Sobre o telefone → toque 7 vezes em "Número da versão" para liberar o modo desenvolvedor. Depois ative "Depuração USB" em Opções do desenvolvedor.
2. Ligue o celular no PC pelo cabo.
3. Rode `npm run android:abrir`. O Android Studio abre o projeto.
4. Espere ele terminar de sincronizar (barra embaixo) e clique no ▶ verde.

Você deve ver anúncios com a etiqueta **"Test Ad"**. Isso é o esperado nesta fase.

**Sempre que mudar algo em `www/` ou no `admob.config.json`, rode `npm run android:sync` antes de dar ▶ de novo.**

---

## Passo 6: criar a conta no AdMob e pegar seus IDs

1. Entre em <https://admob.google.com> com sua conta Google e preencha os dados de pagamento e impostos.
2. **Apps → Adicionar app → Android → "Não, ainda não está publicado"**. Nome: Azulejaria.
3. Copie o **ID do app** (formato `ca-app-pub-XXXX~YYYY`).
4. Dentro do app, crie 3 **blocos de anúncios**:
   - **Banner** → copie o ID (`ca-app-pub-XXXX/ZZZZ`)
   - **Intersticial** → copie o ID
   - **Premiado** (Rewarded) → copie o ID
5. Em **Privacidade e mensagens**, crie uma mensagem de consentimento **GDPR** para o app. O jogo já mostra esse aviso para jogadores da Europa automaticamente.
6. Cole os 4 IDs no `admob.config.json` e mude `"modoTeste": true` para `false`.
7. Rode `npm run android:sync`.

> ⚠️ **Nunca clique nos seus próprios anúncios reais.** O Google bane contas por isso. Para testar no seu celular com IDs reais, cadastre o aparelho como dispositivo de teste em AdMob → Configurações → Dispositivos de teste.

---

## Passo 7: gerar o arquivo para a Play Store (.aab)

No Android Studio: **Build → Generate Signed App Bundle or APK → Android App Bundle**.

- Na primeira vez, clique em **Create new...** para criar a chave de assinatura (keystore).
- **Guarde o arquivo da chave e a senha em dois lugares seguros** (ex.: pendrive e Google Drive). Sem ela você não consegue atualizar o app. O Google guarda uma cópia se você usar o "Play App Signing" (recomendado, vem ativado).
- Escolha **release** e finalize. O arquivo sai em `android/app/release/app-release.aab`.

Para cada atualização futura, aumente `versionCode` (1, 2, 3...) e `versionName` ("1.0.1"...) em `android/app/build.gradle`.

---

## Passo 8: publicar na Play Store

1. Crie a conta em <https://play.google.com/console>. Custa **US$ 25, uma vez só**, e pede verificação de identidade.
2. **Criar app** → nome Azulejaria, idioma Português (Brasil), Jogo, Gratuito.
3. **Hospede a política de privacidade** (o Google exige um link público):
   - Edite `politica-de-privacidade.html` e troque `[SEU NOME]` e `[SEU E-MAIL]`.
   - Jeito mais fácil e grátis: crie um repositório público no GitHub, suba esse arquivo com o nome `index.html` e ative **Settings → Pages**. O link fica tipo `https://seuusuario.github.io/azulejaria/`.
4. Preencha as seções de **Conteúdo do app**:
   - **Política de privacidade**: cole o link.
   - **Anúncios**: **Sim, contém anúncios**.
   - **Público-alvo**: escolha **13 anos ou mais**. Marcar crianças obriga regras bem mais rígidas para anúncios.
   - **Classificação do conteúdo**: responda o questionário (é um jogo de quebra-cabeça sem violência; deve sair "Livre").
   - **Segurança dos dados**: declare que o app coleta, por causa do AdMob: *ID do dispositivo ou outros IDs* (publicidade), *Interações com o app* e *Diagnósticos (falhas)*. Dados criptografados em trânsito: sim. Não há conta de usuário.
   - **ID de publicidade**: sim, o app usa (para anúncios).
5. **Página da loja**:
   - Ícone: `loja/icone-play-store-512.png`
   - Gráfico de destaque: `loja/grafico-destaque-1024x500.png`
   - Capturas de tela: tire pelo menos 2 prints do jogo rodando no celular
   - Descrição curta (até 80 caracteres), sugestão: *Encaixe azulejos, complete linhas e colunas e bata seu recorde!*
6. **Teste fechado obrigatório**: contas pessoais novas precisam ter **12 testadores** com o app instalado por **14 dias seguidos** antes de liberar para todo mundo. Chame amigos e família (eles entram por um link de teste e precisam de conta Google). Depois desses 14 dias, peça o acesso à **Produção**.
7. Depois de publicado, volte ao AdMob e **vincule o app à loja** (Apps → Configurações do app → Loja de aplicativos). Sem isso os anúncios reais rendem pouco ou nada.
8. **app-ads.txt**: o AdMob vai pedir esse arquivo. Coloque a linha que ele mostrar no mesmo site do GitHub Pages (arquivo `app-ads.txt` na raiz) e informe esse site como "site do desenvolvedor" na Play Store.

---

## Depois de publicar: como fazer crescer

O que fez o Block Blast! crescer, adaptado para quem está começando:

- **Retenção primeiro.** Olhe no Play Console (Estatísticas) quantos jogadores voltam no dia seguinte. Acima de 35–40% é bom sinal; abaixo disso, melhore o jogo antes de divulgar.
- **Vídeos curtos de gameplay** (TikTok, Reels, Shorts): limpar várias linhas de uma vez e o "Painel limpo" são os momentos mais satisfatórios para gravar.
- **ASO**: teste ícones e capturas diferentes com os **Experimentos da página da loja** do Play Console (é A/B test grátis).
- **Ajuste os anúncios com cuidado**: em `admob.config.json` você muda a frequência do intersticial sem mexer no código. Mais anúncios rendem mais por partida, mas espantam jogadores; mude uma coisa por vez e compare.
- **Só pague por instalações** (Google Ads, TikTok Ads) quando souber que cada jogador rende mais em anúncios do que custa para trazer.

## Problemas comuns

| Problema | Solução |
|---|---|
| App fecha ao abrir | Faltou o App ID no manifesto. Rode `npm run android:sync` |
| Anúncio não aparece com IDs reais | Normal nas primeiras horas, e enquanto o app não está vinculado à loja |
| Mudei o jogo e nada mudou no celular | Rode `npm run android:sync` antes do ▶ |
| Erro "targetSdkVersion" na Play Store | Passo 4: mude para 36 em `android/variables.gradle` |
