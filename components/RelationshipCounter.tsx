
import React, { useState, useEffect } from 'react';
import { START_DATE } from '../constants';

const RelationshipCounter: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date().getTime() - START_DATE.getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      <CompactUnit value={timeLeft.days} unit="j" />
      <CompactUnit value={timeLeft.hours} unit="h" />
      <CompactUnit value={timeLeft.mins} unit="m" />
      <CompactUnit value={timeLeft.secs} unit="s" />
    </div>
  );
};

const CompactUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
  <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-xl shadow-sm border border-pink-50 flex items-baseline gap-0.5">
    <span className="text-pink-600 font-black text-lg">{value}</span>
    <span className="text-pink-400 text-[10px] font-bold uppercase">{unit}</span>
  </div>
);

export default RelationshipCounter;
