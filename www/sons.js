// Sons do Azulejaria, sintetizados na hora com Web Audio (sem arquivos de áudio:
// funciona offline, não pesa no app e todos os sons são originais).
// Identidade sonora: o azulejo (cerâmica) e a guitarra portuguesa (cordas de aço
// em pares, dedilhadas). Encaixe = "clinc" de azulejo; limpar linha = notas
// dedilhadas que sobem a cada combo; painel limpo = acorde rasgado; fim de jogo =
// frase descendente com sabor de fado. Preferência salva em localStorage.
(function () {
  const CHAVE = "azulejaria-som";
  let ligado = true;
  try { ligado = localStorage.getItem(CHAVE) !== "0"; } catch (e) {}

  let ctx = null, mestre = null, cordas = null, ruido = null;
  const cacheCorda = {};
  function iniciar() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume().catch(() => {}); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      mestre = ctx.createGain(); mestre.gain.value = 0.6;
      const comp = ctx.createDynamicsCompressor();
      mestre.connect(comp); comp.connect(ctx.destination);
      // "Corpo" da guitarra: corta graves e realça o brilho metálico das cordas.
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 180;
      const brilho = ctx.createBiquadFilter(); brilho.type = "peaking"; brilho.frequency.value = 2800; brilho.Q.value = 0.9; brilho.gain.value = 5;
      cordas = ctx.createGain(); cordas.gain.value = 0.9;
      cordas.connect(hp); hp.connect(brilho); brilho.connect(mestre);
      ruido = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
      const d = ruido.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ctx = null; }
    return ctx;
  }
  // O navegador só libera áudio depois de um toque do jogador.
  ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, iniciar, { capture: true, passive: true }));
  // Silencia quando o app vai para segundo plano.
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {});
  });

  function pronto() { return ligado && iniciar() && ctx.state !== "closed"; }

  // Corda dedilhada (algoritmo Karplus-Strong), guardada em cache por nota.
  function bufferCorda(freq) {
    const chave = Math.round(freq * 10);
    if (cacheCorda[chave]) return cacheCorda[chave];
    const sr = ctx.sampleRate, n = Math.floor(sr * 1.4), P = Math.max(2, Math.round(sr / freq));
    const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0), anel = new Float32Array(P);
    for (let i = 0; i < P; i++) anel[i] = (Math.random() * 2 - 1) * 0.8 + (i < P / 2 ? 0.2 : -0.2);
    let k = 0;
    for (let i = 0; i < n; i++) {
      const a = anel[k], b = anel[(k + 1) % P];
      d[i] = a;
      anel[k] = (a * 0.62 + b * 0.38) * 0.9965; // pouco amortecimento = aço brilhante
      k = (k + 1) % P;
    }
    cacheCorda[chave] = buf;
    return buf;
  }
  // Duas cordas por nota, levemente desafinadas entre si, como na guitarra portuguesa.
  function dedilhar(freq, quando, vol) {
    const buf = bufferCorda(freq);
    [1, 1.0045].forEach((taxa, i) => {
      const s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = buf; s.playbackRate.value = taxa;
      g.gain.setValueAtTime(vol * (i ? 0.7 : 1), quando);
      g.gain.setTargetAtTime(0.0001, quando + 0.5, 0.25);
      s.connect(g); g.connect(cordas);
      s.start(quando); s.stop(quando + 1.4);
    });
  }
  // Um tom simples com ataque rápido e decaimento exponencial.
  function tom(freq, quando, dur, vol, tipo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(vol, quando + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
    o.connect(g); g.connect(mestre);
    o.start(quando); o.stop(quando + dur + 0.02);
  }
  // Rajada curta de ruído filtrado (o contato físico da peça).
  function batida(quando, freq, dur, vol) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = ruido; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.2;
    g.gain.setValueAtTime(vol, quando);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
    s.connect(f); f.connect(g); g.connect(mestre);
    s.start(quando); s.stop(quando + dur + 0.02);
  }
  // Cerâmica: parciais inarmônicas curtas, como bater num azulejo.
  function ceramica(base, quando, vol) {
    [1, 2.32, 4.25, 6.8].forEach((r, i) => tom(base * r, quando, 0.16 / (1 + i * 0.6), vol / (1 + i * 1.4)));
  }

  // Notas: escala pentatônica maior de Lá (alegre, sempre combina) e
  // Lá menor harmônico para o fim de jogo (o "suspiro" do fado).
  const LA = 440;
  const semitom = n => LA * Math.pow(2, n / 12);
  const PENTA = [0, 2, 4, 7, 9];
  function penta(grau) { const o = Math.floor(grau / 5); return semitom(PENTA[((grau % 5) + 5) % 5] + 12 * o); }

  const Sons = {
    get ligado() { return ligado; },
    alternar() {
      ligado = !ligado;
      try { localStorage.setItem(CHAVE, ligado ? "1" : "0"); } catch (e) {}
      if (ligado && pronto()) dedilhar(penta(2), ctx.currentTime, 0.35);
      return ligado;
    },
    pegar() {
      if (!pronto()) return; const t = ctx.currentTime;
      batida(t, 2400, 0.03, 0.18);
      tom(1250, t, 0.05, 0.05, "triangle");
    },
    encaixar(qtd) {
      if (!pronto()) return; const t = ctx.currentTime;
      batida(t, 1700, 0.05, 0.32);
      ceramica(700 + Math.random() * 50 - (qtd || 1) * 16, t, 0.2);
    },
    invalido() {
      if (!pronto()) return; const t = ctx.currentTime;
      tom(170, t, 0.12, 0.1, "triangle");
      batida(t, 380, 0.06, 0.14);
    },
    limpar(linhas, combo) {
      if (!pronto()) return; const t = ctx.currentTime + 0.03;
      const inicio = Math.min(Math.max(combo || 1, 1) - 1, 7);
      const n = 2 + Math.min(linhas, 4);
      for (let i = 0; i < n; i++) dedilhar(penta(inicio + i), t + i * 0.06, 0.42 - i * 0.03);
      batida(t, 6000, 0.22, 0.06); // brilho do vidrado
    },
    painelLimpo() {
      if (!pronto()) return; const t = ctx.currentTime + 0.35;
      // acorde de Lá maior rasgado + nota alta
      [-12, -5, 0, 4, 7, 12].forEach((s, i) => dedilhar(semitom(s), t + i * 0.025, 0.32));
      dedilhar(semitom(16), t + 0.35, 0.4);
      dedilhar(semitom(19), t + 0.5, 0.4);
    },
    fimDeJogo() {
      if (!pronto()) return; const t = ctx.currentTime;
      // Mi - Ré - Dó - Si ... Lá: descida em Lá menor harmônico
      [7, 5, 3, 2, 0].forEach((s, i) => dedilhar(semitom(s), t + i * 0.17, 0.38));
      dedilhar(semitom(-12), t + 0.85, 0.3);
    },
    recorde() {
      if (!pronto()) return; const t = ctx.currentTime;
      [0, 4, 7, 9, 12, 16].forEach((s, i) => dedilhar(semitom(s), t + i * 0.07, 0.38));
      tom(semitom(28), t + 0.45, 0.6, 0.04);
    },
  };
  window.Sons = Sons;
})();
