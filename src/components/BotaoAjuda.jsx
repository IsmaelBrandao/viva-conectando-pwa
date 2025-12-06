// src/components/BotaoAjuda.jsx
import React from 'react';
import { COLORS } from '../styles/colors';

export default function BotaoAjuda({ texto }) {
  const falarAjuda = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Para qualquer fala anterior
      
      const msg = new SpeechSynthesisUtterance(texto);
      msg.lang = 'pt-BR';
      msg.rate = 0.9; // Velocidade confortável para idosos
      
      window.speechSynthesis.speak(msg);
    } else {
      alert(texto); // Caso o celular não tenha voz
    }
  };

  return (
    <button
      onClick={falarAjuda}
      style={styles.botao}
      aria-label="Ouvir instruções de ajuda"
    >
      ❓
    </button>
  );
}

const styles = {
  botao: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: COLORS.warning, // Amarelo chama atenção
    border: `3px solid ${COLORS.border}`,
    fontSize: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    zIndex: 9999, // Garante que fique acima de tudo
    cursor: 'pointer',
    animation: 'pulse 2s infinite' // Efeito visual para chamar atenção
  }
};