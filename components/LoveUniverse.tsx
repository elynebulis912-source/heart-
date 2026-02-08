
import React, { useEffect, useRef, useState } from 'react';
import { loadAnimatedGifToCanvas } from './GifAnimator';
import { ThemeProps } from '../types';
import * as THREE from 'three';

// ═══ INTERFACES ═══
interface HeartData {
  rotSpeed: number;
  orbitSpeed: number;
  radius: number;
  theta: number;
  phi: number;
}

interface TextSpriteData {
  floatSpeed: number;
  rotationSpeed: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitTheta: number;
  orbitPhi: number;
}

interface GifSpriteData {
  orbitSpeed: number;
  orbitRadius: number;
  orbitTheta: number;
  orbitPhi: number;
  floatSpeed: number;
}

interface PlanetData {
  name: string;
  message: string;
  distance: number;
  angle: number;
  speed: number;
  planet: THREE.Mesh;
  glow: THREE.Mesh;
  ring: THREE.Group;
}

const LoveUniverse: React.FC<ThemeProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0, 1500); // BEAUCOUP plus loin pour voir tout l'univers
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Fond noir-rouge
    scene.background = new THREE.Color(0x0a0000);
    scene.fog = new THREE.FogExp2(0x1a0505, 0.0008);

    // ═══ CŒURS (50K optimisé) ═══
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.5, -0.3, -0.5, 0);
    heartShape.bezierCurveTo(-0.5, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.5, 0.3, 0.5, 0);
    heartShape.bezierCurveTo(0.5, -0.3, 0, -0.3, 0, 0);

    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    const instancedHearts = new THREE.InstancedMesh(
      heartGeometry,
      new THREE.MeshBasicMaterial({ 
        color: 0xff0044,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      }),
      25000
    );

    const dummy = new THREE.Object3D();
    const heartData: HeartData[] = [];

    for (let i = 0; i < 25000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 300 + Math.random() * 1200;
      
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      dummy.rotation.z = Math.random() * Math.PI * 2;
      const scale = Math.random() * 2 + 1;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      
      instancedHearts.setMatrixAt(i, dummy.matrix);
      
      const color = new THREE.Color();
      const rand = Math.random();
      if (rand > 0.7) color.setHex(0xff1744);
      else if (rand > 0.4) color.setHex(0xff4081);
      else if (rand > 0.2) color.setHex(0xffffff);
      else color.setHex(0xff0066);
      
      instancedHearts.setColorAt(i, color);
      
      heartData.push({
        rotSpeed: (Math.random() - 0.5) * 0.01,
        orbitSpeed: (Math.random() - 0.5) * 0.0002,
        radius,
        theta,
        phi
      });
    }

    scene.add(instancedHearts);

    // ═══ ÉTOILES ═══
    const starsGeo = new THREE.BufferGeometry();
    const starVerts = [];
    const starCols = [];
    
    for (let i = 0; i < 10000; i++) {
      starVerts.push(
        (Math.random() - 0.5) * 3000,
        (Math.random() - 0.5) * 3000,
        (Math.random() - 0.5) * 3000
      );
      
      const c = new THREE.Color(Math.random() > 0.5 ? 0xffffff : 0xffccdd);
      starCols.push(c.r, c.g, c.b);
    }
    
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
    starsGeo.setAttribute('color', new THREE.Float32BufferAttribute(starCols, 3));
    
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    }));
    scene.add(stars);

    // ═══ PLANÈTES ═══
    const createPlanet = (size: number, color: number, distance: number, name: string, message: string): THREE.Group => {
      const group = new THREE.Group();
      
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 64, 64),
        new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.5,
          shininess: 100
        })
      );
      group.add(planet);
      
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.2, 32, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        })
      );
      group.add(glow);
      
      const ring = new THREE.Group();
      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
        );
        p.position.set(
          Math.cos(angle) * size * 1.5,
          0,
          Math.sin(angle) * size * 1.5
        );
        ring.add(p);
      }
      group.add(ring);
      
      (group.userData as PlanetData) = { name, message, distance, angle: Math.random() * Math.PI * 2, speed: 0.0003, planet, glow, ring };
      return group;
    };

    const planets = [
      createPlanet(20, 0xff0033, 200, 'Amour','Je t\'aime' ),
      createPlanet(24, 0xff1744, 300, 'Sagesse','Tu es ma paix' ),
      createPlanet(18, 0xff4081, 400, 'Tendresse','Plus doux qu\'un sucre'),
      createPlanet(22, 0xff69b4, 500, 'Envie' ,'J\'ai envie de toi'),
      createPlanet(21, 0xffb6c1, 600, 'Désir','Tu es mon fantasme le plus intime' )
    ];

    planets.forEach(p => scene.add(p));

    // ═══ LUMIÈRES ═══
    scene.add(new THREE.AmbientLight(0xff0033, 0.4));
    
    const light1 = new THREE.PointLight(0xff1744, 2, 1000);
    light1.position.set(100, 100, 100);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xff69b4, 1.5, 1000);
    light2.position.set(-100, -100, -100);
    scene.add(light2);

    // ═══ MESSAGES ═══
    const messages = [
      // Français
      "Je t'aime", "Mon cœur t'appartient", "Tu es mon univers", "À jamais toi",
      "Mon éternité", "Tu es ma vie", "Amour infini", "Mon âme sœur",
      "Pour toujours", "Mon trésor", "Ma raison d'être", "Mon souffle",
      "Tu es mon éternité", "Mon cœur bat pour toi", "Toi et moi, c'est pour toujours",
      "Je t'aime infiniment", "Mon amour n'a pas de limites", "Tu es ma raison de sourire",
      "Avec toi, tout est possible", "Tu es l'amour de ma vie", "Tu me rends heureuse",
      "Je t'aime profondément", "Tu es mon bonheur", "Mon âme t'appelle",
      "Tu es tout ce que je veux", "Je t'aimerai toujours", "Tu fais battre mon cœur",
      "Avec toi, je suis chez moi", "Tu es ma raison d'être", "Mon daddy d'amour",
      "Tu es mon paradis","Ma safe place","Mon Alter Ego",
      // Wolof
      "Dama la beugue", "Sama khol", "Dama la nopp", "Yaw rekk","Hubert Ilunga Kyungu je t'aime",
      // Anglais
      "I love you", "Forever yours", "My heart", "Endless love",
      "You're my world", "Soulmate", "My everything", "Always",
      "My Sunshine", "My Heart Beats for You", "My One and Only",
      "You Complete Me", "You Are My Everything", "Together, Always",
      "You Light Up My Life", "My Soulmate", "I Cherish You", "You Are Loved",
      "My Heart Is Yours", "You Make Me Whole", "Eternally Yours", "My Destiny","My master",
      // Espagnol
      "Te amo", "Mi amor", "Mi vida", "Para siempre", "Eres mi todo",
      // Italien
      "Ti amo", "Amore mio", "Per sempre", "Cuore mio", "Sei la mia vita",
      // Arabe
      "أحبك", "حبيبي", "روحي", "عمري", "أنت كل شيء",
      // Japonais
      "愛してる", "大好き", "永遠に", "運命", "あなたは私のすべて",
      // Coréen
      "사랑해", "내 전부", "영원히", "소울메이트", "당신은 나의 모든 것",
      // Portugais
      "Te amo", "Meu amor", "Minha vida", "Eternamente", "Você é tudo",
      // Allemand
      "Ich liebe dich", "Mein Herz", "Für immer", "Seelenverwandt", "Du bist alles",
      // Russe
      "Я люблю тебя", "Моя любовь", "Навсегда", "Душа моя", "Ты всё для меня",
      //Japonais
      "Aishiteru", "Daisuki", "Eien ni", "Unmei", "Anata wa watashi no subete","sempai",
      //turque
      "Seni seviyorum", "Aşkım", "Hayatım", "Sonsuza dek", "Sen benim her şeyimsin",
     
    ];

    const createText = (text: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      canvas.width = 512;
      canvas.height = 128;
      
      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
      
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ 
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        opacity: 0.9
      }));
      sprite.scale.set(100, 25, 1);
      return sprite;
    };

    const textSprites: THREE.Sprite[] = [];
    for (let i = 0; i < 500; i++) { // 500 textes
      const sprite = createText(messages[Math.floor(Math.random() * messages.length)]);
      if (!sprite) continue;
      
      // Distribution sphérique COMPLÈTE dans tout l'univers
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 400 + Math.random() * 1000;
      
      sprite.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      sprite.userData = { 
        floatSpeed: (Math.random() - 0.5) * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        orbitSpeed: (Math.random() - 0.5) * 0.0005, // Plus rapide
        orbitRadius: radius,
        orbitTheta: theta,
        orbitPhi: phi
      } as TextSpriteData;
      
      scene.add(sprite);
      textSprites.push(sprite);
    }

    // ═══ GIF/VIDEO SPRITES DYNAMIQUES INTÉGRÉS DANS L'UNIVERS 3D ═══
    const gifSprites: THREE.Sprite[] = [];
    const textureLoader = new THREE.TextureLoader();
    const animatedGifData: Array<{ texture?: any; img: HTMLImageElement | null; canvas: HTMLCanvasElement; sprite: THREE.Sprite; gifUpdate?: () => void }> = [];

    // Charge la liste de médias depuis public/Images/index.json
    fetch('/Images/index.json')
      .then(res => res.json())
      .then((items: Array<{name:string; url:string; type?:string}>) => {
        // Filtre les vidéos et GIFs
        const medias = items.filter(it => {
          const u = (it.url || '').toLowerCase();
          return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.gif') || (it.type && it.type === 'video');
        });

        medias.forEach((m, index) => {
          const url = m.url;
          const isVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');

          const specialNumbers = [1,2,3,4,5,6,7,12];
          const isSpecialUrl = (u: string) => {
            if(!u) return false;
            const low = u.toLowerCase();
            for (const n of specialNumbers) {
              if (low.includes(`gif${n}`) || low.endsWith(`/${n}.gif`) || low.includes(`/${n}.mp4`) || low.includes(`/images/${n}.mp4`)) return true;
            }
            return false;
          };

          const createSpriteFromTexture = (texture: THREE.Texture, sourceUrl?: string) => {
            // ensure correct encoding if available
            try { (texture as any).colorSpace = (THREE as any).SRGBColorSpace || 'srgb'; } catch(e) {}
            const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
            const sprite = new THREE.Sprite(mat);
            const size = 30 + Math.random() * 90; // taille variable
            sprite.scale.set(size, size, 1);

            // Defaults
            let theta = Math.random() * Math.PI * 2;
            let phi = Math.acos(2 * Math.random() - 1);
            let radius = 200 + Math.random() * 1200;

            // If this sprite is in the special list, make it orbit with messages/planets (similar parameters)
            if (sourceUrl && isSpecialUrl(sourceUrl)) {
              // Use a radius and orbitSpeed similar to textSprites
              radius = 400 + Math.random() * 1000;
              theta = Math.random() * Math.PI * 2;
              phi = Math.acos(2 * Math.random() - 1);
            }

            sprite.position.set(
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              radius * Math.cos(phi)
            );

            sprite.userData = {
              source: sourceUrl || '',
              orbitSpeed: sourceUrl && isSpecialUrl(sourceUrl) ? (Math.random() - 0.5) * 0.0005 : (Math.random() - 0.5) * 0.0003,
              orbitRadius: radius,
              orbitTheta: theta,
              orbitPhi: phi,
              floatSpeed: (Math.random() - 0.5) * 0.12
            } as GifSpriteData & { source?: string };

            scene.add(sprite);
            gifSprites.push(sprite);
          };

          if (isVideo) {
            const video = document.createElement('video');
            video.src = url;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.crossOrigin = 'anonymous';
            video.autoplay = true;
            // Try to play; browsers may block autoplay if not muted
            video.play().catch(() => {});

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBAFormat;
            createSpriteFromTexture(videoTexture, url);
          } else {
            // If it's a GIF we want to animate it: prefer a matching mp4 in /Images (e.g. gif1.gif -> /Images/1.mp4)
            if (url.toLowerCase().endsWith('.gif')) {
              const tryVideoCandidate = (gifUrl: string, onFail: () => void) => {
                const m = gifUrl.match(/(\d+)/);
                if (!m) { onFail(); return; }
                const candidate = `/Images/${m[1]}.mp4`;
                const video = document.createElement('video');
                video.src = candidate;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.crossOrigin = 'anonymous';
                video.autoplay = true;
                let handled = false;
                const onCan = () => {
                  if (handled) return; handled = true;
                  const vtex = new THREE.VideoTexture(video);
                  vtex.minFilter = THREE.LinearFilter;
                  vtex.magFilter = THREE.LinearFilter;
                  vtex.format = THREE.RGBAFormat;
                  createSpriteFromTexture(vtex, candidate);
                };
                const onErr = () => {
                  if (handled) return; handled = true; onFail();
                };
                video.addEventListener('canplaythrough', onCan, { once: true });
                video.addEventListener('error', onErr, { once: true });
                // Try to play; ignore rejection
                video.play().catch(() => {});
                // Safety timeout: if nothing after 1500ms, fallback
                setTimeout(() => { if (!handled) { handled = true; onFail(); } }, 1500);
              };

              const fallbackImage = async () => {
                try {
                  const { canvas, update } = await loadAnimatedGifToCanvas(url);
                  const tex = new THREE.CanvasTexture(canvas);
                  tex.minFilter = THREE.LinearFilter;
                  tex.magFilter = THREE.LinearFilter;
                  tex.format = THREE.RGBAFormat;
                  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
                  const sprite = new THREE.Sprite(mat);
                  const size = 30 + Math.random() * 90;
                  sprite.scale.set(size, size, 1);

                  const theta = Math.random() * Math.PI * 2;
                  const phi = Math.acos(2 * Math.random() - 1);
                  const radius = 200 + Math.random() * 1200;
                  sprite.position.set(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                  );

                  sprite.userData = {
                    orbitSpeed: (Math.random() - 0.5) * 0.0003,
                    orbitRadius: radius,
                    orbitTheta: theta,
                    orbitPhi: phi,
                    floatSpeed: (Math.random() - 0.5) * 0.12,
                    source: url,
                    gifUpdate: update,
                    gifTexture: tex
                  } as GifSpriteData & { source?: string, gifUpdate: () => void, gifTexture: THREE.CanvasTexture };

                  scene.add(sprite);
                  gifSprites.push(sprite);
                  animatedGifData.push({ texture: tex as THREE.CanvasTexture, img: null, canvas, sprite, gifUpdate: update });
                } catch (e) {
                  // fallback image static si erreur
                  const img = new Image();
                  img.crossOrigin = 'anonymous';
                  img.src = url;
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width || 256;
                    canvas.height = img.height || 256;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const tex = new THREE.CanvasTexture(canvas);
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    tex.format = THREE.RGBAFormat;
                    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
                    const sprite = new THREE.Sprite(mat);
                    const size = 30 + Math.random() * 90;
                    sprite.scale.set(size, size, 1);
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const radius = 200 + Math.random() * 1200;
                    sprite.position.set(
                      radius * Math.sin(phi) * Math.cos(theta),
                      radius * Math.sin(phi) * Math.sin(theta),
                      radius * Math.cos(phi)
                    );
                    sprite.userData = {
                      orbitSpeed: (Math.random() - 0.5) * 0.0003,
                      orbitRadius: radius,
                      orbitTheta: theta,
                      orbitPhi: phi,
                      floatSpeed: (Math.random() - 0.5) * 0.12,
                      source: url
                    } as GifSpriteData & { source?: string };
                    scene.add(sprite);
                    gifSprites.push(sprite);
                  };
                }
              };

              tryVideoCandidate(url, fallbackImage);
            } else {
              textureLoader.load(url, (texture) => {
                createSpriteFromTexture(texture, url);
              }, undefined, () => {
                // ignore load errors
              });
            }
          }
        });
      })
      .catch(() => {
        // Si index.json absent, fallback minimal
        const fallback = ['/7.gif','/gif1.gif','/gif2.gif','/gif3.gif'];
        fallback.forEach(u => textureLoader.load(u, t => {
          const mat = new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0.9 });
          const sprite = new THREE.Sprite(mat);
          sprite.scale.set(60,60,1);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const radius = 400 + Math.random() * 600;
          sprite.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );
          scene.add(sprite);
          gifSprites.push(sprite);
        }));
      });

    // Charge aussi explicitement les GIFs disponibles à la racine public (gif1..gif7, gif12)
    const rootGifs = ['/gif1.gif','/gif2.gif','/gif3.gif','/gif4.gif','/gif5.gif','/gif6.gif','/gif7.gif','/gif12.gif'];
    rootGifs.forEach((url) => {
      // Vérifier si le fichier existe via tentative de chargement
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 256;
          canvas.height = img.height || 256;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const tex = new THREE.CanvasTexture(canvas);
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.format = THREE.RGBAFormat;

          const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95 });
          const sprite = new THREE.Sprite(mat);
          const size = 30 + Math.random() * 90;
          sprite.scale.set(size, size, 1);

          // Make them orbit like messages/planets
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const radius = 400 + Math.random() * 1000;
          sprite.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );

          sprite.userData = {
            source: url,
            orbitSpeed: (Math.random() - 0.5) * 0.0005,
            orbitRadius: radius,
            orbitTheta: theta,
            orbitPhi: phi,
            floatSpeed: (Math.random() - 0.5) * 0.12
          } as GifSpriteData & { source?: string };

          scene.add(sprite);
          gifSprites.push(sprite);
          // Ajout de gifUpdate si le sprite provient d'un GIF animé
          if (sprite.userData && typeof sprite.userData.gifUpdate === 'function') {
            animatedGifData.push({ texture: tex as THREE.CanvasTexture, img, canvas, sprite, gifUpdate: sprite.userData.gifUpdate });
          } else {
            animatedGifData.push({ texture: tex as THREE.CanvasTexture, img, canvas, sprite });
          }
        } catch (e) {
          // ignore
        }
      };
      img.onerror = () => {
        // fichier absent, ignore
      };
    });

    // ═══ INTERACTION ═══
    let mouseX = 0, mouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const keyPressed: Record<string, boolean> = {};

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.set(mouseX, mouseY);
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets.map(p => (p.userData as PlanetData).planet));
      
      setHoveredPlanet(intersects.length > 0 ? (intersects[0].object.parent?.userData as PlanetData) : null);
    };

    const onClick = (e: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets.map(p => (p.userData as PlanetData).planet));
      
      if (intersects.length > 0) {
        const planetData = intersects[0].object.parent?.userData as PlanetData;
        alert(`${planetData.name}\n\n"${planetData.message}"`);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keyPressed[e.key.toLowerCase()] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keyPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // ═══ ANIMATION ═══
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Cœurs
      heartData.forEach((data, i) => {
        data.theta += data.orbitSpeed;
        dummy.position.set(
          data.radius * Math.sin(data.phi) * Math.cos(data.theta),
          data.radius * Math.sin(data.phi) * Math.sin(data.theta),
          data.radius * Math.cos(data.phi)
        );
        dummy.rotation.z += data.rotSpeed;
        dummy.updateMatrix();
        instancedHearts.setMatrixAt(i, dummy.matrix);
      });
      instancedHearts.instanceMatrix.needsUpdate = true;

      // Planètes
      planets.forEach(p => {
        const pData = p.userData as PlanetData;
        pData.angle += pData.speed;
        p.position.set(
          Math.cos(pData.angle) * pData.distance,
          0,
          Math.sin(pData.angle) * pData.distance
        );
        pData.planet.rotation.y += 0.005;
        pData.glow.rotation.y -= 0.003;
        pData.ring.rotation.y += 0.02;
      });

      // Textes - orbite lente + toujours face caméra
      textSprites.forEach(s => {
        // Rotation orbitale LENTE autour du centre
        const sData = s.userData as TextSpriteData;
        sData.orbitTheta += sData.orbitSpeed;
        
        const x = sData.orbitRadius * Math.sin(sData.orbitPhi) * Math.cos(sData.orbitTheta);
        const y = sData.orbitRadius * Math.sin(sData.orbitPhi) * Math.sin(sData.orbitTheta);
        const z = sData.orbitRadius * Math.cos(sData.orbitPhi);
        
        s.position.set(x, y, z);
        
        // Les sprites font TOUJOURS face à la caméra (billboard) - lisibles !
        // Pas de rotation du sprite lui-même
      });

      // GIF sprites - orbite dans l'univers
      gifSprites.forEach(g => {
        const gData = g.userData as GifSpriteData;
        gData.orbitTheta += gData.orbitSpeed;
        
        const x = gData.orbitRadius * Math.sin(gData.orbitPhi) * Math.cos(gData.orbitTheta);
        const y = gData.orbitRadius * Math.sin(gData.orbitPhi) * Math.sin(gData.orbitTheta);
        const z = gData.orbitRadius * Math.cos(gData.orbitPhi);
        
        g.position.set(x, y, z);
      });

      // Update animated GIF canvas textures so       gi      git remote set-url origin git@github.com:elynebulis912-source/Dearest-love.gity actually animate
      if (animatedGifData.length > 0) {
        // DEBUG: log animatedGifData pour vérifier le contenu
        if (time < 0.1) {
          console.log('animatedGifData:', animatedGifData);
        }
        animatedGifData.forEach(item => {
          if (typeof (item as any).gifUpdate === 'function') {
            // DEBUG: log à chaque appel
            if (time < 0.1) {
              console.log('Appel gifUpdate pour', item);
            }
            (item as any).gifUpdate();
            if (item.texture) {
              item.texture.needsUpdate = true;
            }
          } else if (item.texture) {
            item.texture.needsUpdate = true;
          } else if (item.img && item.canvas) {
            try {
              const ctx = item.canvas.getContext('2d');
              if (!ctx) return;
              ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);
              ctx.drawImage(item.img, 0, 0, item.canvas.width, item.canvas.height);
              if (item.texture) {
                item.texture.needsUpdate = true;
              }
            } catch (e) {
              // ignore
            }
          }
        });
      }

      // Étoiles
      const pos = stars.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(time + i) * 0.1;
      }
      stars.geometry.attributes.position.needsUpdate = true;

      // Caméra
      // Contrôles clavier
      const moveSpeed = 10;
      if (keyPressed['z'] || keyPressed['arrowup']) camera.position.z -= moveSpeed;
      if (keyPressed['s'] || keyPressed['arrowdown']) camera.position.z += moveSpeed;
      if (keyPressed['q'] || keyPressed['arrowleft']) camera.position.x -= moveSpeed;
      if (keyPressed['d'] || keyPressed['arrowright']) camera.position.x += moveSpeed;
      if (keyPressed[' ']) camera.position.y += moveSpeed;
      if (keyPressed['shift']) camera.position.y -= moveSpeed;
      
      // Rotation CONSTANTE automatique de l'univers - RAPIDE
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.008); // 4x plus rapide !
      
      // Mouvement souris léger
      const targetX = mouseX * 50;
      const targetY = mouseY * 50;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div ref={mountRef} className="fixed inset-0 z-0" />
      
      

      {hoveredPlanet && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 animate-fadeIn">
          <div className="bg-gradient-to-r from-red-600/90 to-pink-600/90 backdrop-blur-xl px-8 py-4 rounded-full border-2 border-white/30 shadow-2xl">
            <p className="text-2xl font-bold text-white">{hoveredPlanet.name}</p>
            <p className="text-white/90 text-center italic">"{hoveredPlanet.message}"</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm pointer-events-none text-center">
        
        <p className="text-xs mt-1"></p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default LoveUniverse;
