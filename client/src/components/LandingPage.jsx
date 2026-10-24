import React, { useRef } from 'react';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Sparkles, 
  Headphones, 
  Radio, 
  GraduationCap, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Music, 
  Volume2, 
  Layers,
  Scroll
} from 'lucide-react';

/**
 * Landing Page Component
 * Warm library & BookTok aesthetic with quick story uploads and feature showcase
 */
export default function LandingPage({ 
  onStartCreating, 
  onFileUpload, 
  onSelectSampleStory, 
  sampleStories = [] 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle warm library glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-gold/15 via-parchment-300/30 to-booktok-rose/10 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* BookTok & Community Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-parchment-200/80 border border-gold/30 text-library-walnut text-xs font-medium mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-gold animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>AI Storytelling Crafted for BookTok & Novel Lovers</span>
          </div>

          {/* Primary Tagline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-library-espresso tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Every Story Deserves <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-library-dark via-gold-dark to-booktok-wine">
              a Voice.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-library-taupe max-w-2xl mx-auto font-sans leading-relaxed">
            Transform your favorite chapters, manuscripts, PDFs, and fanfiction into 
            immersive audio experiences. Powered by <strong className="text-library-dark font-semibold">Fish Audio's</strong> expressive next-generation voice intelligence.
          </p>

          {/* Hidden File Input for Direct Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md"
            className="hidden"
          />

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            
            {/* Start Creating CTA */}
            <button
              onClick={() => onStartCreating('paste')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-library-dark to-library-walnut text-library-cream font-medium text-base shadow-lg shadow-library-dark/25 hover:shadow-xl hover:shadow-library-dark/35 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-gold/40 flex items-center space-x-3 group"
            >
              <Sparkles className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4 text-parchment-200 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Upload PDF */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-4 rounded-2xl bg-white/90 hover:bg-white text-library-dark font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-parchment-300 hover:border-gold flex items-center space-x-2.5"
            >
              <Upload className="w-5 h-5 text-gold-dark" />
              <span>Upload PDF</span>
            </button>

            {/* Paste Text */}
            <button
              onClick={() => onStartCreating('paste')}
              className="px-6 py-4 rounded-2xl bg-parchment-100 hover:bg-parchment-200 text-library-leather font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-parchment-300 flex items-center space-x-2.5"
            >
              <FileText className="w-5 h-5 text-library-wood" />
              <span>Paste Text</span>
            </button>

          </div>

          <div className="mt-4 text-xs text-library-taupe flex items-center justify-center space-x-4">
            <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> PDF, TXT, & Markdown</span>
            <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Fish Audio S2.1 & Drama 3</span>
            <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" /> No Robotic Monotones</span>
          </div>

          {/* ====================================================================
              HERO ILLUSTRATION / VISUAL SHOWCASE
              ==================================================================== */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-parchment-200/80 to-parchment-100/50 border border-gold/30 shadow-2xl shadow-library-dark/10 backdrop-blur-xl">
              
              {/* Cozy Library Audio Mockup Showcase */}
              <div className="rounded-2xl bg-library-dark text-parchment-100 p-6 sm:p-10 relative overflow-hidden text-left border border-gold/20">
                
                {/* Decorative background glow & shelf lines */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-10 bottom-0 w-72 h-72 bg-booktok-wine/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Story Book Art */}
                  <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-4">
                    <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl bg-gradient-to-br from-library-espresso via-library-walnut to-booktok-wine p-6 flex flex-col justify-between shadow-2xl border border-gold/30 relative group">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gold/20 text-gold-light border border-gold/30">
                          BookTok Spotlight
                        </span>
                        <Flame className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-widest text-parchment-300">Dramatic Narration</p>
                        <h3 className="font-serif text-2xl font-bold text-parchment-50 leading-tight mt-1">
                          The Whispering Archives of Oakhaven
                        </h3>
                        <p className="text-xs text-parchment-300 mt-1 italic">By Seraphina Vance</p>
                      </div>
                      <div className="pt-3 border-t border-parchment-400/20 flex items-center justify-between text-xs text-gold-light">
                        <span>Voice: Julian (Dark Romance)</span>
                        <Volume2 className="w-4 h-4 animate-pulse text-gold" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Audio Waves & Story Quote */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center space-x-2 text-xs font-medium text-gold-light bg-gold/10 px-3 py-1 rounded-lg border border-gold/20">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span>Fish Audio Drama 3 Engine Active</span>
                    </div>

                    <blockquote className="font-serif text-xl sm:text-2xl text-parchment-50 italic leading-relaxed">
                      "You should not have returned to the forbidden alcove, Aurelia. Some secrets were buried beneath these marble floors for good reason."
                    </blockquote>

                    {/* Animated Waveform Visualizer Preview */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-parchment-300">
                        <span>Atmospheric Narration — 0:34</span>
                        <span className="font-mono text-gold-light">Dramatic Micro-Pauses Enabled</span>
                      </div>
                      <div className="h-10 flex items-center gap-1.5 px-3 py-2 bg-library-espresso/80 rounded-xl border border-gold/20">
                        {[40, 65, 30, 85, 95, 45, 70, 90, 60, 35, 75, 100, 80, 50, 70, 90, 45, 60, 85, 65, 40, 90, 75, 55, 80].map((h, i) => (
                          <span
                            key={i}
                            className="flex-1 bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-full transition-all duration-300"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quick Trigger Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectSampleStory(sampleStories[0])}
                        className="inline-flex items-center space-x-2 text-sm text-gold-light hover:text-white font-medium hover:underline group"
                      >
                        <span>Listen to this sample & load in Story Studio</span>
                        <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          FEATURE CARDS SECTION
          • Audiobooks
          • Dramatic Narration
          • Podcast Mode
          • Story Experience
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-library-dark">
            Tailored Storytelling, Not Generic Speech
          </h2>
          <p className="mt-3 text-library-taupe text-base sm:text-lg">
            Every genre demands a unique soul. Choose from tailored listening modalities engineered specifically for books, poetry, and scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Audiobooks */}
          <div className="group rounded-3xl p-7 bg-white/80 hover:bg-white border border-parchment-200 hover:border-gold/60 shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-gold-dark" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                Cinematic Novel Cadence
              </span>
              <h3 className="font-serif text-2xl font-bold text-library-dark mt-1 mb-3">
                Audiobooks
              </h3>
              <p className="text-sm text-library-wood leading-relaxed">
                Smooth, balanced studio cadence optimized for chapters and long novels. Enjoy effortless immersion without vocal fatigue.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs text-library-taupe">
              <span>Model: Fish Audio S2.1</span>
              <Headphones className="w-4 h-4 text-gold-dark" />
            </div>
          </div>

          {/* Card 2: Dramatic Narration */}
          <div className="group rounded-3xl p-7 bg-gradient-to-b from-white to-parchment-100/60 hover:to-white border border-parchment-200 hover:border-booktok-rose/60 shadow-sm hover:shadow-xl hover:shadow-booktok-rose/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-booktok-rose" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-booktok-rose">
                BookTok Favorite
              </span>
              <h3 className="font-serif text-2xl font-bold text-library-dark mt-1 mb-3">
                Dramatic Narration
              </h3>
              <p className="text-sm text-library-wood leading-relaxed">
                Tension, romantic sighs, villainous drops, and theatrical pauses. Brings character dialogue to life with genuine emotional gravity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs text-library-taupe">
              <span>Model: Fish Audio Drama 3</span>
              <Flame className="w-4 h-4 text-booktok-rose" />
            </div>
          </div>

          {/* Card 3: Podcast Mode */}
          <div className="group rounded-3xl p-7 bg-white/80 hover:bg-white border border-parchment-200 hover:border-amber-400/60 shadow-sm hover:shadow-xl hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center text-amber-800 mb-6 group-hover:scale-110 transition-transform">
                <Radio className="w-7 h-7 text-amber-600" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Lively Dialogue & Debriefs
              </span>
              <h3 className="font-serif text-2xl font-bold text-library-dark mt-1 mb-3">
                Podcast Mode
              </h3>
              <p className="text-sm text-library-wood leading-relaxed">
                Conversational banter and analytical reviews. Great for breaking down plot twists, discussing fan theories, and book club debriefs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs text-library-taupe">
              <span>Dual-Host Cadence</span>
              <Radio className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          {/* Card 4: Story Experience */}
          <div className="group rounded-3xl p-7 bg-white/80 hover:bg-white border border-parchment-200 hover:border-gold/60 shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-parchment-200/70 border border-parchment-300 flex items-center justify-center text-library-dark mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-library-walnut" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-library-wood">
                Complete Immersion
              </span>
              <h3 className="font-serif text-2xl font-bold text-library-dark mt-1 mb-3">
                Story Experience
              </h3>
              <p className="text-sm text-library-wood leading-relaxed">
                Synchronized karaoke-style transcript highlighting, waveform audio visualizer, download capability, and variable speed control.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center justify-between text-xs text-library-taupe">
              <span>Interactive Transcript</span>
              <Scroll className="w-4 h-4 text-library-taupe" />
            </div>
          </div>

        </div>
      </section>

      {/* ====================================================================
          TARGET AUDIENCE SHOWCASE
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-library-dark text-parchment-100 p-8 sm:p-14 border border-gold/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Designed For Story Lovers Everywhere
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-parchment-50 mt-2">
              Who is CharacterVerse built for?
            </h2>
            <p className="text-parchment-300 text-base sm:text-lg mt-3">
              Crafted specifically for the vibrant literary internet and anyone who wants words to breathe.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">BookTok Readers</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Listen to viral spicy romance quotes and fantasy battles in full, dramatic, breathy character voices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-5 h-5 text-gold" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">Novel Readers</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Turn your saved e-books, classics, and PDF library into studio-grade audiobooks to enjoy while commuting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Heart className="w-5 h-5 text-booktok-rose" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">Fanfiction Readers</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Paste your favorite AO3 or Wattpad chapters and hear your beloved characters voiced with true emotion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Scroll className="w-5 h-5 text-gold-light" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">Writers & Authors</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Listen back to your drafts to catch dialogue rhythm, awkward phrasing, and flow before publishing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">Students & Researchers</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Convert dense academic papers and required reading PDFs into clear, didactic Teacher Narration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-library-espresso/80 border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="flex items-center space-x-3 mb-2">
                <Headphones className="w-5 h-5 text-purple-300" />
                <h4 className="font-serif font-bold text-lg text-parchment-100">Audiobook Enthusiasts</h4>
              </div>
              <p className="text-xs text-parchment-300 leading-relaxed">
                Create customized audio narrations on demand with adjustable speed, pitch, and emotion profiles.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          CURATED SAMPLE STORIES CAROUSEL / GRID
          ==================================================================== */}
      {sampleStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                Instant Exploration
              </span>
              <h2 className="font-serif text-3xl font-bold text-library-dark mt-1">
                Curated Story Samples
              </h2>
              <p className="text-sm text-library-taupe mt-1">
                Click any story to automatically populate the Story Studio with ready-to-narrate text.
              </p>
            </div>
            <button
              onClick={() => onStartCreating('paste')}
              className="mt-4 sm:mt-0 text-sm font-semibold text-library-leather hover:text-library-dark flex items-center space-x-1"
            >
              <span>Or bring your own story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleStories.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onSelectSampleStory(sample)}
                className="group cursor-pointer rounded-2xl p-5 bg-white/90 border border-parchment-200 hover:border-gold shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-library-taupe mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-parchment-200 text-library-wood font-medium">
                      {sample.genre}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-library-dark group-hover:text-gold-dark transition-colors line-clamp-1">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-library-wood font-sans italic mt-0.5 mb-2">
                    {sample.author}
                  </p>
                  <p className="text-xs text-library-taupe line-clamp-3 leading-relaxed">
                    {sample.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-parchment-100 flex items-center justify-between text-xs font-medium text-gold-dark group-hover:underline">
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
