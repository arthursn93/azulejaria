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

  // Mostra o vídeo premiado. Resolve true só se o jogador assistiu até ganhar a recompensa.
  function mostrarPremiado() {
    if (!AdMob) { console.log("[ads] (simulado) vídeo premiado"); return Promise.resolve(true); }
    if (!premiadoCarregado) return Promise.resolve(false);
    premiadoCarregado = false;
    return new Promise((resolve) => {
      let ganhou = false, fim = false;
      const handles = [];
      const terminar = () => {
        if (fim) return; fim = true;
        handles.forEach((h) => h.then((x) => x && x.remove && x.remove()));
        carregarPremiado();
        resolve(ganhou);
      };
      handles.push(AdMob.addListener("onRewardedVideoAdReward", () => { ganhou = true; }));
      handles.push(AdMob.addListener("onRewardedVideoAdDismissed", () => setTimeout(terminar, 150)));
      handles.push(AdMob.addListener("onRewardedVideoAdFailedToShow", terminar));
      AdMob.showRewardVideoAd().then((item) => { if (item) ganhou = true; }).catch(terminar);
    });
  }

  window.Anuncios = { iniciar, talvezIntersticial, premiadoDisponivel, mostrarPremiado };
  setBannerAltura(0);
  document.addEventListener("DOMContentLoaded", iniciar);
})();
