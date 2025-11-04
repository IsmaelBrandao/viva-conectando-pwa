// src/screens/MemoriaScreen.jsx - BONITO E CENTRALIZADO

import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../styles/colors';

export default function MemoriaScreen({ onVoltar }) {
  const [nivel, setNivel] = useState(null);
  const [cartas, setCartas] = useState([]);
  const [cartasViradas, setCartasViradas] = useState([]);
  const [cartasEncontradas, setCartasEncontradas] = useState([]);
  const [jogadas, setJogadas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const emojisDisponiveis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦆', '🦉', '🦋', '🐝', '🐞', '🦀', '🐠', '🐡',
    '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🍎', '🍊',
    '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝',
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓',
  ];

  const iniciarJogo = (nivelSelecionado) => {
    setNivel(nivelSelecionado);
    setJogadas(0);
    setCartasViradas([]);
    setCartasEncontradas([]);
    setBloqueado(false);

    const numPares = nivelSelecionado === 'facil' ? 4 : nivelSelecionado === 'medio' ? 6 : 8;

    const emojisEscolhidos = emojisDisponiveis
      .sort(() => Math.random() - 0.5)
      .slice(0, numPares);

    const cartasJogo = [...emojisEscolhidos, ...emojisEscolhidos]
      .map((emoji, index) => ({
        id: index,
        emoji: emoji,
        virada: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCartas(cartasJogo);
  };

  const virarCarta = (id) => {
    if (bloqueado) return;
    if (cartasViradas.includes(id)) return;
    if (cartasEncontradas.includes(id)) return;

    const novasCartasViradas = [...cartasViradas, id];
    setCartasViradas(novasCartasViradas);

    if (novasCartasViradas.length === 2) {
      setBloqueado(true);
      setJogadas(jogadas + 1);

      const [id1, id2] = novasCartasViradas;
      const carta1 = cartas.find((c) => c.id === id1);
      const carta2 = cartas.find((c) => c.id === id2);

      if (carta1.emoji === carta2.emoji) {
        setCartasEncontradas([...cartasEncontradas, id1, id2]);
        setCartasViradas([]);
        setBloqueado(false);
      } else {
        setTimeout(() => {
          setCartasViradas([]);
          setBloqueado(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cartas.length > 0 && cartasEncontradas.length === cartas.length) {
      setTimeout(() => {
        alert(`🎉 Parabéns! Você venceu em ${jogadas} jogadas!`);
      }, 500);
    }
  }, [cartasEncontradas, cartas, jogadas]);

  const reiniciarJogo = () => {
    if (nivel) {
      iniciarJogo(nivel);
    }
  };

  const voltarSelecao = () => {
    setNivel(null);
    setCartas([]);
    setCartasViradas([]);
    setCartasEncontradas([]);
    setJogadas(0);
  };

  // MENU DE SELEÇÃO DE NÍVEL
  if (!nivel) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🧠 Jogo da Memória</h1>
          <p style={styles.subtitulo}>Escolha o nível:</p>
        </header>

        <main style={styles.main}>
          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.success }}
            onClick={() => iniciarJogo('facil')}
          >
            <span style={styles.iconeNivel}>😊</span>
            <span style={styles.textoNivel}>FÁCIL</span>
            <span style={styles.descricaoNivel}>8 cartas (4 pares)</span>
          </button>

          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.warning }}
            onClick={() => iniciarJogo('medio')}
          >
            <span style={styles.iconeNivel}>😐</span>
            <span style={styles.textoNivel}>MÉDIO</span>
            <span style={styles.descricaoNivel}>12 cartas (6 pares)</span>
          </button>

          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.danger }}
            onClick={() => iniciarJogo('dificil')}
          >
            <span style={styles.iconeNivel}>😤</span>
            <span style={styles.textoNivel}>DIFÍCIL</span>
            <span style={styles.descricaoNivel}>16 cartas (8 pares)</span>
          </button>

          <button
            style={{
              ...styles.botaoNivel,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={onVoltar}
          >
            <span style={styles.iconeNivel}>⬅️</span>
            <span style={styles.textoNivel}>VOLTAR AO INÍCIO</span>
          </button>
        </main>
      </div>
    );
  }

  // JOGO ATIVO
  const colunas = nivel === 'facil' ? 2 : nivel === 'medio' ? 3 : 4;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🧠 Jogo da Memória</h1>
        <p style={styles.subtitulo}>
          Jogadas: {jogadas} | Pares: {cartasEncontradas.length / 2}/{cartas.length / 2}
        </p>
      </header>

      {/* ✅ ÁREA PRINCIPAL COM CENTRALIZAÇÃO VERTICAL E HORIZONTAL */}
      <main style={styles.mainJogo}>
        <div style={styles.containerCentralizado}>
          {/* GRID DE CARTAS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${colunas}, 1fr)`,
              gap: '12px',
              width: '100%',
              maxWidth: nivel === 'facil' ? '260px' : nivel === 'medio' ? '380px' : '480px',
              margin: '0 auto',
            }}
          >
            {cartas.map((carta) => {
              const estaVirada =
                cartasViradas.includes(carta.id) ||
                cartasEncontradas.includes(carta.id);

              return (
                <button
                  key={carta.id}
                  style={{
                    aspectRatio: '1',
                    minHeight: '80px',
                    maxHeight: '110px',
                    borderRadius: SIZES.borderRadius,
                    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
                    backgroundColor: estaVirada ? COLORS.success : COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    cursor: estaVirada || bloqueado ? 'default' : 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s',
                    opacity: estaVirada ? 0.95 : 1,
                  }}
                  onClick={() => virarCarta(carta.id)}
                  disabled={estaVirada || bloqueado}
                >
                  {estaVirada ? carta.emoji : '❓'}
                </button>
              );
            })}
          </div>

          {/* BOTÕES DE CONTROLE */}
          <div style={styles.botoesControle}>
            <button style={styles.botaoControle} onClick={reiniciarJogo}>
              🔄 REINICIAR
            </button>

            <button
              style={{
                ...styles.botaoControle,
                backgroundColor: COLORS.warning,
              }}
              onClick={voltarSelecao}
            >
              📋 MUDAR NÍVEL
            </button>

            <button
              style={{
                ...styles.botaoControle,
                backgroundColor: COLORS.textSecondary,
              }}
              onClick={onVoltar}
            >
              ⬅️ VOLTAR
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    backgroundColor: COLORS.secondary,
    padding: SIZES.spacing.large,
    borderBottom: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    textAlign: 'center',
    flexShrink: 0,
  },

  titulo: {
    fontSize: SIZES.fontSize.xlarge,
    fontWeight: 'bold',
    color: COLORS.textLight,
    margin: 0,
    marginBottom: SIZES.spacing.xs,
  },

  subtitulo: {
    fontSize: SIZES.fontSize.medium,
    color: COLORS.textLight,
    margin: 0,
    fontWeight: '600',
  },

  main: {
    flex: 1,
    padding: SIZES.spacing.large,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.spacing.large,
    overflowY: 'auto',
  },

  // ✅ NOVO: Área do jogo com centralização perfeita
  mainJogo: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.medium,
    overflowY: 'auto',
  },

  // ✅ NOVO: Container que centraliza tudo verticalmente e horizontalmente
  containerCentralizado: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.large,
    width: '100%',
    maxWidth: '600px',
    padding: SIZES.spacing.medium,
  },

  botaoNivel: {
    width: '100%',
    maxWidth: 400,
    minHeight: 100,
    padding: SIZES.spacing.medium,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.xs,
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  iconeNivel: {
    fontSize: 40,
  },

  textoNivel: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },

  descricaoNivel: {
    fontSize: SIZES.fontSize.small,
    color: COLORS.textLight,
  },

  botoesControle: {
    display: 'flex',
    gap: SIZES.spacing.small,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginTop: SIZES.spacing.medium,
  },

  botaoControle: {
    flex: 1,
    minWidth: '115px',
    minHeight: '60px',
    padding: SIZES.spacing.small,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    backgroundColor: COLORS.primary,
    fontSize: SIZES.fontSize.small,
    fontWeight: 'bold',
    color: COLORS.textLight,
    cursor: 'pointer',
    textTransform: 'uppercase',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.2s',
  },
};