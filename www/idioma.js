// Textos do jogo em português, inglês e espanhol. O idioma vem do celular
// (navigator.language): pt → português, es → espanhol, qualquer outro → inglês.
(function () {
  const TEXTOS = {
    pt: {
      recorde: "Recorde", pontos: "Pontos", som: "Som", ligarSom: "Ligar som", desligarSom: "Desligar som",
      painel8: "Painel de 8 por 8", painelCheio: "Painel cheio", obraValeu: "Sua obra valeu",
      verVideo: "Ver vídeo e continuar", videoIndisp: "Vídeo indisponível agora", carregando: "Carregando vídeo…",
      novaPartida: "Nova partida", recomecar: "Recomeçar", voltar: "Voltar", perderPainel: "Recomeçar e perder este painel?",
      dica: "Arraste os azulejos para o painel", combo: "Combo", novoRecorde: "Novo recorde!", painelLimpo: "Painel limpo!",
      elogio2: "Primoroso!", elogio3: "Magnífico!", elogio4: "Obra-prima!",
      tutoT1: "Arraste os azulejos", tutoP1: "Toque numa peça da bandeja e arraste até o painel.",
      tutoT2: "Complete linhas", tutoP2: "Linhas e colunas cheias somem e dão pontos. Limpe várias seguidas para fazer combo!",
      tutoT3: "Não encha o painel", tutoP3: "A partida acaba quando nenhuma peça couber. Planeje o espaço!",
      tutoProx: "Próximo", tutoJogar: "Jogar", tutoPular: "Pular", avaliar: "Avaliar", compartilhar: "Compartilhar", convite: "Fiz {p} pontos no Azulejaria! Será que você consegue mais?",
    },
    en: {
      recorde: "Best", pontos: "Score", som: "Sound", ligarSom: "Sound on", desligarSom: "Sound off",
      painel8: "8 by 8 board", painelCheio: "Board full", obraValeu: "Fine work",
      verVideo: "Watch video to continue", videoIndisp: "Video unavailable now", carregando: "Loading video…",
      novaPartida: "New game", recomecar: "Restart", voltar: "Back", perderPainel: "Restart and lose this board?",
      dica: "Drag the tiles onto the board", combo: "Combo", novoRecorde: "New record!", painelLimpo: "Board clear!",
      elogio2: "Exquisite!", elogio3: "Magnificent!", elogio4: "Masterpiece!",
      tutoT1: "Drag the tiles", tutoP1: "Touch a piece in the tray and drag it onto the board.",
      tutoT2: "Fill lines", tutoP2: "Full rows and columns clear and score points. Clear several in a row for a combo!",
      tutoT3: "Don't fill the board", tutoP3: "The game ends when no piece fits. Plan your space!",
      tutoProx: "Next", tutoJogar: "Play", tutoPular: "Skip", avaliar: "Rate", compartilhar: "Share", convite: "I scored {p} points in Azulejaria! Can you beat me?",
    },
    es: {
      recorde: "Récord", pontos: "Puntos", som: "Sonido", ligarSom: "Activar sonido", desligarSom: "Silenciar",
      painel8: "Tablero de 8 por 8", painelCheio: "Tablero lleno", obraValeu: "Buena obra",
      verVideo: "Ver vídeo y continuar", videoIndisp: "Vídeo no disponible ahora", carregando: "Cargando vídeo…",
      novaPartida: "Nueva partida", recomecar: "Reiniciar", voltar: "Volver", perderPainel: "¿Reiniciar y perder este tablero?",
      dica: "Arrastra los azulejos al tablero", combo: "Combo", novoRecorde: "¡Nuevo récord!", painelLimpo: "¡Tablero limpio!",
      elogio2: "¡Primoroso!", elogio3: "¡Magnífico!", elogio4: "¡Obra maestra!",
      tutoT1: "Arrastra los azulejos", tutoP1: "Toca una pieza de la bandeja y arrástrala al panel.",
      tutoT2: "Completa líneas", tutoP2: "Las filas y columnas llenas desaparecen y dan puntos. ¡Limpia varias seguidas para hacer combo!",
      tutoT3: "No llenes el panel", tutoP3: "La partida termina cuando ninguna pieza cabe. ¡Planifica el espacio!",
      tutoProx: "Siguiente", tutoJogar: "Jugar", tutoPular: "Saltar", avaliar: "Valorar", compartilhar: "Compartir", convite: "¡Hice {p} puntos en Azulejaria! ¿Puedes superarme?",
    },
  };
  let lang = "en";
  try {
    const l = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    const forcado = new URLSearchParams(location.search).get("lang");
    const cod = (forcado || l).slice(0, 2).toLowerCase();
    if (TEXTOS[cod]) lang = cod;
  } catch (e) {}
  const T = k => TEXTOS[lang][k] || TEXTOS.pt[k] || k;
  window.T = T;
  window.IDIOMA = lang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  // Aplica nos elementos fixos: data-t = texto, data-t-aria = aria-label, data-t-title = title.
  function aplicar() {
    document.querySelectorAll("[data-t]").forEach(e => e.textContent = T(e.dataset.t));
    document.querySelectorAll("[data-t-aria]").forEach(e => e.setAttribute("aria-label", T(e.dataset.tAria)));
    document.querySelectorAll("[data-t-title]").forEach(e => e.title = T(e.dataset.tTitle));
  }
  window.aplicarIdioma = aplicar;
})();
