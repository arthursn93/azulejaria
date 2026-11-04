// Aviso de atualização da Play Store (In-App Updates do Google).
// Quando a loja tem uma versão nova, aparece um botão no menu. O download roda em
// segundo plano enquanto a pessoa joga; ao terminar, o botão vira "Reiniciar" e o
// app reinicia já atualizado. Os dados (localStorage) não são apagados.
// No navegador, sem internet ou sem Play Store, não faz nada e nunca trava o jogo.
(function () {
  const P = (window.Capacitor && Capacitor.Plugins) || {};
  const AU = P.AppUpdate;
  const nativo = !!(AU && window.Capacitor && Capacitor.getPlatform && Capacitor.getPlatform() === "android");
  const DISPONIVEL = 2, EM_ANDAMENTO = 3, BAIXANDO = 2, BAIXADA = 11, FALHOU = 5, CANCELADA = 6;
  const INTERVALO = 30 * 60 * 1000;

  let estado = "nada"; // nada | disponivel | loja | baixando | pronta
  let ultimaChecagem = 0, ouvindo = false, aoMudar = () => {};

  function ev(nome, p) { try { if (window.Metricas) Metricas.evento(nome, p || {}); } catch (e) {} }
  function mudar(novo) { if (novo === estado) return; estado = novo; try { aoMudar(estado); } catch (e) {} }

  function ouvir() {
    if (ouvindo) return; ouvindo = true;
    try {
      AU.addListener("onFlexibleUpdateStateChange", (s) => {
        const st = s && s.installStatus;
        if (st === BAIXADA) { mudar("pronta"); ev("atualizacao_baixada"); }
        else if (st === BAIXANDO) mudar("baixando");
        else if (st === FALHOU || st === CANCELADA) mudar("disponivel");
      });
    } catch (e) {}
  }

  async function verificar(forcar) {
    if (!nativo || !navigator.onLine) return;
    if (!forcar && Date.now() - ultimaChecagem < INTERVALO) return;
    ultimaChecagem = Date.now();
    try {
      const info = await AU.getAppUpdateInfo();
      if (info.installStatus === BAIXADA) { ouvir(); mudar("pronta"); return; }
      if (info.updateAvailability === EM_ANDAMENTO) { ouvir(); mudar("baixando"); return; }
      if (info.updateAvailability === DISPONIVEL) {
        if (estado === "nada") ev("atualizacao_disponivel", { versao: String(info.availableVersionCode || "") });
        mudar(info.flexibleUpdateAllowed ? "disponivel" : "loja");
        return;
      }
      if (estado !== "baixando" && estado !== "pronta") mudar("nada");
    } catch (e) { /* sem Play Store, app instalado fora da loja, etc. */ }
  }

  // Ação do botão do menu. Chamar só fora de uma jogada (no menu).
  async function agir() {
    if (!nativo) return;
    try {
      if (estado === "pronta") { ev("atualizacao_reiniciar"); await AU.completeFlexibleUpdate(); return; }
      if (estado === "loja") { ev("atualizacao_loja"); await AU.openAppStore(); return; }
      if (estado === "disponivel") {
        ouvir(); ev("atualizacao_iniciada");
        const r = await AU.startFlexibleUpdate();
        if (r && r.code === 0 && estado === "disponivel") mudar("baixando");
      }
    } catch (e) { verificar(true); }
  }

  function iniciar(callback) {
    if (typeof callback === "function") aoMudar = callback;
    if (!nativo) return;
    setTimeout(() => verificar(true), 3000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) verificar(false); });
    window.addEventListener("online", () => verificar(false));
  }

  window.Atualizacao = { iniciar, agir, verificar, get estado() { return estado; } };
})();
