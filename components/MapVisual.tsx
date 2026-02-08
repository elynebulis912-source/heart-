import React, { useEffect, useState, useRef } from 'react';
import { ThemeProps } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { START_DATE } from '../constants';

interface HeartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  reset: (width: number, height: number) => void;
  update: (width: number, height: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const MapVisual: React.FC<ThemeProps> = () => {
  const [daysTogether, setDaysTogether] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Calcul jours ensemble
    const startDate = new Date('2025-01-17');
    const today = new Date('2026-02-14');
    const days = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    setDaysTogether(days);

    // Particules en forme de cœur
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createHeartParticle = (): HeartParticle => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      opacity: 0,
      reset(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 15 + 5;
        this.opacity = Math.random() * 0.5 + 0.2;
      },
      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      },
      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = '#d63384';
        context.translate(this.x, this.y);
        context.beginPath();
        context.moveTo(0, this.size / 4);
        context.bezierCurveTo(-this.size / 2, -this.size / 4, -this.size, this.size / 4, 0, this.size);
        context.bezierCurveTo(this.size, this.size / 4, this.size / 2, -this.size / 4, 0, this.size / 4);
        context.fill();
        context.restore();
      }
    });

    const particles: HeartParticle[] = Array.from({ length: 40 }, () => {
      const particle = createHeartParticle();
      particle.reset(canvas.width, canvas.height);
      return particle;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Carte interactive
    const map = L.map(mapRef.current as HTMLElement, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false
    }).setView([27.9, 5.5], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: ''
    }).addTo(map);

    const dakar: [number, number] = [14.7167, -17.4677];
    const istanbul: [number, number] = [41.0082, 28.9784];

    // Animated line
    const line = L.polyline([dakar, istanbul], {
      color: '#d63384',
      weight: 2.5,
      opacity: 0.7,
      dashArray: '12, 12'
    }).addTo(map);

    let offset = 0;
    const dashInterval = setInterval(() => {
      offset += 1;
      line.setStyle({ dashOffset: offset.toString() });
    }, 50);

    // Marqueurs avec photos
    const dakarIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="location-marker">
          <img src="toi.jpg" alt="Toi" 
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%2290%22%3E%3Ccircle cx=%2245%22 cy=%2245%22 r=%2245%22 fill=%22%23ffc9e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22white%22%3ETOI%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="location-label" style="bottom: -40px; left: 50%; transform: translateX(-50%);">Dakar</div>
      `,
      iconSize: [90, 90],
      iconAnchor: [45, 45]
    });

    const istanbulIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="location-marker">
          <img src="/lui.jpg" alt="Lui"
         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2290%22 height=%2290%22%3E%3Ccircle cx=%2245%22 cy=%2245%22 r=%2245%22 fill=%22%23ffc9e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22white%22%3ELUI%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="location-label" style="bottom: -40px; left: 50%; transform: translateX(-50%);">Istanbul</div>
      `,
      iconSize: [90, 90],
      iconAnchor: [45, 45]
    });

    L.marker(dakar, { icon: dakarIcon }).addTo(map);
    L.marker(istanbul, { icon: istanbulIcon }).addTo(map);

    // Avion animé avec traînée de cœurs
    const planeIcon = L.divIcon({
      className: 'plane-marker',
      html: '<span style="font-size: 15px;">✈️</span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const heartIcon = L.divIcon({
      className: 'heart-trail',
      html: '<span style="color: #d63384; font-size: 10px;">♥</span>',
      iconSize: [8, 8],
      iconAnchor: [4, 4]
    });

    const planeMarker = L.marker(dakar, { icon: planeIcon }).addTo(map);

    const trail: L.Marker[] = [];
    let frameCount = 0;
    let planeT = 0;

    const animatePlane = () => {
      planeT += 0.002;
      if (planeT > 1) {
        planeT = 0;
        trail.forEach(marker => map.removeLayer(marker));
        trail.length = 0;
      }
      const lat = dakar[0] + (istanbul[0] - dakar[0]) * planeT;
      const lng = dakar[1] + (istanbul[1] - dakar[1]) * planeT;
      planeMarker.setLatLng([lat, lng]);

      frameCount++;
      if (frameCount % 2 === 0) {
        const heartMarker = L.marker([lat, lng], { icon: heartIcon }).addTo(map);
        trail.push(heartMarker);
        setTimeout(() => {
          map.removeLayer(heartMarker);
          const index = trail.indexOf(heartMarker);
          if (index > -1) trail.splice(index, 1);
        }, 500);
      }

      requestAnimationFrame(animatePlane);
    };
    animatePlane();

    map.fitBounds([dakar, istanbul], { padding: [80, 80] });

    // Cleanup function
    return () => {
      clearInterval(dashInterval);
      window.removeEventListener('resize', handleResize);
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full ml-4 bg-[#fdf2f4] rounded-[3rem] shadow-[0_30px_80px_rgba(255,182,193,0.3)] border border-white group overflow-visible">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>

      {/* Top Header Pill - toujours visible */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999]">
        <div className="bg-white/95 backdrop-blur-xl px-8 py-3 rounded-full shadow-lg border border-pink-100 flex items-center gap-2 whitespace-nowrap">
          <span className="text-pink-600 font-bold text-sm">Dakar, Sénégal</span>
          <span className="text-pink-300">↔</span>
          <span className="text-pink-600 font-bold text-sm">Istanbul, Turquie</span>
          <span className="text-pink-400 font-black px-2">•</span>
          <span className="text-pink-500 font-black text-sm">4 990 km</span>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div ref={mapRef} className="w-full h-[550px] rounded-[3rem] relative z-10"></div>

      {/* Bottom Statistics Pills - toujours visibles */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-1 z-[9999] flex justify-center items-center gap-2">
        <div className="bg-white/95 backdrop-blur-2xl px-5 py-2 rounded-[2rem] shadow-xl border border-pink-50 min-w-[100px] flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl">
          <span className="text-2xl font-black tracking-tighter text-pink-600">
            {daysTogether}
          </span>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 group-hover:text-pink-300 transition-colors">
            JOURS ENSEMBLE
          </span>
        </div>
        <div className="bg-white/95 backdrop-blur-2xl px-5 py-2 rounded-[2rem] shadow-xl border border-pink-50 min-w-[100px] flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl">
          <span className="text-2xl font-black tracking-tighter text-pink-500">
            4 990
          </span>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 group-hover:text-pink-300 transition-colors">
            KILOMÈTRES
          </span>
        </div>
        <div className="bg-white/95 backdrop-blur-2xl px-5 py-2 rounded-[2rem] shadow-xl border border-pink-50 min-w-[100px] flex flex-col items-center justify-center group transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl">
          <span className="text-3xl font-black tracking-tighter text-pink-400">
            ∞
          </span>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 group-hover:text-pink-300 transition-colors">
            Forever Yours
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapVisual;