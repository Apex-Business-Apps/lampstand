import React from "react";

export const SacredFlame: React.FC = () => {
  return (
    <div className="relative flex items-end justify-center w-64 h-64 pointer-events-none mix-blend-screen">
      
      {/* Intense Core Flame (Photorealistic CSS Teardrop) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-24 rounded-[50%_50%_35%_35%_/_60%_60%_40%_40%] animate-pulse z-30"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(255,200,80,1) 0%, rgba(255,140,0,0.9) 30%, rgba(200,50,0,0.6) 70%, rgba(255,0,0,0) 100%)',
          boxShadow: '0 -5px 30px 10px rgba(255,80,0,0.8), inset 0 0 10px 5px rgba(255,200,80,0.8)',
          filter: 'blur(2px)',
          animationDuration: '1.5s'
        }}
      />
      
      {/* Outer Volumetric Corona */}
      <div 
        className="absolute bottom-16 w-24 h-40 rounded-[50%_50%_40%_40%_/_60%_60%_40%_40%] animate-pulse origin-bottom z-20"
        style={{
          background: 'linear-gradient(to top, rgba(255,100,0,0.6) 0%, rgba(200,30,0,0.3) 60%, transparent 100%)',
          filter: 'blur(8px)',
          animationDuration: '2.5s'
        }}
      />

      {/* Massive Ambient Heat Glow */}
      <div 
        className="absolute bottom-0 w-80 h-80 bg-[#ff8800] rounded-full mix-blend-screen blur-[60px] opacity-20 animate-pulse z-10" 
        style={{ animationDuration: '4s' }} 
      />
      
      {/* Central Brightness Hit directly on the wick */}
      <div 
        className="absolute bottom-16 w-6 h-6 bg-white rounded-full blur-[4px] opacity-100 z-40" 
      />
    </div>
  );
};
