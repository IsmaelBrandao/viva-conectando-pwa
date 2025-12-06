// src/screens/BingoCartelaScreen.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from "firebase/database";
import { db } from '../services/firebaseConfig';
import { gerarCartelaBingo, verificarCartelaCompleta, obterLetra } from '../utils/bingoLogic';
import { COLORS, SIZES } from '../styles/colors';
import BotaoAjuda from '../components/BotaoAjuda'; // <--- IMPORTANTE

export default function BingoCartelaScreen({ salaId, onVoltar }) {
  const [cartela, setCartela] = useState(null);
  const [marcados, setMarcados] = useState([]);
  const [ultimoSorteado, setUltimoSorteado] = useState(null);
  const [historicoSorteados, setHistoricoSorteados] = useState([]);
  const [vencedor, setVencedor] = useState(false);

  useEffect(() => {
    setCartela(gerarCartelaBingo());
  }, []);

  useEffect(() => {
    const numeroRef = ref(db, `salas/${salaId}/ultimoNumero`);
    const historicoRef = ref(db, `salas/${salaId}/historico`);
    const vitoriaRef = ref(db, `salas/${salaId}/vencedor`);

    const unsubNum = onValue(numeroRef, (snapshot) => {
      const num = snapshot.val();
      if (num) {
        setUltimoSorteado(num);
        if (navigator.vibrate) navigator.vibrate(200);
        falar(num);
      } else {
        setMarcados([]);
        setUltimoSorteado(null);
        setHistoricoSorteados([]);
        setVencedor(false);
      }
    });

    const unsubHist = onValue(historicoRef, (snapshot) => {
      const dados = snapshot.val();
      if (dados) setHistoricoSorteados(dados);
      else setHistoricoSorteados([]);
    });

    const unsubVit = onValue(vitoriaRef, (snapshot) => {
      setVencedor(!!snapshot.val());
    });

    return () => { unsubNum(); unsubHist(); unsubVit(); };
  }, [salaId]);

  const falar = (num) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const letra = obterLetra(num);
      const msg = new SpeechSynthesisUtterance(`${letra}...... ${num}`);
      msg.lang = 'pt-BR';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  };

  const toggleMarcar = (num) => {
    if (marcados.includes(num)) {
      setMarcados(marcados.filter(n => n !== num));
    } else {
      setMarcados([...marcados, num]);
    }
  };

  // --- LÓGICA DE PSICOLOGIA POSITIVA ---
  const gritarBingo = () => {
    const realmenteGanhou = verificarCartelaCompleta(cartela, historicoSorteados);
    
    if (realmenteGanhou) {
      if (window.confirm("Que maravilha! Você completou tudo! Vamos avisar a todos?")) {
        set(ref(db, `salas/${salaId}/vencedor`), true);
      }
    } else {
      // Feedback gentil e sonoro
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Ainda faltam alguns números. Continue prestando atenção, você consegue!");
        msg.lang = 'pt-BR';
        window.speechSynthesis.speak(msg);
      }
      alert("🌟 Quase lá! \n\nAinda faltam alguns números para completar a cartela. Respire fundo e continue marcando!");
    }
  };

  if (!cartela) return <div style={styles.loading}>Gerando Cartela...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onVoltar} style={styles.btnVoltar}>⬅️</button>
        <div style={styles.painelSorteio}>
          <span>Sorteado:</span>
          <div style={styles.bolaDestaque}>
            {ultimoSorteado ? (
              <div style={{display:'flex', flexDirection:'column', lineHeight: 1, alignItems:'center'}}>
                <span style={{fontSize: 14, color: COLORS.primary}}>{obterLetra(ultimoSorteado)}</span>
                <span>{ultimoSorteado}</span>
              </div>
            ) : '-'}
          </div>
        </div>
      </header>

      {vencedor && (
        <div style={styles.avisoVitoria}>🏆 VENCEDOR! 🏆</div>
      )}

      <div style={styles.cartelaContainer}>
        <div style={styles.linhaHeader}>
          {['B','I','N','G','O'].map(letra => (
            <div key={letra} style={styles.letraBingo}>{letra}</div>
          ))}
        </div>

        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={styles.linha}>
            <BotaoCartela num={cartela.B[i]} marcados={marcados} onClick={toggleMarcar} />
            <BotaoCartela num={cartela.I[i]} marcados={marcados} onClick={toggleMarcar} />
            {i === 2 ? (
              <div style={styles.freeSlot}>★</div>
            ) : (
              <BotaoCartela num={cartela.N[i > 2 ? i-1 : i]} marcados={marcados} onClick={toggleMarcar} />
            )}
            <BotaoCartela num={cartela.G[i]} marcados={marcados} onClick={toggleMarcar} />
            <BotaoCartela num={cartela.O[i]} marcados={marcados} onClick={toggleMarcar} />
          </div>
        ))}
      </div>

      <button 
        style={{
            ...styles.btnBingo,
            opacity: vencedor ? 0.5 : 1, 
            cursor: vencedor ? 'not-allowed' : 'pointer'
        }} 
        onClick={gritarBingo}
        disabled={vencedor}
      >
        BINGO! ✋
      </button>

      {/* --- AQUI ESTÁ O BOTÃO DE AJUDA --- */}
      <BotaoAjuda texto="Esta é sua cartela. Quando o número sorteado aparecer lá em cima, procure ele na cartela e marque. Se completar tudo, aperte o botão Bingo!" />
    </div>
  );
}

