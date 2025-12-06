// src/screens/BingoSorteadorScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from '../services/firebaseConfig';
import { COLORS, SIZES } from '../styles/colors';
import { obterLetra } from '../utils/bingoLogic'; // Importar a nova função

export default function BingoSorteadorScreen({ salaId, onVoltar }) {
  const [ultimoNumero, setUltimoNumero] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [msgVitoria, setMsgVitoria] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);

  // --- FALA COM LETRA ---
  const falar = (num) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Calcula a letra
    const letra = obterLetra(num);
    
    // Texto otimizado para soar natural (ex: "B.... 5")
    const textoFalado = `${letra}...... ${num}`;

    const msg = new SpeechSynthesisUtterance(textoFalado);
    msg.lang = 'pt-BR';
    msg.rate = 0.8; 
    msg.pitch = 1.0; 

    window.speechSynthesis.speak(msg);
  };

  const falarAviso = (texto) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(texto);
      msg.lang = 'pt-BR';
      window.speechSynthesis.speak(msg);
    }
  };

  const sortearNumero = () => {
    if (historico.length >= 75 || bloqueado) return;

    let novoNum;
    do {
      novoNum = Math.floor(Math.random() * 75) + 1;
    } while (historico.includes(novoNum));

    const novoHistorico = [novoNum, ...historico];

    // Atualiza Visual
    setUltimoNumero(novoNum);
    setHistorico(novoHistorico);
    setBloqueado(true);

    // Fala (LETRA + NÚMERO)
    falar(novoNum);

    // Envia pro Firebase com delay de segurança
    setTimeout(() => {
      set(ref(db, `salas/${salaId}/ultimoNumero`), novoNum);
      set(ref(db, `salas/${salaId}/historico`), novoHistorico);
      setBloqueado(false);
    }, 2000); // Aumentei um pouco o delay pois a fala ficou mais longa (Letra + Num)
  };

  // --- LÓGICA PADRÃO DE BANCO ---
  useEffect(() => {
    const historicoRef = ref(db, `salas/${salaId}/historico`);
    const vitoriaRef = ref(db, `salas/${salaId}/vencedor`);

    const unsubHist = onValue(historicoRef, (snapshot) => {
      const dados = snapshot.val();
      if (dados && historico.length === 0) {
        setHistorico(dados);
        if (dados.length > 0) setUltimoNumero(dados[0]);
      } else if (!dados) {
        setHistorico([]);
        setUltimoNumero(null);
      }
    });

    const unsubVit = onValue(vitoriaRef, (snapshot) => {
      if (snapshot.val()) {
        setMsgVitoria("🎉 BINGO! TEMOS UM VENCEDOR!");
        falarAviso("Bingo! Temos um vencedor.");
        if (navigator.vibrate) navigator.vibrate([500, 500, 500]);
      } else {
        setMsgVitoria(null);
      }
    });

    return () => { unsubHist(); unsubVit(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const novoJogo = () => {
    if (window.confirm("Reiniciar o jogo?")) {
      remove(ref(db, `salas/${salaId}`));
      setUltimoNumero(null);
      setHistorico([]);
      setMsgVitoria(null);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onVoltar} style={styles.btnVoltar}>⬅️ Sair</button>
        <span style={styles.salaInfo}>Sala: {salaId}</span>
        <button onClick={novoJogo} style={styles.btnReset}>🔄 Reset</button>
      </header>

      <main style={styles.main}>
        {msgVitoria && (
          <div style={styles.bannerVitoria}>{msgVitoria}</div>
        )}

        {/* VISUAL DA BOLA COM LETRA */}
        <div style={styles.bolaGigante}>
          {ultimoNumero ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1}}>
              <span style={{fontSize: 40, color: COLORS.primary}}>{obterLetra(ultimoNumero)}</span>
              <span>{ultimoNumero}</span>
            </div>
          ) : '-'}
        </div>
        <p style={{fontSize: 24, fontWeight: 'bold'}}>Sorteado</p>

        <button 
          style={{
            ...styles.botaoSortear,
            opacity: (bloqueado || msgVitoria) ? 0.6 : 1,
            cursor: (bloqueado || msgVitoria) ? 'wait' : 'pointer'
          }} 
          onClick={sortearNumero}
          disabled={bloqueado || !!msgVitoria}
        >
          {bloqueado ? "FALANDO..." : "SORTEAR 🔊"}
        </button>

        <div style={styles.historicoBox}>
          <p style={{fontWeight:'bold', marginBottom: 8}}>Anteriores:</p>
          <div style={styles.listaHistorico}>
            {historico.slice(1, 6).map((n, i) => (
              <span key={i} style={styles.bolinhaHist}>
                <span style={{fontSize: 10, display: 'block'}}>{obterLetra(n)}</span>
                {n}
              </span>
            ))}
          </div>
          <p style={{fontSize: 14, marginTop: 10, opacity: 0.8}}>
            Total: {historico.length} / 75
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: COLORS.primary, color: '#FFF', display: 'flex', flexDirection: 'column' },
  header: { padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  btnVoltar: { background:'none', border:'none', color:'#FFF', fontSize: 18, fontWeight:'bold', cursor:'pointer'},
  salaInfo: { fontSize: 20, fontWeight:'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
  btnReset: { backgroundColor: COLORS.danger, border:'none', borderRadius: 8, padding: '8px 12px', color:'#FFF', fontWeight:'bold', cursor:'pointer' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 20 },
  bolaGigante: {
    width: 200, height: 200, borderRadius: '50%', backgroundColor: '#FFF',
    color: '#000', fontSize: 100, fontWeight: 'bold', display: 'flex',
    alignItems: 'center', justifyContent: 'center', border: `10px solid ${COLORS.secondary}`,
    boxShadow: '0 10px 25px rgba(0,0,0,0.4)', marginBottom: 10
  },
  botaoSortear: {
    backgroundColor: COLORS.success, color: '#FFF', fontSize: 26, fontWeight: 'bold',
    padding: '22px 40px', borderRadius: 50, border: '4px solid #FFF',
    width: '100%', maxWidth: 350, boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
    transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
  },
  historicoBox: { 
    backgroundColor: 'rgba(255,255,255,0.15)', padding: 20, borderRadius: 20, 
    width: '100%', maxWidth: 350, textAlign:'center', marginTop: 10,
    border: '1px solid rgba(255,255,255,0.2)'
  },
  listaHistorico: { display: 'flex', justifyContent:'center', gap: 8, flexWrap: 'wrap' },
  bolinhaHist: { 
    backgroundColor: 'rgba(255,255,255,0.9)', color: COLORS.primary, width: 45, height: 45, 
    borderRadius: '50%', display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', 
    fontWeight:'bold', fontSize: 18, lineHeight: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
  },
  bannerVitoria: {
    backgroundColor: COLORS.warning, color: '#000', padding: 20, borderRadius: 15,
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20,
    border: '4px solid #FFF', boxShadow: '0 0 20px rgba(255, 193, 7, 0.8)',
    animation: 'pulse 1s infinite'
  }
};