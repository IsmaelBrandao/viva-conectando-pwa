// src/App.jsx

import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import PinturaScreen from './screens/PinturaScreen';
import MemoriaScreen from './screens/MemoriaScreen';
import CacaPalavrasScreen from './screens/CacaPalavrasScreen';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  const navegar = (tela) => {
    setTelaAtual(tela);
  };

  const voltarHome = () => {
    setTelaAtual('home');
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
      
      default:
        return <HomeScreen onNavigate={navegar} />;
    }
  };

  return renderizarTela();
}

export default App;