// ... (Mantenha o componente BotaoCartela e os styles iguais aos que você já tem)
function BotaoCartela({ num, marcados, onClick }) {
  const marcado = marcados.includes(num);
  return (
    <button
      style={{
        ...styles.botaoNumero,
        backgroundColor: marcado ? COLORS.danger : '#FFF',
        color: marcado ? '#FFF' : '#000',
        transform: marcado ? 'scale(0.95)' : 'scale(1)',
      }}
      onClick={() => onClick(num)}
    >
      {num}
    </button>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: COLORS.backgroundSecondary, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loading: { fontSize: 24, padding: 50 },
  header: { 
    width: '100%', backgroundColor: COLORS.secondary, padding: '10px 15px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 10
  },
  btnVoltar: { background:'none', border:'none', fontSize: 30, cursor:'pointer', color:'#FFF' },
  painelSorteio: { display: 'flex', alignItems: 'center', gap: 10, color: '#FFF', fontWeight: 'bold', fontSize: 20 },
  bolaDestaque: { 
    width: 60, height: 60, borderRadius: '50%', backgroundColor: '#FFF', 
    color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold',
    border: '3px solid #000'
  },
  avisoVitoria: {
    width: '100%', backgroundColor: COLORS.success, color: '#FFF', padding: 15,
    textAlign: 'center', fontWeight: 'bold', fontSize: 20, animation: 'pulse 1s infinite'
  },
  cartelaContainer: {
    marginTop: 20, padding: 10, backgroundColor: '#FFF', borderRadius: 15,
    border: `3px solid ${COLORS.border}`, maxWidth: 500, width: '95%'
  },
  linhaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  letraBingo: { width: '18%', textAlign: 'center', fontSize: 32, fontWeight: '900', color: COLORS.primary },
  linha: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, height: 60 },
  botaoNumero: {
    width: '18%', height: '100%', borderRadius: 8, border: '2px solid #000',
    fontSize: 26, fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.1s'
  },
  freeSlot: {
    width: '18%', height: '100%', borderRadius: 8, border: '2px solid #000',
    fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', 
    color: COLORS.warning, backgroundColor: '#FFF'
  },
  btnBingo: {
    marginTop: 30, marginBottom: 20, backgroundColor: COLORS.success, color: '#FFF',
    fontSize: 36, fontWeight: 'bold', padding: '15px 60px', borderRadius: 50,
    border: `4px solid ${COLORS.border}`, boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
    cursor: 'pointer', animation: 'pulse 2s infinite'
  }
};