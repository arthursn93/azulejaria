// Camada de anúncios do Azulejaria.
// No celular usa o plugin @capacitor-community/admob. No navegador (teste no PC)
// os anúncios são simulados, para você poder testar o fluxo sem o Android.
(function () {
  const cfg = window.ADS_CONFIG || { modoTeste: true, intersticialACadaPartidas: 3, intervaloMinimoIntersticialSegundos: 90 };
  const Cap = window.Capacitor;
  const nativo = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const AdMob = nativo && Cap.Plugins ? Cap.Plugins.AdMob : null;

  let pronto = false;
  let intersticialCarregado = false;
  let premiadoCarregado = false;
  let partidasDesdeIntersticial = 0;
  let ultimoIntersticial = Date.now(); // não mostra intersticial logo ao abrir o app

  function setBannerAltura(px) {
    document.documentElement.style.setProperty("--banner-h", (px || 0) + "px");
  }

  async function iniciar() {
    if (!AdMob) { console.log("[ads] navegador: anúncios simulados"); return; }
    try {
      await AdMob.initialize({ initializeForTesting: !!cfg.modoTeste });

      // Consentimento (obrigatório para jogadores da Europa/Reino Unido; o Google decide quando mostrar)
      try {
        const info = await AdMob.requestConsentInfo();
        if (info && info.isConsentFormAvailable && info.status === "REQUIRED") {
          await AdMob.showConsentForm();
        }
      } catch (e) { console.warn("[ads] consentimento:", e); }

      AdMob.addListener("bannerAdSizeChanged", (s) => setBannerAltura(s && s.height));
      AdMob.addListener("bannerAdFailedToLoad", () => setBannerAltura(0));

      pronto = true;
      mostrarBanner();
      carregarIntersticial();
      carregarPremiado();
    } catch (e) {
      console.warn("[ads] falha ao iniciar (sem internet?)", e);
    }
  }

  async function mostrarBanner() {
    if (!pronto) return;
    try {
      await AdMob.showBanner({
        adId: cfg.banner, adSize: "ADAPTIVE_BANNER", position: "BOTTOM_CENTER",
        margin: 0, isTesting: !!cfg.modoTeste,
      });
    } catch (e) { setBannerAltura(0); }
  }

  async function carregarIntersticial() {
    if (!pronto) return;
    try { await AdMob.prepareInterstitial({ adId: cfg.intersticial, isTesting: !!cfg.modoTeste }); intersticialCarregado = true; }
    catch (e) { intersticialCarregado = false; setTimeout(carregarIntersticial, 30000); }
  }

  async function carregarPremiado() {
    if (!pronto) return;
    try { await AdMob.prepareRewardVideoAd({ adId: cfg.premiado, isTesting: !!cfg.modoTeste }); premiadoCarregado = true; }
    catch (e) { premiadoCarregado = false; setTimeout(carregarPremiado, 30000); }
  }

  // Chamado ao começar uma nova partida depois de um fim de jogo.
  async function talvezIntersticial() {
    partidasDesdeIntersticial++;
    const tempoOk = (Date.now() - ultimoIntersticial) / 1000 >= cfg.intervaloMinimoIntersticialSegundos;
    if (partidasDesdeIntersticial < cfg.intersticialACadaPartidas || !tempoOk) return;
    if (!AdMob) { console.log("[ads] (simulado) intersticial"); partidasDesdeIntersticial = 0; ultimoIntersticial = Date.now(); return; }
    if (!intersticialCarregado) return;
    try {
      intersticialCarregado = false;
      await AdMob.showInterstitial();
      partidasDesdeIntersticial = 0;
      ultimoIntersticial = Date.now();
    } catch (e) { /* segue o jogo */ }
    carregarIntersticial();
  }

  // Há um vídeo premiado disponível agora?
  function premiadoDisponivel() { return AdMob ? premiadoCarregado : true; }

  // Mostra o vídeo premiado. Resolve true assim que o jogador ganha a recompensa.
  // Não depende só do evento de "fechou o vídeo": alguns celulares não entregam esse
  // evento ao jogo, e a partida ficava presa em "Carregando vídeo...". Por isso também
  // resolve quando o app volta para a frente, e há um limite de tempo de segurança.
  function mostrarPremiado() {
    if (!AdMob) { console.log("[ads] (simulado) vídeo premiado"); return Promise.resolve(true); }
    if (!premiadoCarregado) return Promise.resolve(false);
    premiadoCarregado = false;
    return new Promise((resolve) => {
      let ganhou = false, fim = false, mostrou = false, timer = 0, inicio = 0;
      const handles = [];
      const aoVoltar = () => {
        if (document.hidden) { if (!mostrou) inicio = Date.now(); mostrou = true; return; }
        if (mostrou) setTimeout(() => terminar("voltou"), 1500);
      };
      const terminar = (motivo) => {
        if (fim) return; fim = true;
        clearTimeout(timer);
        // Se o aviso de recompensa se perdeu mas o vídeo ficou na tela por 15 s ou mais,
        // o jogador quase certamente assistiu: a favor do jogador.
        if (!ganhou && mostrou && inicio && Date.now() - inicio >= 15000) { ganhou = true; motivo = (motivo || "") + "+tempo"; }
        document.removeEventListener("visibilitychange", aoVoltar);
        window.removeEventListener("focus", aoVoltar);
        handles.forEach((h) => Promise.resolve(h).then((x) => x && x.remove && x.remove()).catch(() => {}));
        if (window.Metricas) Metricas.evento("premiado_fim", { ganhou: ganhou ? 1 : 0, motivo: motivo || "" });
        carregarPremiado();
        resolve(ganhou);
      };
      const recompensa = (motivo) => { ganhou = true; terminar(motivo); };
      const on = (ev, fn) => { try { handles.push(AdMob.addListener(ev, fn)); } catch (e) {} };
      on("onRewardedVideoAdReward", () => recompensa("evento"));
      on("onRewardedVideoAdShowed", () => { if (!mostrou) inicio = Date.now(); mostrou = true; });
      on("onRewardedVideoAdDismissed", () => setTimeout(() => terminar("fechou"), 300));
      on("onRewardedVideoAdFailedToShow", () => terminar("falhou"));
      document.addEventListener("visibilitychange", aoVoltar);
      window.addEventListener("focus", aoVoltar);
      timer = setTimeout(() => terminar("tempo"), 120000);
      AdMob.showRewardVideoAd()
        .then((item) => { mostrou = true; if (item) recompensa("retorno"); })
        .catch(() => terminar("erro"));
    });
  }

  window.Anuncios = { iniciar, talvezIntersticial, premiadoDisponivel, mostrarPremiado };
  setBannerAltura(0);
  document.addEventListener("DOMContentLoaded", iniciar);
})();
