
import React from 'react';
import { OsintTool } from '../types';

interface OrbitalViewerProps {
  tools: OsintTool[];
  activeIndex: number;
  onSelect: (id: number) => void;
}

const CyberSkull = ({ isActive }: { isActive: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`transition-all duration-500 ${isActive ? 'w-8 h-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'w-5 h-5 opacity-60'}`}
    fill={isActive ? '#22d3ee' : 'none'}
    stroke={isActive ? '#22d3ee' : 'currentColor'}
    strokeWidth={isActive ? '0' : '1.5'}
  >
    <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8919 4.66117 13.6309 5.77614 15.0063L4.92893 20.0858C4.74146 21.2106 5.71329 22.2084 6.83254 21.9845L12 20.951L17.1675 21.9845C18.2867 22.2084 19.2585 21.2106 19.0711 20.0858L18.2239 15.0063C19.3388 13.6309 20 11.8919 20 10C20 5.58172 16.4183 2 12 2ZM9 12C8.44772 12 8 11.5523 8 11C8 10.4477 8.44772 10 9 10C9.55228 10 10 10.4477 10 11C10 11.5523 9.55228 12 9 12ZM15 12C14.4477 12 14 11.5523 14 11C14 10.4477 14.4477 10 15 10C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12Z" />
    <path d="M10 16H14" strokeLinecap="round" strokeWidth={isActive ? '2' : '1.5'} stroke={isActive ? 'rgba(0,0,0,0.5)' : 'currentColor'} />
  </svg>
);

const MoonSkullBackground = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full opacity-20 animate-pulse-slow mix-blend-screen">
     <defs>
        <radialGradient id="skullGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#083344" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
     </defs>
     {/* Abstract cranium profile */}
     <path d="M100,20 C60,20 30,50 30,90 C30,110 35,130 50,145 C55,150 50,165 45,175 C40,185 55,190 70,185 C80,182 90,175 100,175 C110,175 120,182 130,185 C145,190 160,185 155,175 C150,165 145,150 150,145 C165,130 170,110 170,90 C170,50 140,20 100,20 Z" fill="url(#skullGradient)" />
     {/* Eye sockets */}
     <path d="M70,80 Q85,80 85,95 Q85,110 70,110 Q55,110 55,95 Q55,80 70,80 Z" fill="#000" />
     <path d="M130,80 Q145,80 145,95 Q145,110 130,110 Q115,110 115,95 Q115,80 130,80 Z" fill="#000" />
     {/* Nose */}
     <path d="M100,115 L90,135 L110,135 Z" fill="#000" />
  </svg>
);

const BoneHandPointer = () => (
  <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
    <g transform="translate(40, 50) scale(0.8)">
      {/* Radius / Ulna (Forearm Bones) */}
      <path d="M0,80 C40,75 100,85 140,80" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
      <path d="M0,120 C40,115 100,125 130,115" fill="none" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
      
      {/* Wrist (Carpals) - Abstracted cluster */}
      <path d="M140,70 L170,75 L180,95 L150,105 L140,70 Z" fill="#d1d5db" />
      <circle cx="160" cy="90" r="12" fill="#9ca3af" />
      
      {/* Hand (Metacarpals) */}
      <g transform="translate(170, 70)">
         {/* Index Finger Metacarpal */}
         <path d="M10,20 L80,20" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
         
         {/* Index Finger Bones (Phalanges) - Pointing Straight */}
         <g transform="translate(80, 20)">
            <path d="M0,0 L35,0" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
            <circle cx="35" cy="0" r="4" fill="#9ca3af" /> {/* Joint */}
            <path d="M35,0 L60,0" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
            <circle cx="60" cy="0" r="3" fill="#9ca3af" /> {/* Joint */}
            <path d="M60,0 L75,0" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" /> {/* Tip */}
         </g>

         {/* Other fingers (curled under) */}
         <path d="M10,40 Q30,45 40,60" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" />
         <path d="M8,55 Q25,60 35,75" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" />
         <path d="M5,70 Q20,75 28,85" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </g>
  </svg>
);

export const OrbitalViewer: React.FC<OrbitalViewerProps> = ({ tools, activeIndex, onSelect }) => {
  // Radius of the circle
  const radius = 280; 
  // Angle per item
  const theta = 360 / tools.length;
  
  // Rotate the entire ring so the active index is at 0 degrees (Right side)
  const currentRotation = -activeIndex * theta;

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center scale-75 lg:scale-100 transition-transform duration-700">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
             <div className="w-80 h-80 rounded-full bg-cyan-900/10 blur-[60px] animate-pulse"></div>
             
             {/* Large Moon Skull Background */}
             <div className="absolute w-[400px] h-[400px] opacity-30 scale-125">
                <MoonSkullBackground />
             </div>
             
             {/* Central Hand Pointer */}
             <div className="absolute w-[300px] h-[150px] z-20 flex items-center ml-20">
                <BoneHandPointer />
                {/* Laser Sight from Finger Tip */}
                <div className="absolute left-[300px] top-[90px] h-[2px] w-[140px] bg-gradient-to-r from-cyan-400 to-transparent opacity-60 shadow-[0_0_10px_cyan]"></div>
             </div>
        </div>

        {/* Rotating Tech Rings */}
        <div className="absolute w-[560px] h-[560px] rounded-full border border-white/5 border-dashed opacity-30 animate-[spin_120s_linear_infinite]"></div>
        <div className="absolute w-[450px] h-[450px] rounded-full border border-cyan-500/5 animate-[spin_60s_linear_infinite_reverse]"></div>

        {/* Rotating Container */}
        <div 
            className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)"
            style={{ transform: `rotate(${currentRotation}deg)` }}
        >
            {tools.map((tool, index) => {
                const angle = theta * index;
                const radian = (angle * Math.PI) / 180;
                
                const x = radius * Math.cos(radian);
                const y = radius * Math.sin(radian);

                const isActive = index === activeIndex;

                return (
                    <div
                        key={tool.id}
                        onClick={() => onSelect(tool.id)}
                        className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 flex items-center justify-center cursor-pointer group"
                        style={{
                            transform: `translate(${x}px, ${y}px) rotate(${-currentRotation}deg)`, 
                        }}
                    >
                       {/* Connection Line (Target Lock) */}
                       <div className={`
                            absolute right-full top-1/2 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent transition-all duration-300
                            origin-right w-[40px] pointer-events-none
                            ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
                       `}></div>

                       {/* Satellite Skull Node */}
                       <div className="relative flex items-center justify-center text-white/40 group-hover:text-cyan-400 transition-colors">
                           <CyberSkull isActive={isActive} />
                           
                           {/* Tool Name Label */}
                           <div className={`
                                absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] tracking-widest font-mono text-cyan-200
                                bg-black/80 px-2 py-1 border border-cyan-500/30 backdrop-blur-sm shadow-xl
                                transition-all duration-300 pointer-events-none z-50
                                ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                           `}>
                                {tool.name.toUpperCase()}
                           </div>
                       </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
