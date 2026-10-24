import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Download, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  Flame, 
  Share2, 
  Clock, 
  ArrowLeft,
  Search,
  ExternalLink,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

/**
 * Output Page Component
 * Immersive audiobook listening room with audio player, visualizer,
 * synced interactive transcript, download, and regeneration controls.
 */
export default function OutputPage({
  storyOutput,
  onRegenerate,
  onBackToStudio,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(storyOutput?.duration || 60);
  const [playbackSpeed, setPlaybackSpeed] = useState(storyOutput?.speed || 1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transcriptFontSize, setTranscriptFontSize] = useState('text-base');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegmentId, setActiveSegmentId] = useState(null);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transcriptContainerRef = useRef(null);

  // Initialize Audio Engine when story output changes
  useEffect(() => {
    if (!storyOutput) return;

    audioEngine.loadStory({
      audioUrl: storyOutput.audioUrl,
      isLiveApi: storyOutput.isLiveApi,
      duration: storyOutput.duration,
      text: storyOutput.timedTranscript?.paragraphs?.join('\n\n') || '',
      timedTranscript: storyOutput.timedTranscript,
      speed: storyOutput.speed || 1.0,
    });

    setDuration(storyOutput.duration || 60);
    setCurrentTime(0);
    setIsPlaying(false);

    // Subtle celebration confetti on story creation
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#8C7355', '#FAF7F2', '#E6C875'],
    });

    return () => {
      audioEngine.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [storyOutput]);

  // Audio Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const numBars = 55;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        // Dynamic waveform height based on playback state and sine oscillation
        let barHeight;
        if (isPlaying) {
          const factor = Math.sin(i * 0.2 + phase) * Math.cos(i * 0.1 - phase);
          barHeight = Math.max(6, Math.abs(factor) * (height * 0.85));
        } else {
          barHeight = 6 + Math.sin(i * 0.15) * 4;
        }

        const y = (height - barHeight) / 2;

        // Warm golden gradient for audio bars
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#F8E7B4');
        grad.addColorStop(0.5, '#D4AF37');
        grad.addColorStop(1, '#AA8825');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Track active transcript segment based on currentTime
  useEffect(() => {
    if (!storyOutput?.timedTranscript?.segments) return;

    const currentSegment = storyOutput.timedTranscript.segments.find(
      (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime
    );

    if (currentSegment && currentSegment.id !== activeSegmentId) {
      setActiveSegmentId(currentSegment.id);

      // Smoothly scroll active sentence into view within transcript
      const element = document.getElementById(currentSegment.id);
      if (element && transcriptContainerRef.current) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [currentTime, storyOutput, activeSegmentId]);

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(
        (time, dur) => {
          setCurrentTime(time);
          if (dur) setDuration(dur);
        },
        (state) => {
          setIsPlaying(state);
        }
      );
    }
  };

  // Seek handler
  const handleSeek = (newTime) => {
    audioEngine.seek(newTime);
    setCurrentTime(newTime);
  };

  // Speed change handler
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    audioEngine.setSpeed(speed);
  };

  // Skip 10 seconds
  const handleSkip = (seconds) => {
    const target = Math.max(0, Math.min(currentTime + seconds, duration));
    handleSeek(target);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Download Audio handler
  const handleDownloadAudio = () => {
    if (storyOutput.audioUrl) {
      // Direct MP3 download from Fish Audio
      const link = document.createElement('a');
      link.href = storyOutput.audioUrl;
      link.download = `${(storyOutput.title || 'characterverse-story').replace(/\s+/g, '_')}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate rich storytelling transcript & metadata export
      const exportContent = `=== ${storyOutput.title || 'CharacterVerse Story'} ===\n` +
        `Narration Mode: ${storyOutput.mode}\n` +
        `Voice Engine: ${storyOutput.voiceModel}\n` +
        `Emotion: ${storyOutput.emotion}\n` +
        `Speed: ${storyOutput.speed}x\n` +
        `Estimated Duration: ${formatTime(duration)}\n\n` +
        `--- TRANSCRIPT ---\n\n` +
        storyOutput.timedTranscript.paragraphs.join('\n\n');

      const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(storyOutput.title || 'characterverse-story').replace(/\s+/g, '_')}_transcript.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Copy full transcript to clipboard
  const handleCopyTranscript = () => {
    const fullText = storyOutput.timedTranscript?.paragraphs?.join('\n\n') || '';
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!storyOutput) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-library-taupe">No story currently loaded.</p>
        <button
          onClick={onBackToStudio}
          className="mt-4 px-6 py-2.5 rounded-xl bg-library-dark text-parchment-50 text-sm font-medium"
        >
          Return to Story Studio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToStudio}
          className="inline-flex items-center space-x-2 text-sm font-medium text-library-wood hover:text-library-dark transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Story Studio</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Regenerate Action */}
          <button
            onClick={onRegenerate}
            className="px-4 py-2 rounded-xl bg-white hover:bg-parchment-100 border border-parchment-300 text-library-dark text-xs sm:text-sm font-medium shadow-xs flex items-center space-x-2 transition-all hover:border-gold"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-dark" />
            <span>Regenerate Narration</span>
          </button>

          {/* Download Audio Action */}
          <button
            onClick={handleDownloadAudio}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-library-dark to-library-walnut text-parchment-50 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg flex items-center space-x-2 transition-all border border-gold/40 hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>{storyOutput.audioUrl ? 'Download MP3' : 'Export Story Package'}</span>
          </button>
        </div>
      </div>

      {/* Notice Banner if in Preview Mode */}
      {storyOutput.demoModeNotice && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{storyOutput.demoModeNotice}</span>
          </div>
          <span className="text-[11px] font-mono text-amber-700 hidden md:inline">
            Interactive transcript sync active
          </span>
        </div>
      )}

      {/* ====================================================================
          SECTION 1: THE AUDIO PLAYER & VISUALIZER
          ==================================================================== */}
      <div className="rounded-3xl bg-library-dark text-parchment-50 p-6 sm:p-10 border border-gold/30 shadow-2xl relative overflow-hidden">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-booktok-wine/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-7">
          
          {/* Story Meta Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-400/20 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gold/20 text-gold-light border border-gold/40">
                  {storyOutput.mode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-parchment-200 border border-white/15">
                  {storyOutput.voiceModel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-booktok-wine/40 text-rose-200 border border-rose-300/20">
                  {storyOutput.emotion?.replace('-', ' ')}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment-50">
                {storyOutput.title}
              </h2>
            </div>

            <div className="text-right text-xs text-parchment-300">
              <span className="block font-mono text-gold-light">
                {storyOutput.wordCount || 0} words
              </span>
              <span className="text-[11px] text-parchment-400">
                Cadence: {storyOutput.speed}x
              </span>
            </div>
          </div>

          {/* Canvas Waveform Visualizer */}
          <div className="h-20 w-full flex items-center justify-center bg-library-espresso/90 rounded-2xl p-3 border border-gold/20">
            <canvas
              ref={canvasRef}
              width={750}
              height={70}
              className="w-full h-full max-w-full"
            />
          </div>

          {/* Interactive Scrubbing Slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full accent-gold cursor-pointer h-2 bg-library-walnut rounded-lg"
            />
            <div className="flex justify-between text-xs font-mono text-parchment-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Transport Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            
            {/* Playback speed buttons */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-parchment-400 mr-1 hidden sm:inline">Speed:</span>
              {[0.8, 1.0, 1.25, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    playbackSpeed === s
                      ? 'bg-gold text-library-dark font-bold shadow-sm'
                      : 'bg-library-walnut text-parchment-300 hover:text-white hover:bg-library-leather'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Central Playback Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Skip backward 10s */}
              <button
                onClick={() => handleSkip(-10)}
                className="w-10 h-10 rounded-full bg-library-walnut hover:bg-library-leather text-parchment-200 hover:text-gold flex items-center justify-center transition-colors border border-parchment-400/20"
                title="Skip back 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light text-library-dark flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-300"
                title={isPlaying ? "Pause Narration" : "Play Narration"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-library-dark" />
                ) : (
                  <Play className="w-7 h-7 fill-library-dark ml-1" />
                )}
              </button>

              {/* Skip forward 10s */}
              <button
                onClick={() => handleSkip(10)}
                className="w-10 h-10 rounded-full bg-library-walnut hover:bg-library-leather text-parchment-200 hover:text-gold flex items-center justify-center transition-colors border border-parchment-400/20"
                title="Skip forward 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

            </div>

            {/* Volume & Mute control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newMute = !isMuted;
                  setIsMuted(newMute);
                  if (audioEngine.audioElement) {
                    audioEngine.audioElement.muted = newMute;
                  }
                }}
                className="text-parchment-300 hover:text-gold transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (audioEngine.audioElement) {
                    audioEngine.audioElement.volume = val;
                  }
                }}
                className="w-20 accent-gold cursor-pointer h-1.5 bg-library-walnut rounded-lg"
              />
            </div>

          </div>

        </div>
      </div>

      {/* ====================================================================
          SECTION 2: INTERACTIVE TRANSCRIPT PANEL
          • Synchronized line/sentence highlighting
          • Click-to-seek
          • Font sizing
          • Copy & Search
          ==================================================================== */}
      <div className="rounded-3xl bg-white border border-parchment-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Transcript Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-parchment-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-2xl font-bold text-library-dark">
                Interactive Transcript
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-parchment-100 border border-parchment-300 text-library-taupe">
                Click any line to jump audio
              </span>
            </div>
            <p className="text-xs text-library-taupe mt-1">
              Highlighted sentences automatically track narration playback in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Search within transcript */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-library-taupe" />
              <input
                type="text"
                placeholder="Find in transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-parchment-50 border border-parchment-300 text-xs text-library-dark outline-none focus:border-gold w-36 sm:w-48"
              />
            </div>

            {/* Font Size Adjusters */}
            <div className="flex items-center space-x-1 border border-parchment-300 rounded-xl p-1 bg-parchment-50">
              <button
                onClick={() => setTranscriptFontSize('text-sm')}
                className={`px-2 py-0.5 rounded text-xs ${transcriptFontSize === 'text-sm' ? 'bg-gold/20 font-bold text-library-dark' : 'text-library-wood'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setTranscriptFontSize('text-base')}
                className={`px-2 py-0.5 rounded text-xs ${transcriptFontSize === 'text-base' ? 'bg-gold/20 font-bold text-library-dark' : 'text-library-wood'}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setTranscriptFontSize('text-lg')}
                className={`px-2 py-0.5 rounded text-xs ${transcriptFontSize === 'text-lg' ? 'bg-gold/20 font-bold text-library-dark' : 'text-library-wood'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Copy Transcript Button */}
            <button
              onClick={handleCopyTranscript}
              className="p-2 rounded-xl bg-parchment-100 hover:bg-parchment-200 text-library-wood border border-parchment-300 transition-colors flex items-center space-x-1.5 text-xs font-medium"
              title="Copy transcript"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

          </div>
        </div>

        {/* Transcript Content Container */}
        <div
          ref={transcriptContainerRef}
          className={`space-y-6 max-h-[460px] overflow-y-auto pr-3 font-serif leading-relaxed ${transcriptFontSize} text-library-espresso select-text`}
        >
          {storyOutput.timedTranscript?.segments && storyOutput.timedTranscript.segments.length > 0 ? (
            storyOutput.timedTranscript.paragraphs.map((paragraph, pIdx) => {
              // Find segments belonging to this paragraph
              const pSegments = storyOutput.timedTranscript.segments.filter(
                (s) => s.paragraphIndex === pIdx
              );

              return (
                <p key={pIdx} className="leading-relaxed">
                  {pSegments.map((segment) => {
                    const isActive = activeSegmentId === segment.id;
                    const isMatch = searchQuery && segment.text.toLowerCase().includes(searchQuery.toLowerCase());

                    return (
                      <span
                        key={segment.id}
                        id={segment.id}
                        onClick={() => handleSeek(segment.startTime)}
                        className={`cursor-pointer transition-colors px-1 py-0.5 rounded inline-block ${
                          isActive
                            ? 'transcript-active-segment font-semibold text-library-dark'
                            : 'hover:bg-gold/15 text-library-dark/90'
                        } ${isMatch ? 'bg-amber-200 font-semibold' : ''}`}
                        title={`Jump to ${formatTime(segment.startTime)}`}
                      >
                        {segment.text}{' '}
                      </span>
                    );
                  })}
                </p>
              );
            })
          ) : (
            <p className="italic text-library-taupe">No transcript segments available.</p>
          )}
        </div>

      </div>

    </div>
  );
}
