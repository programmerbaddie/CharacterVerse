import React from 'react';
import { BookOpen, Sparkles, Wand2, Volume2, ShieldCheck, Cpu } from 'lucide-react';

/**
 * CharacterVerse Navigation Header
 * Features brand identity, mode status, and quick page navigation
 */
export default function Navbar({ activePage, setActivePage, isFishAudioLive, hasActiveStory }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-parchment-50/85 border-b border-parchment-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActivePage('landing')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-library-dark via-library-espresso to-library-walnut flex items-center justify-center shadow-md shadow-library-dark/20 border border-gold/40 group-hover:border-gold transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-6 h-6 text-gold transition-transform group-hover:rotate-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-library-dark">
                  Character<span className="text-gold-dark font-serif">Verse</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gold/15 text-library-walnut border border-gold/30">
                  Fish Audio
                </span>
              </div>
              <p className="text-[11px] text-library-taupe tracking-wide font-sans -mt-0.5 hidden sm:block">
                Every Story Deserves a Voice
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActivePage('landing')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activePage === 'landing'
                  ? 'bg-parchment-200 text-library-dark font-semibold shadow-sm'
                  : 'text-library-wood hover:text-library-dark hover:bg-parchment-100'
              }`}
            >
              Discover
            </button>

            <button
              onClick={() => setActivePage('studio')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activePage === 'studio'
                  ? 'bg-parchment-200 text-library-dark font-semibold shadow-sm'
                  : 'text-library-wood hover:text-library-dark hover:bg-parchment-100'
              }`}
            >
              <Wand2 className="w-4 h-4 text-gold-dark" />
              <span>Story Studio</span>
            </button>

            {hasActiveStory && (
              <button
                onClick={() => setActivePage('output')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  activePage === 'output'
                    ? 'bg-gold/20 text-library-dark font-semibold border border-gold/40 shadow-sm'
                    : 'text-library-wood hover:text-library-dark hover:bg-parchment-100'
                }`}
              >
                <Volume2 className="w-4 h-4 text-gold-dark animate-pulse" />
                <span>Now Playing</span>
              </button>
            )}
          </nav>

          {/* Right Action & API Status Badge */}
          <div className="flex items-center space-x-3">
            {/* Fish Audio Status Pill */}
            <div 
              title={isFishAudioLive ? "Connected to official Fish Audio REST API" : "Intelligent simulation preview mode active (Add FISH_AUDIO_API_KEY to activate live API)"}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-parchment-100 border border-parchment-300 text-library-leather cursor-help transition-colors hover:border-gold/50"
            >
              <span className={`w-2 h-2 rounded-full ${isFishAudioLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="hidden sm:inline font-mono text-[11px]">
                {isFishAudioLive ? 'Fish Audio Live' : 'Fish Audio Preview'}
              </span>
            </div>

            {/* Studio CTA Button */}
            <button
              onClick={() => setActivePage('studio')}
              className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl font-medium text-sm text-library-cream bg-gradient-to-r from-library-dark to-library-walnut hover:from-library-espresso hover:to-library-leather shadow-md hover:shadow-library-elevated transition-all duration-200 active:scale-95 border border-gold/30 hover:border-gold"
            >
              <Sparkles className="w-4 h-4 mr-2 text-gold animate-pulse" />
              <span>Start Creating</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
