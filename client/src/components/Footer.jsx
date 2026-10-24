import React from 'react';
import { BookOpen, Sparkles, Shield, Heart, ExternalLink } from 'lucide-react';

/**
 * CharacterVerse Footer
 * Library aesthetic footer with security notices, Fish Audio credentials, and BookTok warmth
 */
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-parchment-200 bg-parchment-100/70 text-library-wood pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-library-dark flex items-center justify-center text-gold border border-gold/40">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold text-library-dark">
                Character<span className="text-gold-dark font-serif">Verse</span>
              </span>
            </div>
            <p className="text-xs text-library-taupe max-w-sm leading-relaxed">
              An AI-powered storytelling platform crafted for BookTok readers, novel enthusiasts,
              writers, and audiobook lovers. Powered by Fish Audio next-gen voice intelligence.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl w-fit">
              <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Zero-Exposure Security: Fish Audio API secrets reside exclusively in backend .env</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-serif font-bold text-sm text-library-dark uppercase tracking-wider">
              Experience Modes
            </h4>
            <ul className="text-xs space-y-1.5 text-library-taupe">
              <li>Audiobook Narration</li>
              <li>Dramatic Performance</li>
              <li>Podcast Discussion</li>
              <li>Teacher & Academic Reading</li>
            </ul>
          </div>

          {/* Technology & Community */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-serif font-bold text-sm text-library-dark uppercase tracking-wider">
              Voice Intelligence
            </h4>
            <p className="text-xs text-library-taupe leading-relaxed">
              Utilizing <strong className="text-library-dark">Fish Audio S2.1 Pro</strong> and <strong className="text-library-dark">Fish Audio Drama 3</strong> for rich, expressive vocal cadence without mechanical monotony.
            </p>
            <div className="pt-2">
              <a
                href="https://fish.audio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-dark hover:underline"
              >
                <span>Learn more at Fish Audio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-between text-xs text-library-taupe gap-3">
          <p>© {new Date().getFullYear()} CharacterVerse. "Every Story Deserves a Voice."</p>
          <p className="flex items-center space-x-1">
            <span>Built for book lovers with</span>
            <Heart className="w-3 h-3 text-booktok-rose fill-booktok-rose" />
            <span>and Fish Audio</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
