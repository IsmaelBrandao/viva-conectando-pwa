// src/screens/HomeScreen.jsx

import React from 'react';
import { COLORS, SIZES } from '../styles/colors';

export default function HomeScreen({ onNavigate }) {
  const botoes = [
    {
      id: 'pintura',
      icone: '🎨',
      titulo: 'PINTURA',
      cor: COLORS.primary,
    },
    {
      id: 'memoria',
      icone: '🧠',
      titulo: 'MEMÓRIA',
      cor: COLORS.secondary,
    },
    {
      id: 'caca-palavras',
      icone: '🔍',
      titulo: 'CAÇA-PALAVRAS',
      cor: COLORS.success,
    },
    {
      id: 'bingo-menu', // ID que leva para o menu do bingo
      icone: '🎱',
      titulo: 'BINGO ONLINE',
      cor: '#6A1B9A', // Roxo
    },
  ];

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1 style={styles.titulo}>🎨 Viva Conectado</h1>
        <p style={styles.subtitulo}>Escolha uma atividade:</p>
      </header>

      {/* Botões */}
      <main style={styles.main}>
        {botoes.map((botao) => (
          <button
            key={botao.id}
            style={{
              ...styles.botao,
              backgroundColor: botao.cor,
            }}
            onClick={() => onNavigate(botao.id)}
          >
            <span style={styles.icone}>{botao.icone}</span>
            <span style={styles.textoBotao}>{botao.titulo}</span>
          </button>
        ))}
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
    backgroundColor: COLORS.primary,
    padding: SIZES.spacing.large,
    borderBottom: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    textAlign: 'center',
  },

  titulo: {
    fontSize: SIZES.fontSize.xlarge,
    fontWeight: 'bold',
    color: COLORS.textLight,
    margin: 0,
    marginBottom: SIZES.spacing.small,
  },

  subtitulo: {
    fontSize: SIZES.fontSize.large,
    color: COLORS.textLight,
    margin: 0,
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.spacing.large,
    padding: SIZES.spacing.large,
  },

  botao: {
    minWidth: 280,
    minHeight: SIZES.buttonMin,
    padding: SIZES.spacing.medium,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.small,
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.2s',
    width: '100%',
    maxWidth: 400,
  },

  icone: {
    fontSize: 48,
  },

  textoBotao: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
};