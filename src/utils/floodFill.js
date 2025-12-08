// src/utils/floodFill.js

export function floodFill(canvas, startX, startY, fillColor) {
  // Otimização: willReadFrequently ajuda o navegador a não travar a memória
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const width = canvas.width;
  const height = canvas.height;

  // 1. Pega todos os dados de pixels da tela
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 2. Identifica a posição e a cor do clique inicial
  const startPos = (startY * width + startX) * 4;
  
  // Se clicou fora da área desenhável, cancela
  if (startPos < 0 || startPos >= data.length) return;

  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  // 3. Prepara a nova cor
  const fillRGB = hexToRgb(fillColor);
  const fillR = fillRGB.r;
  const fillG = fillRGB.g;
  const fillB = fillRGB.b;
  const fillA = 255; // Opacidade total

  // 4. PROTEÇÃO: Se a cor clicada já for a cor que queremos pintar, não faz nada.
  // Isso evita o travamento do navegador.
  if (
    Math.abs(startR - fillR) < 10 &&
    Math.abs(startG - fillG) < 10 &&
    Math.abs(startB - fillB) < 10 &&
    startA === fillA
  ) {
    return;
  }

  // 5. Configuração da PILHA (Stack)
  // Usamos uma pilha para processar os pixels. É mais rápido que recursão.
  const stack = [startX, startY];
  
  // Matriz para marcar pixels já verificados (evita loop infinito)
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const y = stack.pop();
    const x = stack.pop();

    const pixelIndex = y * width + x;

    // Se já visitamos, pula
    if (visited[pixelIndex]) continue;
    visited[pixelIndex] = 1;

    const dataIndex = pixelIndex * 4;

    // 6. A MÁGICA: COMPARAÇÃO DE COR (Tolerância)
    // Verifica se o pixel atual é "parecido" com a cor original do clique.
    if (colorsMatch(data, dataIndex, startR, startG, startB, startA)) {
      // Pinta o pixel
      data[dataIndex] = fillR;
      data[dataIndex + 1] = fillG;
      data[dataIndex + 2] = fillB;
      data[dataIndex + 3] = fillA;

      // Adiciona vizinhos (Cima, Baixo, Esquerda, Direita) na pilha
      if (x > 0) stack.push(x - 1, y);
      if (x < width - 1) stack.push(x + 1, y);
      if (y > 0) stack.push(x, y - 1);
      if (y < height - 1) stack.push(x, y + 1);
    }
  }

  // 7. Salva a nova imagem no canvas
  ctx.putImageData(imageData, 0, 0);
}

// Verifica se a cor do pixel atual é parecida com a cor inicial
function colorsMatch(data, pos, r, g, b, a) {
  const dr = data[pos] - r;
  const dg = data[pos + 1] - g;
  const db = data[pos + 2] - b;
  const da = data[pos + 3] - a;

  // Distância Euclidiana ao quadrado (mais rápido que tirar raiz quadrada)
  // Isso calcula quão diferente as cores são matematicamente.
  const distanceSq = dr * dr + dg * dg + db * db + da * da;

  // TOLERÂNCIA: Ajuste este valor se necessário.
  // 1000 a 3000 é um bom valor para ignorar ruído de JPG (artefatos cinzas),
  // mas parar em linhas pretas sólidas.
  return distanceSq < 2500; 
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}