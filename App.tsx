import React, { useState, useEffect, useRef } from 'react';
import FloatingHearts from './components/FloatingHearts';
import MapVisual from './components/MapVisual';
import Gallery from './components/Gallery';
import LoveUniverse from './components/LoveUniverse';
import LettersSection from './components/LettersSection';
import { AppStage, NavTabProps } from './types';

import { Play, Pause, Sun, Moon, Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro');
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  
  // --- Thème (light par défaut) ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // GIFs configurables
  const [showGifEditor, setShowGifEditor] = useState(false);
  const [gifs, setGifs] = useState<Array<{id:number; src:string; top:string; left:string; size:string; opacity:number}>>([
    { id: 1, src: '/gif13.gif', top: '2%', left: '50%', size: '10rem', opacity: 0.9 },
  ]);
  
  // Photos configurables
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [photos, setPhotos] = useState<Array<{id:number; src:string; top:string; left:string; size:string; opacity:number}>>([
    { id: 1, src: '/A1.jpg', top: '58%', left: '87%', size: '10rem', opacity: 0.95 },
    { id: 2, src: '/A2.jpeg', top: '6%', left: '2%', size: '10rem', opacity: 0.8 },
    { id: 4, src: '/A4.jpeg', top: '2%', left: '45%', size: '7rem', opacity: 0.6 },
  ]);
  
  const updatePhoto = (id: number, patch: Partial<{top:string; left:string; size:string; opacity:number}>) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const updateGif = (id: number, patch: Partial<{top:string; left:string; size:string; opacity:number}>) => {
    setGifs(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g));
  };
  
  // --- Contrôle Volume ---
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Variables Swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  // --- AUDIO LOGIC ---
  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  } 

  const togglePlay2 = () => {
    if (audioRef2.current) {
      if (audioRef2.current.paused) {
        // Pause le premier audio si en cours
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
        audioRef2.current.play().then(() => setIsPlaying2(true)).catch(console.error);
      } else {
        audioRef2.current.pause();
        setIsPlaying2(false);
      }
    }
  } 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVolume(prev => !prev);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => setShowVolume(false), 3000);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let audioEl = document.getElementById('global-audio') as HTMLAudioElement | null;
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'global-audio';
      audioEl.src = '/love-song.mp4';
      audioEl.preload = 'auto';
      audioEl.loop = true;
      audioEl.autoplay = false;
      audioEl.muted = false;
      (audioEl as any).playsInline = true;
      audioEl.volume = volume;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
    }
    audioRef.current = audioEl;

    // Ajout du deuxième audio
    let audioEl2 = document.getElementById('global-audio2') as HTMLAudioElement | null;
    if (!audioEl2) {
      audioEl2 = document.createElement('audio');
      audioEl2.id = 'global-audio2';
      audioEl2.src = '/Ce reve bleu.mp3.mpeg'; // Changer ici pour le nouveau son
      audioEl2.preload = 'auto';
      audioEl2.loop = true;
      audioEl2.autoplay = false;
      audioEl2.muted = false;
      (audioEl2 as any).playsInline = true;
      audioEl2.volume = volume;
      audioEl2.style.display = 'none';
      document.body.appendChild(audioEl2);
    }
    audioRef2.current = audioEl2;

    const onPlay = () => {
      setIsPlaying(true);
      if (audioRef2.current && !audioRef2.current.paused) {
        audioRef2.current.pause();
      }
    };
    const onPause = () => setIsPlaying(false);
    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);

    const onPlay2 = () => {
      setIsPlaying2(true);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    const onPause2 = () => setIsPlaying2(false);
    audioEl2.addEventListener('play', onPlay2);
    audioEl2.addEventListener('pause', onPause2);

    return () => {
      audioEl.removeEventListener('play', onPlay);
      audioEl.removeEventListener('pause', onPause);
      audioEl2.removeEventListener('play', onPlay2);
      audioEl2.removeEventListener('pause', onPause2);
    };
  }, []);

  // --- NAVIGATION ---
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setStage('valentine');
      window.scrollTo(0, 0);
    }, 2000);
  };

  // --- SWIPE ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (Math.abs(touchStart - touchEnd) > 50 && stage === 'valentine') goToGallery();
  };
  const goToGallery = () => {
    setStage('gallery');
    window.scrollTo(0, 0);
  };

  // --- COULEURS DYNAMIQUES SELON THÈME ---
  const bgClass = theme === 'dark' ? 'bg-black' : 'bg-[#fffcfd]';
  const textTitleClass = theme === 'dark' ? 'text-red-600' : 'text-pink-600';
  const textSubClass = theme === 'dark' ? 'text-red-900' : 'text-pink-400';
  const accentClass = theme === 'dark' ? 'bg-red-600' : 'bg-pink-500';
  const navBgClass = theme === 'dark' ? 'bg-black/90 border-red-950 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-white/40 border-white shadow-xl';

  // Composant du Player global (Style Spotify Très Fin - Toujours présent)
  const GlobalSpotifyPlayer = () => (
    <div className="fixed top-1 right-3 z-[1100] flex flex-col items-end" onClick={(e) => e.stopPropagation()}>
      <div className={`flex items-center gap-2 backdrop-blur-3xl rounded-full p-1 border shadow-2xl transition-all duration-500 hover:scale-[1.02] ${theme === 'dark' ? 'bg-black/95 border-red-900' : 'bg-white/60 border-white/40'}`}> 
        {/* Player 1 */}
        <div className={`w-8 h-8 rounded-full overflow-hidden border transition-transform ${theme === 'dark' ? 'border-red-600' : 'border-pink-200'}`}> 
           <img src="/gif9.gif" alt="Music" className={`w-full h-full object-cover`} />
        </div>
        <div className="flex flex-col pr-1 min-w-[95px]">
           <span className={`text-[9px] font-black tracking-tight leading-none truncate ${theme === 'dark' ? 'text-red-500' : 'text-pink-600'}`}>Baby I Love You</span>
           <span className={`text-[7px] font-medium opacity-60 ${theme === 'dark' ? 'text-red-900' : 'text-pink-400'}`}>{isPlaying ? "On Air ⸺⸻𝅘𝅥𝅮" : "Pause ⸺⸻𝅘𝅥𝅮"}</span>
        </div>
        <button onClick={togglePlay} className={`w-7 h-7 flex items-center justify-center rounded-full text-white shadow-md transition-all active:scale-90 ${accentClass} hover:opacity-90`}>
          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>

        {/* Player 2 */}
        <div className={`w-8 h-8 rounded-full overflow-hidden border transition-transform ${theme === 'dark' ? 'border-red-600' : 'border-pink-200'}`}> 
           <img src="/gif18.gif" alt="Music2" className={`w-full h-full object-cover`} />
        </div>
        <div className="flex flex-col pr-1 min-w-[95px]">
           <span className={`text-[9px] font-black tracking-tight leading-none truncate ${theme === 'dark' ? 'text-red-500' : 'text-pink-600'}`}>Ce Rêve Bleu </span>
           <span className={`text-[7px] font-medium opacity-60 ${theme === 'dark' ? 'text-red-900' : 'text-pink-400'}`}>{isPlaying2 ? "On Air ⸺⸻𝅘𝅥𝅮" : "Pause ⸺⸻𝅘𝅥𝅮"}</span>
        </div>
        <button onClick={togglePlay2} className={`w-7 h-7 flex items-center justify-center rounded-full text-white shadow-md transition-all active:scale-90 ${accentClass} hover:opacity-90`}>
          {isPlaying2 ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
        </button>

        {/* Volume Button */}
        <button onClick={handleVolumeClick} className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${theme === 'dark' ? 'text-red-600 hover:bg-red-900/20' : 'text-pink-600 hover:bg-white/20'}`}>{volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}</button>
      </div>

      {/* Volume Slider Compact Horizontal */}
      {showVolume && (
        <div className={`mt-2 p-2 rounded-xl backdrop-blur-3xl border transition-all duration-300 animate-fadeIn ${theme === 'dark' ? 'bg-black/95 border-red-900' : 'bg-white/40 border-white/40'}`}> 
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if(volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current); volumeTimeoutRef.current = setTimeout(() => setShowVolume(false), 3000); }} className={`w-20 h-1 appearance-none rounded-full cursor-pointer accent-red-600 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-pink-100'}`}/>
        </div>
      )}
    </div>
  );
  // Switcher de thème - Uniquement sur Valentine
  const ThemeSwitcher = () => (
    <div className={`fixed top-4 left-4 z-[500] flex gap-1 backdrop-blur-md p-1 rounded-full border transition-all duration-500 ${theme === 'dark' ? 'bg-black/80 border-red-900 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-white/30 border-white/40'}`} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-pink-400'}`}
      >
        <Sun size={14} />
      </button>
      <button 
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-red-600 text-black shadow-sm' : 'text-gray-500 hover:text-red-500'}`}
      >
        <Moon size={14} />
      </button>
    </div>
  );

   if (stage === 'valentine') {
    return (
      <div 
        className={`fixed inset-0 ${bgClass} z-[200] flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={goToGallery}
      >
        <FloatingHearts theme={theme} />
        <ThemeSwitcher />
        <GlobalSpotifyPlayer />

        
        {/* Decorative elements dispersion */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          {photos.map(p => (
            <img key={p.id} src={p.src} alt={`photo-${p.id}`} style={{ top: p.top, left: p.left, width: p.size, opacity: p.opacity }} className="absolute rounded-lg drop-shadow-xl transform rotate-3" />
          ))}
        </div>

        <div className="relative z-40 flex flex-col items-center justify-center max-w-4xl px-6 animate-[zoomIn_1s_ease-out]">
          {/* Titre Dancing Script */}
          <div className="text-center mb-6 md:mb-10 relative inline-block">
            <h1 style={{ fontFamily: "'Dancing Script', cursive" }} className={`text-5xl md:text-7xl leading-tight drop-shadow-sm transition-colors duration-1000 font-bold ${textTitleClass} valentine-title`}>
              Happy Valentine's Day,<span className="block">my love!</span>
            </h1>
            <div className="absolute right-10 -translate-x-1/2 top-1/2 flex gap-2 mt-2">
              <img src="/gif13.gif" alt="decor3" className="w-20 pointer-events-none" />
            </div>
          </div>

          {/* LA LETTRE - Affichage texte seul */}
          <div className="w-full max-w-lg pointer-events-auto relative">
            <div className={`relative p-4 md:p-6 rounded-2xl bg-transparent transition-all duration-1000`}>
        {/* GIF16 EN ABSOLUTE SUR LA PAGE ENTIÈRE, TOUT À GAUCHE */}
        <img 
          src="/gif16.gif" 
          alt="gif16" 
          className="w-30 md:w-60 h-auto absolute z-50" 
          style={{ left: '-100%',top: '55%',opacity: 0.9, pointerEvents: 'none' }} 
        />

              <p style={{ fontFamily: "'Great Vibes', cursive" }} className="text-[#5d4037] text-2xl md:text-4xl mb-3 opacity-95">
                My Dearest Love,
              </p>

              <div style={{ fontFamily: "'Great Vibes', cursive" }} className="space-y-2 text-[#4a4a4a] leading-snug text-lg md:text-2xl">
                <p>
                  I want to express my gratitude for your unique presence in my life. Your calm and genuine essence makesme feel at ease, a quality I deeply admire.
                </p>
                <p>
                  Your laughter brightens my days and your kindness warms my heart. With you, every moment feels magical.
                </p>
                <p>
                  On this special day, I want to remind you how deeply you matter to me. You are my greatest treasure.
                </p>
              </div>

              <div className="mt-4">
                <p style={{ fontFamily: "'Great Vibes', cursive" }} className="text-[#8b4789] font-semibold text-xl md:text-3xl italic">
                  Hubert Ilunga Kyungu, je t'aime éperdument.
                </p>
                <div className="flex flex-row items-center justify-end mt-4 gap-3">
                  <p style={{ fontFamily: "'Great Vibes', cursive" }} className="text-3xl md:text-4xl text-[#8b7355] opacity-80 m-0">
                    Eternally yours,
                  </p>
                  <img 
                    src="/gif15.gif" 
                    alt="gif15" 
                    className="w-40 md:w-40 h-auto absolute z-50" 
                    style={{ top: '40%', left: 'auto', right: '100%', marginBottom: '-2px', pointerEvents: 'none' }} 
                  />
                
                  
                  
                </div>
              </div>
              

            </div>
          </div>

          {/* UI de configuration supprimée — gif placé directement sous le titre */}
        
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen transition-colors duration-1000 ${bgClass} selection:bg-red-950 selection:text-white font-sans scrollbar-stable`}>
      <FloatingHearts theme={theme} />
      <GlobalSpotifyPlayer />
      
      {stage === 'intro' ? (
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center space-y-20 animate-fadeIn relative z-10">
          <header className="text-center max-w-4xl">
            <h1 className={`text-6xl md:text-7xl font-romantic leading-tight mb-6 transition-colors duration-1000 ${textTitleClass}`}>Un an et toujours toi</h1>
          </header>
          <div className={`w-full max-w-6xl transition-all duration-1000 ${theme === 'dark' ? 'brightness-75 contrast-125' : ''}`}>
            <MapVisual theme={theme} />
          </div>
          <div className="text-center px-6 max-w-2xl mx-auto">
            <p className={`text-xl md:text-2xl font-serif-luxe italic transition-colors duration-1000 ${textSubClass} mt-8 leading-tight`}>
              Dakar et Istanbul ne sont que des noms sur une carte. <br/> Toi, tu es mon seul port d'attache.
            </p>
          </div>
          <div className="w-full flex flex-col items-center space-y-16">
            <div className="relative">
              <div className={`w-64 h-64 rounded-full p-4 shadow-2xl border transition-all duration-1000 group ${theme === 'dark' ? 'bg-black border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'bg-white border-pink-50'}`}>
                <img src="/gif1.gif" alt="Gif Amour" className={`w-full h-full object-cover rounded-full transition-transform duration-1000 group-hover:scale-105 ${theme === 'dark' ? 'grayscale brightness-75 contrast-125' : ''}`} />
                <div className={`absolute -top-4 -right-4 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl animate-bounce ${accentClass}`}>♥</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button onMouseDown={handleScan} onTouchStart={handleScan} className="relative w-32 h-32 group outline-none cursor-pointer">
                <svg viewBox="0 0 24 24" className={`w-full h-full transition-all duration-700 ${isScanning ? (theme === 'dark' ? 'text-red-600 scale-110 drop-shadow-[0_0_25px_#dc2626]' : 'text-pink-600 scale-110 drop-shadow-[0_0_25px_#ff4d6d]') : (theme === 'dark' ? 'text-red-950' : 'text-pink-200 hover:text-pink-300')}`} fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  <g fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.6"><path d="M7 10 Q12 7 17 10" /><path d="M6 13 Q12 10 18 13" /><path d="M7 16 Q12 14 17 16" /></g>
                </svg>
                <div className={`absolute left-0 right-0 h-1 transition-all duration-1000 ${isScanning ? 'top-full opacity-100' : 'top-0 opacity-0'} ${theme === 'dark' ? 'bg-red-500 shadow-[0_0_15px_#dc2626]' : 'bg-white shadow-[0_0_15px_white]'}`}></div>
              </button>
              <span className={`font-black uppercase tracking-[0.5em] text-[10px] animate-pulse transition-colors ${theme === 'dark' ? 'text-red-900' : 'text-pink-400'}`}>Maintiens pour déverrouiller</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`animate-[fadeIn_1.5s_ease-out] relative z-10 ${stage === 'universe' ? 'h-screen flex flex-col overflow-hidden' : 'pb-40 pt-24'}`}>
          <nav className={`sticky top-6 z-[100] mx-auto w-full max-w-sm backdrop-blur-3xl rounded-[2rem] border shadow-2xl p-2 flex gap-1 items-center mb-16 transition-all ${navBgClass}`}>
            <NavTab active={stage === 'gallery'} theme={theme} onClick={() => setStage('gallery')}>Memories</NavTab>
            <NavTab active={stage === 'universe'} theme={theme} onClick={() => setStage('universe')}>Universe</NavTab>
            <NavTab active={stage === 'letters'} theme={theme} onClick={() => setStage('letters')}>Letters</NavTab>
          </nav>
          <main className={`max-w-7xl mx-auto px-6 relative w-full ${stage === 'universe' ? 'flex-1 overflow-hidden' : ''}`}>
            {stage === 'gallery' && <Gallery theme={theme} />}
            {stage === 'universe' && (
              <div className="w-full h-full relative love-universe-container">
                 <LoveUniverse theme={theme} />
              </div>
            )}
            {stage === 'letters' && <LettersSection theme={theme} />}
          </main>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Great+Vibes&display=swap');
        
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        
        .fixed.bg-black\\/95 button.absolute.top-24.right-8 {
          top: 6rem !important;
          right: 5.5rem !important;
          opacity: 1;
          z-index: 2100;
          background: rgba(0,0,0,0.55);
          padding: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 6px 28px rgba(0,0,0,0.45);
        }
        .fixed.bg-black\\/95 button.absolute.top-24.right-8:hover {
          transform: scale(1.05);
          color: #dc2626 !important;
          background: rgba(0,0,0,0.9);
        }

        .love-universe-container .pointer-events-none.flex.flex-col.items-center.justify-center.z-10 {
           display: none !important;
        }

        html, body {
          scrollbar-gutter: stable;
        }

        body { 
          background-color: ${theme === 'dark' ? 'black' : '#fffcfd'};
          overflow-y: ${stage === 'universe' ? 'hidden' : 'auto'};
        }

        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-130vh) rotate(360deg); opacity: 0; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse { from { transform: scale(1); } 50% { transform: scale(1.05); } to { transform: scale(1); } }
        .valentine-title { animation: pulse 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const NavTab: React.FC<NavTabProps> = ({ active, onClick, children, theme }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 min-w-[100px] h-[44px] rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap overflow-hidden text-ellipsis ${
      active 
        ? (theme === 'dark' ? 'bg-red-700 text-black shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-pink-500 text-white shadow-xl scale-105') 
        : (theme === 'dark' ? 'text-red-900 hover:text-red-500' : 'text-pink-400 hover:bg-white/50')
    }`}
  >
    {children}
  </button>
);

export default App;