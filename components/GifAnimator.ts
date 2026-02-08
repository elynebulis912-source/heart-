import gifuct from 'gifuct-js';

/**
 * Charge un GIF animé, décode les frames, et anime dans un canvas pour usage Three.js
 * Retourne un objet { canvas, update } où update() doit être appelé à chaque frame
 */
export async function loadAnimatedGifToCanvas(gifUrl: string): Promise<{ canvas: HTMLCanvasElement, update: () => void }> {
  const response = await fetch(gifUrl);
  const arrayBuffer = await response.arrayBuffer();
  const gif = gifuct.parseGIF(arrayBuffer);
  const frames = gifuct.decompressFrames(gif, true);

  const width = gif.lsd.width;
  const height = gif.lsd.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context error');

  let frameIdx = 0;
  let lastTime = performance.now();
  let delay = frames[0].delay || 10;

  function drawFrame(idx: number) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // Correction TS2339 : imageData peut ne pas exister sur ParsedFrame
    const imgData = (frames[idx] as any).imageData;
    if (imgData) {
      ctx.putImageData(imgData, 0, 0);
    }
  }

  function update() {
    const now = performance.now();
    if (now - lastTime > delay * 10) {
      frameIdx = (frameIdx + 1) % frames.length;
      drawFrame(frameIdx);
      delay = frames[frameIdx].delay || 10;
      lastTime = now;
    }
  }

  // Draw first frame
  drawFrame(0);

  return { canvas, update };
}
