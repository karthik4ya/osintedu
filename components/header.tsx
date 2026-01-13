import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="mb-12 select-none">
      <div className="flex items-center gap-3">
         <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
         </div>
         <h1 className="text-xl font-bold tracking-[0.2em] text-white">
            OSINT<span className="font-light text-white/40">.EDU</span>
         </h1>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-widest text-white/30 ml-6">
         Interactive Learning Module v2.0
      </p>
    </div>
  );
};