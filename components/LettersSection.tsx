import React from 'react';
import { LETTERS } from '../constants';
import { ThemeProps } from '../types';

const LettersSection: React.FC<ThemeProps> = () => {
  return (
    <div className="space-y-40 py-20">
      <header className="max-w-3xl space-y-6">
        <span className="text-pink-500 font-black uppercase tracking-[0.8em] text-[10px]">Confidences Scellées</span>
        <h2 className="text-8xl md:text-[11rem] font-elegant text-pink-950 font-black leading-[0.75]">Les <br/>Mots.</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
        {LETTERS.map((letter, i) => (
          <article 
            key={letter.id} 
            className={`relative flex flex-col group ${i % 2 !== 0 ? 'md:mt-40' : ''}`}
          >
            {/* Numérotation luxe en fond */}
            <div className="absolute -top-16 -left-12 text-[180px] font-black text-pink-50 pointer-events-none transition-all duration-700 group-hover:text-pink-100 leading-none">
              {letter.id < 10 ? `0${letter.id}` : letter.id}
            </div>

            <div className="relative z-10 space-y-10">
              <header className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-pink-200"></div>
                <time className="text-pink-400 font-black uppercase tracking-[0.5em] text-[9px]">{letter.date}</time>
              </header>

              <div className="bg-[#fffcf9] px-6 py-10 rounded-[3.5rem] shadow-[0_40px_100px_rgba(255,77,109,0.08)] border border-pink-50/50 relative overflow-hidden transition-all duration-700 hover:shadow-[0_60px_130px_rgba(255,77,109,0.15)]">
                 {/* Sceau de cire numérique */}
                 <div className="absolute top-8 right-8 w-14 h-14 bg-pink-700 rounded-full flex items-center justify-center border-4 border-pink-900 shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform">
                   <span className="text-white font-romantic text-lg">♡</span>
                 </div>
                
                
                <h3 className="text-4xl font-romantic text-pink-700 mb-8">{letter.title}</h3>
                
                <p className="text-3xl font-serif-luxe text-gray-800 italic leading-[1.3]">
                   "{letter.content}"
                 </p>
                 {/* GIF12 sous le texte */}
                 {letter.title === 'Envie' && (
                  <img src="/gif17.gif" alt="gif12" className="mx-auto mt-10 w-72 h-auto block z-30" />
                 )}
                 {/* GIF18 sous le texte de Voleur */}
                 {letter.title === 'Voleur' && (
                  <img src="/gif18.gif" alt="gif18" className="mx-auto mt-2 w-72 h-auto block z-30" />
                 )}
                 {/* Image bague sous le texte de Alliance */}
                {letter.title === 'Alliance' && (
                  <img src="/bague.jfif" alt="bague" className="mx-auto mt-10 w-[60rem] h-32 object-contain block z-30" />
                )}
                {/* Image img5 sous le texte de Master */}
                {letter.title === 'Master' && (
                  <img src="/img5.jfif" alt="img5" className="absolute right-40 top-40 w-64 h-auto z-30" />
                )}
                {/* Image img6 en mini à droite sous Désir */}
                {letter.title === 'Désir' && (
                  <img src="/img6.jfif" alt="img6" className="absolute right-20 top-60 w-24 h-24 z-30" />
                )}
                 {/* GIF8 en mini à droite sous Fact */}
                 {letter.title === 'Fact' && (
                    <img src="/gif8.gif" alt="gif8" className="absolute bottom-20 right-12 w-20 h-20 z-40" />
                )}
                 {/* GIF20 sous le texte de Dingue de toi */}
                {letter.title === 'Dingue de toi' && (
                  <img src="/gif20.gif" alt="gif20" className="mx-auto mt-2 w-48 h-auto block z-30" />
                )}
                 <footer className="mt-16 flex items-center justify-between">
                   {/* GIF15 en bas à droite sur Éternité */}
                   {letter.title === 'Éternité' && (
                    <img src="/gif15.gif" alt="gif15" className="absolute bottom-12 right-48 w-28 h-28 z-40" />
                   )}
                   <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-pink-200"></div>
                     <div className="w-2 h-2 rounded-full bg-pink-100"></div>
                   </div>
                   <span className="font-romantic text-2xl text-pink-300">À jamais, toi.</span>
                 </footer>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-60 text-center flex flex-col items-center gap-10">
         <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
          
            <span className="text-white text-3xl">♡</span>
         </div>
         <h3 className="text-7xl font-romantic text-pink-600">L'éternité nous attend.</h3>
         <p className="text-pink-400 font-serif-luxe text-xl uppercase tracking-[0.4em] italic">I LOVE YOU <p> Aishiteru</p><p>Je t'aime</p><p>Te amo</p><p> Rawr</p>
         </p>
      </div>
    </div>
  );
};

export default LettersSection;
