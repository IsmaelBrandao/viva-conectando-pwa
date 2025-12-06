// src/App.jsx
import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import PinturaScreen from './screens/PinturaScreen';
import MemoriaScreen from './screens/MemoriaScreen';
import CacaPalavrasScreen from './screens/CacaPalavrasScreen';
// Novas importações
import BingoMenuScreen from './screens/BingoMenuScreen';
import BingoSorteadorScreen from './screens/BingoSorteadorScreen';
import BingoCartelaScreen from './screens/BingoCartelaScreen';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');
  const [dadosBingo, setDadosBingo] = useState({ sala: null });

  const navegar = (tela) => setTelaAtual(tela);
  const voltarHome = () => {
    setTelaAtual('home');
    setDadosBingo({ sala: null });
  };

  // Função para entrar no Bingo
  const handleEntrarBingo = (sala, tipo) => {
    setDadosBingo({ sala });
    if (tipo === 'sorteador') setTelaAtual('bingo-sorteador');
    else setTelaAtual('bingo-cartela');
  };

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'home':
        return <HomeScreen onNavigate={navegar} />;
      case 'pintura':
        return <PinturaScreen onVoltar={voltarHome} />;
      case 'memoria':
        return <MemoriaScreen onVoltar={voltarHome} />;
      case 'caca-palavras':
        return <CacaPalavrasScreen onVoltar={voltarHome} />;
      
      // ROTAS BINGO
      case 'bingo-menu':
        return <BingoMenuScreen onEntrarSala={handleEntrarBingo} onVoltar={voltarHome} />;
      case 'bingo-sorteador':
        return <BingoSorteadorScreen salaId={dadosBingo.sala} onVoltar={voltarHome} />;
      case 'bingo-cartela':
        return <BingoCartelaScreen salaId={dadosBingo.sala} onVoltar={voltarHome} />;
      
      default:
        return <HomeScreen onNavigate={navegar} />;
    }
  };

  return renderizarTela();
}

export default App;