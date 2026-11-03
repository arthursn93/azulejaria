// Métricas do Azulejaria (Firebase Analytics + Crashlytics).
// Só funciona no app Android com o arquivo google-services.json; no navegador ou sem
// Firebase, tudo vira "não faz nada". Nunca trava o jogo: erros são ignorados.
(function () {
  const P = (window.Capacitor && Capacitor.Plugins) || {};
  const A = P.FirebaseAnalytics, C = P.FirebaseCrashlytics;

  function evento(nome, params) {
    try { if (A) A.logEvent({ name: nome, params: params || {} }).catch(() => {}); } catch (e) {}
  }
  function erro(msg) {
    try { if (C) C.recordException({ message: String(msg).slice(0, 500) }).catch(() => {}); } catch (e) {}
  }
  window.addEventListener("error", (e) => erro((e && e.message) || "erro"));
  window.addEventListener("unhandledrejection", (e) => erro((e && e.reason && e.reason.message) || "promessa rejeitada"));

  window.Metricas = { evento, erro };
})();
