import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ThemeProps } from '../types';
import { Play, Pause, X, ChevronLeft, ChevronRight, Image as ImageIcon, Film, Heart, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { Pause as PauseIcon } from 'lucide-react';
import { AppStage } from '../types';
// --- TYPES ---
type MediaType = 'image' | 'video';

interface MediaData {
  id: string;
  src: string;
  type: MediaType;
  title: string;
  date: string;
}

// --- 1. COMPOSANT MEDIA ITEM (Tuile de la grille) ---
const MediaItem: React.FC<{
  baseId: string;
  title: string;
  index: number;
  onMediaFound: (data: MediaData) => void;
  onClick: () => void;
  isVisible: boolean;
}> = ({ baseId, title, index, onMediaFound, onClick, isVisible }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [data, setData] = useState<MediaData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calcul taille Bento (1 grosse tous les 5 items)
  const isLarge = index % 5 === 0;
  const sizeClass = isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1";

  useEffect(() => {
    let mounted = true;
    const pad3 = (n: string) => n.toString().padStart(3, '0');

    // Détermine si c'est une vidéo (ID commence par 'v')
    const isVideoId = baseId.startsWith('v');
    const numId = isVideoId ? baseId.slice(1) : baseId;

    // Stratégie de découverte des fichiers
    let candidates;
    if (isVideoId) {
      // Pour les vidéos, cherche seulement les fichiers vidéo
      candidates = [
        { src: `/Images/${numId}.mp4`, type: 'video' as const },
        { src: `/Images/${pad3(numId)}.mp4`, type: 'video' as const },
      ];
    } else {
      // Pour les images, cherche images EN PREMIER, puis vidéos en fallback
      candidates = [
        { src: `/Images/photo-${pad3(numId)}.jpg`, type: 'image' as const },
        { src: `/Images/${numId}.jpg`, type: 'image' as const },
        { src: `/Images/${numId}.jpeg`, type: 'image' as const },
        { src: `/Images/${numId}.png`, type: 'image' as const },
        { src: `/Images/photo-${numId}.jpg`, type: 'image' as const },
      ];
    }

    const testFileExists = (src: string, type: 'image' | 'video'): Promise<boolean> => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 5000);
        
        // Pour les vidéos, utilise une détection native plus fiable
        if (type === 'video') {
          const video = document.createElement('video');
          let resolved = false;
          
          const onCanPlay = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              resolve(true);
            }
          };
          const onLoadedMetadata = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              resolve(true);
            }
          };
          const onError = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
              resolve(false);
            }
          };
          
          video.addEventListener('canplay', onCanPlay, { once: true });
          video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
          video.addEventListener('error', onError, { once: true });
          video.src = src;
        } else {
          // Pour les images, utilise fetch
          fetch(src, { method: 'GET' })
            .then((res) => {
              clearTimeout(timeout);
              resolve(res.ok);
            })
            .catch(() => {
              clearTimeout(timeout);
              resolve(false);
            });
        }
      });
    };

    const findMedia = async () => {
      for (const c of candidates) {
        if (!mounted) return;
        try {
          const exists = await testFileExists(c.src, c.type);
          if (exists) {
            const mediaData: MediaData = {
              id: baseId,
              src: c.src,
              type: c.type,
              title,
              date: '2025-2026'
            };
            console.log(`ID ${baseId}: detected ${c.type} from ${c.src}`);
            
            if (mounted) {
              setData(mediaData);
              setStatus('ready');
              onMediaFound(mediaData);
            }
            return;
          }
        } catch (e) {
          // continue to next candidate
        }
      }
      if (mounted) setStatus('error');
    };

    findMedia();
    return () => { mounted = false; };
  }, [baseId, title, onMediaFound]);

  // Si le fichier n'existe pas, on cache totalement
  if (status === 'error') return null;
  
  // En chargement, afficher un placeholder
  if (status === 'loading') {
    return <div className={`bg-pink-50/50 animate-pulse rounded-[2rem] ${sizeClass}`} />;
  }

  // Si on le cache par filtre, on retourne null (pas d'espace vide)
  if (!isVisible) return null;

  return (
    <div 
      onClick={onClick}
      className={`${sizeClass} group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white ring-1 ring-black/5`}
    >
      {data?.type === 'video' ? (
        <>
          <video
            ref={videoRef}
            src={data.src}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-none z-10">
            <Play size={14} className="text-white fill-white" />
          </div>
        </>
      ) : (
        <img
          src={data?.src}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      )}

      {/* Overlay iOS Style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">{data?.date}</span>
          {data?.title ? (
            <h3 className="text-white text-lg font-serif italic">{data.title}</h3>
          ) : null}
      </div>
    </div>
  );
};

// --- 2. LIGHTBOX (Plein écran) ---
const Lightbox: React.FC<{
  item: MediaData;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ item, onClose, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  // Par défaut, les vidéos du lightbox sont muettes pour éviter plusieurs sources audio
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Remise à zéro quand on change d'image
  useEffect(() => { setIsPlaying(true); }, [item]);

  // Raccourcis Clavier (Flèches, Espace, M, Echap)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === ' ' && item.type === 'video') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' && item.type === 'video') toggleMute();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev, item]);

  // Fonctions de contrôle
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[999] bg-black flex items-center justify-center select-none">
      
      {/* Bouton Fermer */}
      <button onClick={onClose} className="absolute top-6 right-6 z-[1200] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all transform hover:scale-110">
        <X size={24} />
      </button>

      {/* Flèche Gauche (Précédent) - Toujours visible */}
      <button 
        onClick={(e) => {e.stopPropagation(); onPrev()}} 
        className="absolute left-6 top-1/2 -translate-y-1/2 z-[1200] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      {/* Flèche Droite (Suivant) - Toujours visible */}
      <button 
        onClick={(e) => {e.stopPropagation(); onNext()}} 
        className="absolute right-6 top-1/2 -translate-y-1/2 z-[1200] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
      >
        <ChevronRight size={32} strokeWidth={2.5} />
      </button>

      {/* Zone Média */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        {item.type === 'video' ? (
          <div className="relative max-w-full max-h-full group">
            <video 
              ref={videoRef}
              src={item.src} 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" 
              autoPlay 
              playsInline
              loop
              muted={isMuted}
            />
            
            {/* Icône Play centrale si en pause */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                onClick={togglePlay}
              >
                <Play size={80} className="text-white fill-white opacity-90" />
              </div>
            )}
            
            {/* BARRE DE CONTRÔLE FLOTTANTE (Apparaît au survol) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
              
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-pink-400 transition">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
              
              <div className="w-px h-6 bg-white/20"></div>
              
              {/* Mute/Unmute */}
              <button onClick={toggleMute} className="text-white hover:text-pink-400 transition">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              
              <div className="w-px h-6 bg-white/20"></div>
              
              {/* Plein écran */}
              <button onClick={toggleFullscreen} className="text-white hover:text-pink-400 transition">
                <Maximize2 size={24} />
              </button>
            </div>
          </div>
        ) : (
          <img 
            src={item.src} 
            alt={item.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            draggable={false}
          />
        )}
      </div>

      {/* Footer Infos */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-center pointer-events-none">
        {item.title && (
          <h2 className="text-2xl md:text-3xl text-white font-serif italic drop-shadow-lg mb-2">{item.title}</h2>
        )}
        <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
          Collection Privée • {item.type === 'image' ? 'Mon namoureux' : 'Mon namoureux'}
        </p>
      </div>
    </div>
  );
};

// --- 3. GALERIE PRINCIPALE ---
const Gallery: React.FC<ThemeProps> = () => {
  // États pour les positions aléatoires des GIFs
  const [gifPositions, setGifPositions] = useState<Array<{top: number, left: number}>>([
    {top: 0, left: 0},
    {top: 0, left: 0},
    {top: 0, left: 0},
    {top: 0, left: 0}
  ]);

  useEffect(() => {
    // Génère des positions aléatoires dans les 4 coins
    setGifPositions([
      {top: Math.random() * 10, left: Math.random() * 5}, // Haut gauche
      {top: Math.random() * 10, left: 90 + Math.random() * 7}, // Haut droit
      {top: 85 + Math.random() * 10, left: Math.random() * 3}, // Bas gauche
      {top: 85 + Math.random() * 10, left: 90 + Math.random() *5} // Bas droit
    ]);
  }, []);

  // Génère une liste d'ID théoriques (1 à 106 images + 200 vidéos)
  const [baseItems] = useState(() => {
    const items = [];
    // Images: IDs 1-106 (107–162 supprimés car vides)
    for (let i = 1; i <= 106; i++) {
      items.push({ id: `${i}`, title: '' });
    }
    // Vidéos: IDs v1-v200
    for (let i = 1; i <= 200; i++) {
      items.push({ id: `v${i}`, title: '' });
    }
    return items;
  });

  const [validItems, setValidItems] = useState<MediaData[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Callback quand un média est trouvé valide
  const handleMediaFound = useCallback((item: MediaData) => {
    setValidItems(prev => {
      // Évite les doublons
      if (prev.find(p => p.id === item.id)) return prev;
      // Trie par ID numérique (1, 2, 3...)
      return [...prev, item].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    });
  }, []);

  // Filtrage et mélange (alterne sections d'images et de vidéos pour éviter regroupement)
  const displayedItems = React.useMemo(() => {
    const filtered = validItems.filter(item => {
      if (filter === 'all') return true;
      return item.type === filter;
    });

    // Mélange: si 'all', alterne sections d'images et vidéos
    if (filter === 'all') {
      const images = filtered.filter(i => i.type === 'image');
      const videos = filtered.filter(i => i.type === 'video');
      const mixed: MediaData[] = [];
      const sectionSize = 5;
      let imgIdx = 0, vidIdx = 0;
      let useImg = true;
      while (imgIdx < images.length || vidIdx < videos.length) {
        if (useImg) {
          for (let k = 0; k < sectionSize && imgIdx < images.length; k++) mixed.push(images[imgIdx++]);
        } else {
          for (let k = 0; k < sectionSize && vidIdx < videos.length; k++) mixed.push(videos[vidIdx++]);
        }
        useImg = !useImg;
      }
      return mixed;
    }
    return filtered;
  }, [validItems, filter]);

  // Gestion Lightbox
  const currentItem = lightboxIndex !== null ? displayedItems[lightboxIndex] : null;

  const nextImage = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % displayedItems.length);
  };
 
  const prevImage = () => {
    if (lightboxIndex !== null) {
      // Formule pour boucler en arrière correctement
      setLightboxIndex((lightboxIndex - 1 + displayedItems.length) % displayedItems.length);
    }
  };

 
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-gray-900 flex flex-col md:flex-row font-sans relative">
      
      

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
      
      {/* --- SIDEBAR / MENU (Style App iOS) --- */}
      <aside className="md:w-80 md:h-screen md:sticky md:top-0 bg-white border-r border-pink-100 p-8 flex flex-col justify-between z-20 shadow-[4px_0_30px_rgba(0,0,0,0.02)]">
        <div>
          <div className="mb-12 pt-4">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border border-pink-100 px-2 py-1 rounded-full bg-pink-50">
              Daddy
            </span>
            <h1 className="text-5xl font-serif font-black text-pink-950 tracking-tighter leading-[0.9] mt-6">
              All<br/><span className="text-pink-500">Of You</span>
            </h1>
          </div>

          <nav className="space-y-3">
            {[
              { id: 'all', icon: Heart, label: 'See All' },
              { id: 'image', icon: ImageIcon, label: 'Pictures' },
              { id: 'video', icon: Film, label: 'Videos' }
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 text-sm font-bold tracking-wide ${
                  filter === btn.id 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 transform scale-105' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {/* @ts-ignore */}
                <btn.icon size={18} /> {btn.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="hidden md:block">
          <p className="text-xs text-gray-300 font-medium uppercase tracking-widest mb-1"><i>I just wanna say i love you</i></p>
          <p className="text-xs text-gray-400 font-serif italic">2025 — 2026</p>
        </div>
      </aside>

      {/* --- GRILLE --- */}
      <main className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto relative z-10">
        {/* Background GIFs sur les bords de la galerie avec positions aléatoires */}
        <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0" style={{top: 0, left: 0}}>
          <div style={{ top: `${gifPositions[0]?.top}%`, left: `${gifPositions[0]?.left}%` }} className="absolute w-24 h-24 md:w-32 md:h-32 animate-float">
            <img src="/gif1.gif" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
          <div style={{ top: `${gifPositions[1]?.top}%`, left: `${gifPositions[1]?.left}%` }} className="absolute w-20 h-20 md:w-28 md:h-28 animate-float-delayed">
            <img src="/gif2.gif" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
          <div style={{ top: `${gifPositions[2]?.top}%`, left: `${gifPositions[2]?.left}%` }} className="absolute w-16 h-16 md:w-24 md:h-24 animate-pulse">
            <img src="/gif3.gif" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
          <div style={{ top: `${gifPositions[3]?.top}%`, left: `${gifPositions[3]?.left}%` }} className="absolute w-20 h-20 md:w-28 md:h-28 animate-pulse">
            <img src="/gif5.gif" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-6 relative z-10">
          
          {/* On utilise baseItems pour garder la structure de chargement */}
          {baseItems.map((baseItem, i) => {
            // On cherche si l'item a été trouvé et chargé
            const loadedItem = validItems.find(v => v.id === baseItem.id);
            
            // Logique d'affichage selon filtre
            const shouldDisplay = loadedItem && (filter === 'all' || loadedItem.type === filter);

            return (
              <MediaItem
                key={baseItem.id}
                baseId={baseItem.id}
                title={baseItem.title}
                index={i}
                onMediaFound={handleMediaFound}
                isVisible={!!shouldDisplay} 
                onClick={() => {
                  if (loadedItem) {
                    // Trouver l'index dans la liste filtrée pour la lightbox
                    const idx = displayedItems.findIndex(d => d.id === loadedItem.id);
                    if (idx !== -1) setLightboxIndex(idx);
                  }
                }}
              />
            );
          })}
        </div>

        {/* Loader si vide */}
        {validItems.length === 0 && (
          <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-200 border-b-pink-500 mb-4"></div>
            <p className="text-sm uppercase tracking-widest">Synchronisation...</p>
          </div>
        )}
      </main>

      {/* --- LIGHTBOX --- */}
      {currentItem && (
        <Lightbox
          item={currentItem}
          onClose={() => setLightboxIndex(null)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};


export default Gallery;