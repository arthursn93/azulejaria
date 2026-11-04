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
      tutoProx: "Próximo", tutoJogar: "Jogar", tutoPular: "Pular", avaliar: "Avaliar", compartilhar: "Compartilhar", convite: "Fiz {p} pontos no Azulejaria: Block Puzzle! Será que você consegue mais?", jogar: "Jogar", continuar: "Continuar partida", recordes: "Recordes", subtitulo: "Block Puzzle!", menu: "Menu", fechar: "Fechar", seusRecordes: "Seus recordes", semRecordes: "Jogue uma partida para entrar no ranking!", novaCor: "Nova cor!", continuarGratis: "Continuar", desafio: "Desafio diário", tentarDeNovo: "Tentar de novo", meta: "Meta", desafioOk: "Desafio concluído!", diasSeguidos: "{n} dias seguidos", desafioFeito: "Concluído hoje ✓", furia: "Fúria! Pontos ×2", estatisticas: "Estatísticas", ajustes: "Ajustes", stJogos: "Partidas jogadas", stMedia: "Média de pontos", stMelhor: "Melhor pontuação", stCombo: "Maior combo", stLinhas: "Linhas limpas", stLimpos: "Painéis limpos", stSeq: "Maior sequência de desafios", vibracao: "Vibração", lembrete: "Lembrete diário", idioma: "Idioma", automatico: "Automático", tema: "Tema dos azulejos", temaNovo: "Novo tema liberado!", bloqueado: "Recorde {n}", trocar: "▶ Trocar", trocarAria: "Ver vídeo e trocar as peças", lembreteTxt: "Seu desafio diário está esperando por você!", querLembrete: "Quer um lembrete diário do desafio?", sim: "Sim", agoraNao: "Agora não", baixe: "Jogue grátis no Google Play", temaLisboa: "Lisboa", temaNoite: "Noite de Fado", temaSevilha: "Sevilha", temaPorto: "Porto", atualDisp: "⬇ Nova versão disponível", atualBaixando: "Baixando atualização…", atualPronta: "↻ Reiniciar e atualizar",
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
      tutoProx: "Next", tutoJogar: "Play", tutoPular: "Skip", avaliar: "Rate", compartilhar: "Share", convite: "I scored {p} points in Azulejaria: Block Puzzle! Can you beat me?", jogar: "Play", continuar: "Continue game", recordes: "High scores", subtitulo: "Block Puzzle!", menu: "Menu", fechar: "Close", seusRecordes: "Your best games", semRecordes: "Play a game to enter the ranking!", novaCor: "New color!", continuarGratis: "Continue", desafio: "Daily challenge", tentarDeNovo: "Try again", meta: "Goal", desafioOk: "Challenge complete!", diasSeguidos: "{n}-day streak", desafioFeito: "Done today ✓", furia: "Fury! Points ×2", estatisticas: "Statistics", ajustes: "Settings", stJogos: "Games played", stMedia: "Average score", stMelhor: "Best score", stCombo: "Best combo", stLinhas: "Lines cleared", stLimpos: "Boards cleared", stSeq: "Longest challenge streak", vibracao: "Vibration", lembrete: "Daily reminder", idioma: "Language", automatico: "Automatic", tema: "Tile theme", temaNovo: "New theme unlocked!", bloqueado: "Best {n}", trocar: "▶ Shuffle", trocarAria: "Watch a video to shuffle the pieces", lembreteTxt: "Your daily challenge is waiting for you!", querLembrete: "Want a daily reminder for the challenge?", sim: "Yes", agoraNao: "Not now", baixe: "Play free on Google Play", temaLisboa: "Lisbon", temaNoite: "Fado Night", temaSevilha: "Seville", temaPorto: "Porto", atualDisp: "⬇ New version available", atualBaixando: "Downloading update…", atualPronta: "↻ Restart to update",
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
      tutoProx: "Siguiente", tutoJogar: "Jugar", tutoPular: "Saltar", avaliar: "Valorar", compartilhar: "Compartir", convite: "¡Hice {p} puntos en Azulejaria: Block Puzzle! ¿Puedes superarme?", jogar: "Jugar", continuar: "Continuar partida", recordes: "Récords", subtitulo: "Block Puzzle!", menu: "Menú", fechar: "Cerrar", seusRecordes: "Tus mejores partidas", semRecordes: "¡Juega una partida para entrar en el ranking!", novaCor: "¡Nuevo color!", continuarGratis: "Continuar", desafio: "Desafío diario", tentarDeNovo: "Intentar de nuevo", meta: "Meta", desafioOk: "¡Desafío completado!", diasSeguidos: "{n} días seguidos", desafioFeito: "Completado hoy ✓", furia: "¡Furia! Puntos ×2", estatisticas: "Estadísticas", ajustes: "Ajustes", stJogos: "Partidas jugadas", stMedia: "Media de puntos", stMelhor: "Mejor puntuación", stCombo: "Mayor combo", stLinhas: "Líneas limpiadas", stLimpos: "Tableros limpios", stSeq: "Mayor racha de desafíos", vibracao: "Vibración", lembrete: "Recordatorio diario", idioma: "Idioma", automatico: "Automático", tema: "Tema de azulejos", temaNovo: "¡Nuevo tema desbloqueado!", bloqueado: "Récord {n}", trocar: "▶ Cambiar", trocarAria: "Ver vídeo y cambiar las piezas", lembreteTxt: "¡Tu desafío diario te está esperando!", querLembrete: "¿Quieres un recordatorio diario del desafío?", sim: "Sí", agoraNao: "Ahora no", baixe: "Juega gratis en Google Play", temaLisboa: "Lisboa", temaNoite: "Noche de Fado", temaSevilha: "Sevilla", temaPorto: "Oporto", atualDisp: "⬇ Nueva versión disponible", atualBaixando: "Descargando actualización…", atualPronta: "↻ Reiniciar y actualizar",
    },
  };
  let lang = "en";
  try {
    const l = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    let forcado = new URLSearchParams(location.search).get("lang");
    if (!forcado) { try { forcado = localStorage.getItem("azulejaria-idioma"); } catch (e) {} }
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
