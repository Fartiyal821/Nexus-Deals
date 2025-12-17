import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Zap, Scan, Search } from 'lucide-react';

interface HeroProps {
  onStartBuilding: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartBuilding }) => {
  return (
    <div className="relative overflow-hidden bg-nexus-900 border-b border-nexus-800">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-nexus-accent/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nexus-800/80 backdrop-blur-md border border-nexus-700 text-nexus-accent text-xs font-bold mb-6 shadow-lg animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              LIVE DEAL TRACKER ACTIVE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Dominate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-accent to-indigo-400 animate-glow">
                The Market.
              </span>
            </h1>
            
            <p className="max-w-xl text-lg text-slate-400 mb-8 leading-relaxed">
              Our AI scans Amazon, Flipkart, and Newegg every 30 seconds. Stop overpaying for your battlestation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onStartBuilding}
                className="w-full sm:w-auto px-8 py-4 bg-nexus-accent hover:bg-nexus-accentHover text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2 group border border-white/10"
              >
                <Zap size={18} fill="currentColor" />
                Start AI Builder
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-nexus-800/50 hover:bg-nexus-700/50 text-white font-semibold rounded-xl border border-nexus-700 hover:border-nexus-accent/50 transition-colors backdrop-blur-sm">
                View Today's Drops
              </button>
            </div>
          </div>

          {/* Graphic / Scanner Visual */}
          <div className="flex-1 w-full max-w-lg relative hidden md:block">
             <div className="relative bg-nexus-800/30 backdrop-blur-xl border border-nexus-700/50 rounded-2xl p-6 shadow-2xl">
                {/* Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-accent to-transparent opacity-50 shadow-[0_0_15px_#8b5cf6] animate-[scan_3s_ease-in-out_infinite]"></div>
                
                {/* Mock UI Elements */}
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-auto text-xs font-mono text-nexus-accent animate-pulse">SCANNING_RETAILERS...</div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-emerald-400">
                    <span>> Found: RTX 4090</span>
                    <span>-15% OFF</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>> Scanning Newegg...</span>
                    <span>200ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>> Scanning Amazon...</span>
                    <span>140ms</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>> Analyzing Price History...</span>
                    <span>Done</span>
                  </div>
                   <div className="flex justify-between text-slate-500">
                    <span>> Checking Stock...</span>
                    <span>In Stock</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -right-6 -bottom-6 bg-nexus-900 border border-nexus-700 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                   <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                      <Search size={20} />
                   </div>
                   <div>
                      <div className="text-xs text-slate-400">Deals Found</div>
                      <div className="text-lg font-bold text-white">1,240</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;