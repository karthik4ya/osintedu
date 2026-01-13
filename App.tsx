import React, { useState } from 'react';
import { Header } from './components/Header';
import { OrbitalViewer } from './components/OrbitalViewer';
import { ToolCard } from './components/ToolCard';
import { OSINT_TOOLS } from './constants';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<number>(OSINT_TOOLS[0].id);

  // Find the index for the orbital viewer rotation
  const activeIndex = OSINT_TOOLS.findIndex(t => t.id === activeToolId);
  const activeTool = OSINT_TOOLS[activeIndex];

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % OSINT_TOOLS.length;
    setActiveToolId(OSINT_TOOLS[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + OSINT_TOOLS.length) % OSINT_TOOLS.length;
    setActiveToolId(OSINT_TOOLS[prevIndex].id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Background Ambience - Cyber Tones */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/10 rounded-full blur-[120px] opacity-30"></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        
        {/* LEFT COLUMN: Orbital Navigation */}
        <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col p-6 lg:p-12 relative border-b lg:border-b-0 lg:border-r border-cyan-900/10 bg-black/20 backdrop-blur-sm z-20">
          <Header />
          
          <div className="flex-1 flex items-center justify-center relative">
            <OrbitalViewer 
              tools={OSINT_TOOLS} 
              activeIndex={activeIndex} 
              onSelect={(id) => setActiveToolId(id)} 
            />
          </div>
          
          <div className="hidden lg:block absolute bottom-12 left-12 text-xs text-cyan-500/40 font-mono">
             <div className="flex gap-4 items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>SYSTEM_STATUS: ONLINE</span>
                <span>NODES: {OSINT_TOOLS.length}</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Tool Display */}
        <div className="lg:w-1/2 h-1/2 lg:h-full relative overflow-y-auto bg-transparent">
          
          {/* Scrollable Content Wrapper */}
          <div className="min-h-full flex flex-col justify-center p-6 lg:p-24 relative">
            
            {/* Navigation Controls (Mobile/Desktop) */}
            <div className="absolute top-6 right-6 lg:top-12 lg:right-12 flex gap-2 z-30">
               <button onClick={handlePrev} className="p-3 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <button onClick={handleNext} className="p-3 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
            </div>

            {/* Single Active Card Content */}
            <ToolCard 
              key={activeTool.id} 
              tool={activeTool} 
              isActive={true} 
            />

            {/* Indicator */}
            <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-24 flex gap-2 mt-8">
               {OSINT_TOOLS.map((_, idx) => (
                  <div 
                     key={idx}
                     className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'w-2 bg-white/10'}`}
                  />
               ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default App;