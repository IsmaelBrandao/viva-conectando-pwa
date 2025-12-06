// src/screens/BingoMenuScreen.jsx
import React, { useState } from 'react';
import { COLORS, SIZES } from '../styles/colors';
import BotaoAjuda from '../components/BotaoAjuda'; // <--- IMPORTADO

export default function BingoMenuScreen({ onEntrarSala, onVoltar }) {
  const [codigoSala, setCodigoSala] = useState('');

  // Função para compartilhar no WhatsApp
  const compartilharZap = () => {
    if (!codigoSala) return alert("Digite um código primeiro!");
    
    const texto = `Olá! Vamos jogar Bingo no Viva Conectado? Entre no site e use o código da sala: *${codigoSala}*`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🎱 Bingo Online</h1>
        <p style={styles.subtitulo}>Jogue com seus amigos!</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <label style={styles.label}>Código da Sala:</label>
          <p style={styles.instrucao}>Combinem um número (ex: 100)</p>
          <input
            type="number"
            style={styles.input}
            value={codigoSala}
            onChange={(e) => setCodigoSala(e.target.value)}
            placeholder="Ex: 1234"
          />

          {/* Botão do WhatsApp (Só aparece se tiver código) */}
          {codigoSala && (
            <button style={styles.btnZap} onClick={compartilharZap}>
              📱 Convidar no WhatsApp
            </button>
          )}
        </div>

        <div style={styles.botoesContainer}>
          <button
            style={{ ...styles.botao, backgroundColor: COLORS.primary }}
            onClick={() => onEntrarSala(codigoSala, 'sorteador')}
            disabled={!codigoSala}
          >
            🎤 SOU O SORTEADOR
          </button>

          <button
            style={{ ...styles.botao, backgroundColor: COLORS.success }}
            onClick={() => onEntrarSala(codigoSala, 'jogador')}
            disabled={!codigoSala}
          >
            📝 QUERO JOGAR
          </button>
        </div>

        <button style={styles.btnVoltar} onClick={onVoltar}>
          ⬅️ Voltar ao Início
        </button>
      </main>

      {/* --- BOTÃO DE AJUDA NO MENU --- */}
      <BotaoAjuda texto="Primeiro, digite um número para a sala (exemplo: 100). Todos devem usar o mesmo número. Se você vai 'cantar' as pedras, escolha SOU O SORTEADOR. Se você vai marcar a cartela, escolha QUERO JOGAR." />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.backgroundSecondary,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#6A1B9A', // Roxo escuro
    padding: SIZES.spacing.large,
    textAlign: 'center',
    borderBottom: `3px solid ${COLORS.border}`,
  },
  titulo: { color: '#FFF', fontSize: SIZES.fontSize.xlarge, margin: 0 },
  subtitulo: { color: '#FFF', fontSize: SIZES.fontSize.medium },
  main: {
    flex: 1,
    padding: SIZES.spacing.large,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 30,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: SIZES.borderRadius,
    border: `2px solid ${COLORS.border}`,
    width: '100%',
    maxWidth: 350,
    textAlign: 'center',
  },
  label: { fontSize: SIZES.fontSize.medium, fontWeight: 'bold', display: 'block' },
  instrucao: { fontSize: 16, color: '#666', marginBottom: 10 },
  input: {
    width: '100%',
    padding: 15,
    fontSize: 32,
    borderRadius: SIZES.borderRadius,
    border: `2px solid ${COLORS.border}`,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  btnZap: {
    marginTop: 15,
    backgroundColor: '#25D366',
    color: '#FFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  botoesContainer: { display: 'flex', flexDirection: 'column', gap: 15, width: '100%', maxWidth: 350 },
  botao: {
    padding: 20,
    borderRadius: SIZES.borderRadius,
    border: `3px solid ${COLORS.border}`,
    color: '#FFF',
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  },
  btnVoltar: {
    marginTop: 20,
    background: 'none',
    border: 'none',
    fontSize: SIZES.fontSize.medium,
    color: COLORS.text,
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};