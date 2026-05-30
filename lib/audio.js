/* ==========================================================================
   SCODETTO ACADEMY - AUDIO MODULE (Web Audio API effects)
   ========================================================================== */

// Natively Synthesize realistic referee whistle audio wave using HTML5 Web Audio API
export function playWhistleSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Synthesize short high vibrato sound
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Core high whistle pitch
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, audioCtx.currentTime); // Shrill frequency
    
    // Vibrato modulator LFO
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 50; // Vibrato frequency (Hz)
    lfoGain.gain.value = 350; // Vibrato depth (Hz)
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Envelopes
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.04); // quick ramp up
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.22);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4); // quick decay
    
    lfo.start();
    osc.start();
    
    lfo.stop(audioCtx.currentTime + 0.4);
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (err) {
    console.error("Web Audio API Whistle failed:", err);
  }
}

export function playCrowdCheerSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Generate 4-second white noise buffer
    const bufferSize = audioCtx.sampleRate * 4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // Create 4 overlapping channels for thick stadium atmosphere
    const numSources = 4;
    for (let s = 0; s < numSources; s++) {
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      // Center frequency sweeps simulating massive stadium acoustics
      filter.frequency.setValueAtTime(320 + s * 90, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.2, audioCtx.currentTime);
      
      const gainNode = audioCtx.createGain();
      
      // Delay lines for staggering crowd echoes
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.04 * s;
      
      noiseNode.connect(filter);
      filter.connect(delay);
      delay.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Swelling volume envelope for crowd roar
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.15); // initial response
      gainNode.gain.exponentialRampToValueAtTime(0.45, audioCtx.currentTime + 0.8); // roaring peak
      gainNode.gain.setValueAtTime(0.45, audioCtx.currentTime + 2.5); // sustain cheer
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 3.8); // fade out
      
      noiseNode.start(0);
      noiseNode.stop(audioCtx.currentTime + 4.0);
    }
  } catch (err) {
    console.error("Web Audio Crowd Cheer failed:", err);
  }
}

// Gravity physics based Confetti celebration particle cascade
export function triggerConfettiCelebration() {
  const overlay = document.getElementById('celebration-overlay');
  if (!overlay) return;
  
  overlay.innerHTML = '';
  
  const colors = ['#D4AF37', '#FFF099', '#D61A22', '#0A2540', '#FFFFFF'];
  const numParticles = 120;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    
    const size = Math.random() * 8 + 6; // random size
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    
    // Distribute starting positions horizontally across top of viewport
    const startX = Math.random() * window.innerWidth;
    const startY = -20;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    overlay.appendChild(particle);
    
    // Physics states
    let posX = startX;
    let posY = startY;
    let vx = (Math.random() * 2 - 1) * 3.5; // lateral wind spread
    let vy = Math.random() * 5 + 4; // fall speed
    const gravity = 0.18;
    const wind = (Math.random() * 2 - 1) * 0.08;
    let rotation = Math.random() * 360;
    let rotSpeed = (Math.random() * 2 - 1) * 6;
    let opacity = 1.0;
    
    function updateParticle() {
      vy += gravity;
      vx += wind;
      posX += vx;
      posY += vy;
      rotation += rotSpeed;
      
      // Gradually fade out toward the lower half of screen
      if (posY > window.innerHeight * 0.6) {
        opacity -= 0.02;
      }
      
      particle.style.transform = `translate3d(${posX - startX}px, ${posY - startY}px, 0) rotate(${rotation}deg)`;
      particle.style.opacity = opacity;
      
      if (posY < window.innerHeight && opacity > 0) {
        requestAnimationFrame(updateParticle);
      } else {
        particle.remove();
      }
    }
    
    // Staggered launch delays for natural look
    setTimeout(() => {
      requestAnimationFrame(updateParticle);
    }, Math.random() * 800);
  }
}
