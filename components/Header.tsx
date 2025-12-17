import React from 'react';
import { ViewState } from '../types';
import { MonitorPlay, Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-nexus-900/90 backdrop-blur-md border-b border-nexus-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange(ViewState.HOME)}>
            <div className="bg-nexus-accent p-1.5 rounded-lg">
              <MonitorPlay className="text-white" size={24} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-wide">
              NEXUS<span className="text-nexus-accent">DEALS</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onViewChange(ViewState.HOME)}
              className={`text-sm font-medium transition-colors hover:text-white ${currentView === ViewState.HOME ? 'text-nexus-accent' : 'text-slate-400'}`}
            >
              Daily Deals
            </button>
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Pre-Builts
            </button>
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Community
            </button>
          </nav>

          {/* CTA / AI Button */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => onViewChange(ViewState.AI_BUILDER)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                currentView === ViewState.AI_BUILDER 
                  ? 'bg-nexus-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                  : 'bg-nexus-800 text-slate-200 border border-nexus-700 hover:border-nexus-accent hover:text-white'
              }`}
            >
              <Sparkles size={16} />
              AI Builder
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-nexus-900 border-b border-nexus-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => { onViewChange(ViewState.HOME); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-nexus-800"
            >
              Deals
            </button>
            <button 
              onClick={() => { onViewChange(ViewState.AI_BUILDER); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-nexus-accent bg-nexus-900/50"
            >
              AI Builder
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;