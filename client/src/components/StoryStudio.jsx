import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  Sparkles, 
  BookOpen, 
  Radio, 
  GraduationCap, 
  Flame, 
  Volume2, 
  Sliders, 
  Check, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Clock,
  Type
} from 'lucide-react';

/**
 * Story Studio Component
 * Interactive workspace where users upload/paste text and customize narration modes,
 * voice models, emotions, and playback speed.
 */
export default function StoryStudio({
  storyData,
  setStoryData,
  onGenerateStory,
  isGenerating,
  sampleStories = [],
  onSelectSample,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Experience Modes specification
  const EXPERIENCE_MODES = [
    {
      id: 'audiobook',
      name: 'Audiobook',
      badge: 'Classic Pacing',
      icon: BookOpen,
      desc: 'Cinematic, soothing narration optimized for novel chapters and continuous listening.',
      recommendedVoice: 's2.1-pro',
      accent: 'border-amber-400/40 text-amber-700 bg-amber-50/50',
    },
    {
      id: 'dramatic',
      name: 'Dramatic Performance',
      badge: 'BookTok Tension',
      icon: Sparkles,
      desc: 'Theatrical intensity, breath dynamics, and emotional tension for dark romance & fantasy.',
      recommendedVoice: 'drama-3',
      accent: 'border-rose-400/40 text-rose-700 bg-rose-50/50',
    },
    {
      id: 'podcast',
      name: 'Podcast Discussion',
      badge: 'Engaging Banter',
      icon: Radio,
      desc: 'Conversational dialogue cadence, analyzing plot twists and character theories.',
      recommendedVoice: 's2.1-pro',
      accent: 'border-indigo-400/40 text-indigo-700 bg-indigo-50/50',
    },
    {
      id: 'teacher',
      name: 'Teacher Narration',
      badge: 'Didactic & Clear',
      icon: GraduationCap,
      desc: 'Articulate, measured lecture cadence tailored for students, essays, and educational texts.',
      recommendedVoice: 's2.1-pro',
      accent: 'border-emerald-400/40 text-emerald-700 bg-emerald-50/50',
    },
  ];

  // Voice Models requested: Fish Audio S2.1 Pro & Fish Audio Drama 3
  const VOICE_MODELS = [
    {
      id: 's2.1-pro',
      name: 'Fish Audio S2.1 Pro',
      badge: 'Flagship Studio',
      engine: 'Fish Speech v2.1',
      desc: 'Silky smooth, high-fidelity neural model. Excels at long-form prose and audiobook depth.',
    },
    {
      id: 'drama-3',
      name: 'Fish Audio Drama 3',
      badge: 'High Theatrical',
      engine: 'Fish Drama v3.0',
      desc: 'Trained on stage dialogues, micro-pauses, dramatic whispers, and romance tropes.',
    },
  ];

  // Character Presets for easy selection
  const CHARACTER_PRESETS = [
    { id: 'dark-romance-narrator', name: 'Julian', role: 'Velvet Baritone • Dark Romance' },
    { id: 'fantasy-heroine', name: 'Aurelia', role: 'Regal & Fierce • Fantasy Chronicler' },
    { id: 'cozy-library-curator', name: 'Eleanor', role: 'Warm Hearthside • Cozy Fiction' },
    { id: 'scholarly-historian', name: 'Dr. Sterling', role: 'Insightful & Patient • Literary Scholar' },
    { id: 'podcast-duo', name: 'River & Kai', role: 'Upbeat Dialogue • Discussion Hosts' },
  ];

  // Emotions
  const EMOTIONS = [
    { id: 'warm-cozy', label: 'Warm & Cozy' },
    { id: 'dark-mysterious', label: 'Dark & Mysterious' },
    { id: 'melodramatic-romantic', label: 'Melodramatic & Passionate' },
    { id: 'epic-heroic', label: 'Epic & Heroic' },
    { id: 'scholarly-wise', label: 'Scholarly & Wise' },
    { id: 'conversational-lively', label: 'Conversational Banter' },
    { id: 'whispering-intimate', label: 'Whispering & Intimate' },
  ];

  // File upload handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadError(null);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from document.');
      }

      setStoryData((prev) => ({
        ...prev,
        fileInfo: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          pageCount: data.pageCount || 1,
        },
        title: prev.title || data.title || file.name.replace(/\.[^/.]+$/, ''),
        text: data.text,
        wordCount: data.wordCount,
        readingTimeMinutes: data.readingTimeMinutes,
      }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setStoryData((prev) => ({
      ...prev,
      fileInfo: null,
    }));
  };

  const wordCount = storyData.text ? storyData.text.split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 150));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-parchment-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fish Audio Story Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-library-dark mt-1">
            Story Studio
          </h1>
          <p className="text-sm text-library-taupe mt-1">
            Configure your story's voice, emotion, and dramatic pacing before bringing it to life.
          </p>
        </div>

        {/* Quick Sample Selector */}
        {sampleStories.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-library-wood font-medium hidden sm:inline">Try a sample:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleStories.slice(0, 3).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-parchment-200 hover:bg-gold/20 text-library-walnut border border-parchment-300 hover:border-gold transition-colors font-medium truncate max-w-[130px]"
                  title={sample.title}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">Document processing error</p>
            <p className="text-xs mt-0.5">{uploadError}</p>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ====================================================================
          SECTION 1: STORY ASSETS & PREVIEW
          • Uploaded file
          • Story title
          • Text preview
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: File upload & Story Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* File Upload / Status Card */}
          <div className="p-6 rounded-3xl bg-white border border-parchment-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-library-dark flex items-center justify-between">
              <span>Source Document</span>
              <span className="text-xs font-sans font-normal text-library-taupe">PDF, TXT, MD</span>
            </h3>

            {storyData.fileInfo ? (
              <div className="p-4 rounded-2xl bg-parchment-100 border border-parchment-300 flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold-dark flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-library-dark truncate">
                      {storyData.fileInfo.name}
                    </p>
                    <p className="text-xs text-library-taupe">
                      {storyData.fileInfo.size} • {storyData.fileInfo.pageCount} page(s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-library-wood hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-2 ${
                  dragActive 
                    ? 'border-gold bg-gold/10' 
                    : 'border-parchment-300 hover:border-gold/60 bg-parchment-50/50 hover:bg-parchment-100'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  accept=".pdf,.txt,.md"
                  className="hidden"
                />
                
                {isExtracting ? (
                  <div className="flex flex-col items-center py-2 space-y-2">
                    <Loader2 className="w-8 h-8 text-gold-dark animate-spin" />
                    <p className="text-xs font-medium text-library-dark">Extracting text from PDF...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-parchment-200 flex items-center justify-center text-library-wood">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-library-dark">
                        Drop your PDF or manuscript here
                      </p>
                      <p className="text-xs text-library-taupe mt-0.5">
                        Or click to browse files
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Story Title Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-library-wood block">
                Story Title
              </label>
              <input
                type="text"
                value={storyData.title}
                onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                placeholder="E.g., The Midnight Library Chapter 4"
                className="w-full px-4 py-3 rounded-xl bg-parchment-50 border border-parchment-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm font-medium text-library-dark transition-all"
              />
            </div>

            {/* Story Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-library-wood border-t border-parchment-100">
              <div className="p-3 rounded-xl bg-parchment-50 border border-parchment-200">
                <span className="text-library-taupe block">Word Count</span>
                <span className="font-serif text-lg font-bold text-library-dark">{wordCount} words</span>
              </div>
              <div className="p-3 rounded-xl bg-parchment-50 border border-parchment-200">
                <span className="text-library-taupe block">Est. Duration</span>
                <span className="font-serif text-lg font-bold text-library-dark">~{estimatedReadingTime} min</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Text Preview */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-white border border-parchment-200 shadow-sm space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-library-dark">
                  Text Preview & Editor
                </h3>
                <p className="text-xs text-library-taupe">
                  Edit or paste directly. Natural punctuation and dialogue will guide voice inflection.
                </p>
              </div>
              {storyData.text && (
                <button
                  onClick={() => setStoryData({ ...storyData, text: '' })}
                  className="text-xs text-library-wood hover:text-rose-600 underline font-medium"
                >
                  Clear text
                </button>
              )}
            </div>

            <div className="relative flex-1 min-h-[260px]">
              <textarea
                value={storyData.text}
                onChange={(e) => setStoryData({ ...storyData, text: e.target.value })}
                placeholder="Paste your story excerpt, BookTok romance quote, dialogue, or article here..."
                rows={10}
                className="w-full h-full p-4 rounded-2xl bg-parchment-50 border border-parchment-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm leading-relaxed text-library-espresso font-serif resize-none transition-all"
              />
            </div>
          </div>
        </div>

      </div>

      {/* ====================================================================
          SECTION 2: CHOOSE EXPERIENCE MODE
          • Audiobook
          • Dramatic Performance
          • Podcast Discussion
          • Teacher Narration
          ==================================================================== */}
      <div className="p-8 rounded-3xl bg-white border border-parchment-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
            Step 1: Narrative Style
          </span>
          <h2 className="font-serif text-2xl font-bold text-library-dark mt-1">
            Choose Experience Mode
          </h2>
          <p className="text-sm text-library-taupe">
            Select the dramatic cadence and vocal atmosphere best suited for your story genre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPERIENCE_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = storyData.mode === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => {
                  setStoryData({
                    ...storyData,
                    mode: mode.id,
                    voiceModel: mode.recommendedVoice || storyData.voiceModel,
                  });
                }}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-gold bg-parchment-100 shadow-md ring-2 ring-gold/20'
                    : 'border-parchment-200 hover:border-gold/50 bg-parchment-50/40 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold text-library-dark flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-parchment-300 flex items-center justify-center text-library-dark mb-3">
                    <Icon className="w-5 h-5 text-gold-dark" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-library-taupe">
                    {mode.badge}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-library-dark mt-0.5">
                    {mode.name}
                  </h4>
                  <p className="text-xs text-library-wood mt-2 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-parchment-200 text-[11px] text-library-taupe">
                  Rec. Engine: <span className="font-medium text-library-dark">{mode.recommendedVoice === 'drama-3' ? 'Drama 3' : 'S2.1 Pro'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          SECTION 3: VOICE MODEL & CHARACTER PRESET
          • Fish Audio S2.1 Pro
          • Fish Audio Drama 3
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Voice Models */}
        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-parchment-200 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
              Step 2: Engine Selection
            </span>
            <h2 className="font-serif text-2xl font-bold text-library-dark mt-1">
              Voice Model
            </h2>
            <p className="text-xs text-library-taupe">
              Select between Fish Audio's flagship neutral fidelity or theatrical performance models.
            </p>
          </div>

          <div className="space-y-3">
            {VOICE_MODELS.map((model) => {
              const isSelected = storyData.voiceModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => setStoryData({ ...storyData, voiceModel: model.id })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'border-gold bg-parchment-100 ring-2 ring-gold/20 shadow-sm'
                      : 'border-parchment-200 hover:border-gold/50 bg-parchment-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-base text-library-dark">
                        {model.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/20 text-library-espresso border border-gold/30">
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-xs text-library-wood leading-relaxed">
                      {model.desc}
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ml-2 ${
                    isSelected ? 'border-gold bg-gold text-library-dark' : 'border-parchment-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Character Voice Preset Picker */}
          <div className="pt-2 border-t border-parchment-100">
            <label className="text-xs font-semibold uppercase tracking-wider text-library-wood block mb-2">
              Curated Voice Persona Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHARACTER_PRESETS.map((preset) => {
                const isSelected = storyData.characterPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setStoryData({ ...storyData, characterPreset: preset.id })}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      isSelected
                        ? 'border-gold bg-parchment-200 font-semibold text-library-dark shadow-xs'
                        : 'border-parchment-200 hover:border-gold/40 bg-white text-library-wood'
                    }`}
                  >
                    <span className="block font-serif text-sm font-bold text-library-dark">{preset.name}</span>
                    <span className="text-[11px] text-library-taupe block truncate">{preset.role}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls: Emotion & Playback Speed */}
        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-parchment-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
              Step 3: Nuance & Cadence
            </span>
            <h2 className="font-serif text-2xl font-bold text-library-dark mt-1">
              Narration Controls
            </h2>
            <p className="text-xs text-library-taupe">
              Tailor emotional tone and speech pace for optimal storytelling immersion.
            </p>
          </div>

          {/* Emotion Controls */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-library-wood flex items-center justify-between">
              <span>Emotion & Vocal Tone</span>
              <span className="text-[11px] font-normal text-gold-dark lowercase font-sans">
                {storyData.emotion.replace('-', ' ')}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emo) => {
                const isSelected = storyData.emotion === emo.id;
                return (
                  <button
                    key={emo.id}
                    onClick={() => setStoryData({ ...storyData, emotion: emo.id })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-library-dark text-parchment-50 shadow-sm ring-1 ring-gold'
                        : 'bg-parchment-100 hover:bg-parchment-200 text-library-leather border border-parchment-300'
                    }`}
                  >
                    {emo.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback Speed Controls */}
          <div className="space-y-3 pt-2 border-t border-parchment-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-library-wood">
                Playback Speed
              </label>
              <span className="text-sm font-serif font-bold text-library-espresso bg-parchment-200 px-2 py-0.5 rounded-lg border border-parchment-300">
                {storyData.speed}x
              </span>
            </div>

            <input
              type="range"
              min="0.75"
              max="2.0"
              step="0.05"
              value={storyData.speed}
              onChange={(e) => setStoryData({ ...storyData, speed: parseFloat(e.target.value) })}
              className="w-full accent-gold-dark cursor-pointer h-2 bg-parchment-200 rounded-lg"
            />

            <div className="flex justify-between items-center text-xs text-library-taupe">
              <span>0.75x (Reflective)</span>
              <div className="flex space-x-1.5">
                {[1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStoryData({ ...storyData, speed: s })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      storyData.speed === s
                        ? 'bg-gold/20 border-gold text-library-dark font-bold'
                        : 'bg-parchment-100 border-parchment-200 text-library-wood'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <span>2.0x (Rapid)</span>
            </div>
          </div>

        </div>

      </div>

      {/* ====================================================================
          LARGE CTA: "Bring Story To Life"
          ==================================================================== */}
      <div className="pt-4 pb-6">
        <button
          onClick={onGenerateStory}
          disabled={isGenerating || !storyData.text.trim()}
          className={`w-full py-5 px-8 rounded-2xl text-lg font-serif font-bold text-library-cream tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden border ${
            isGenerating || !storyData.text.trim()
              ? 'bg-library-taupe/40 cursor-not-allowed border-parchment-300 text-library-wood'
              : 'bg-gradient-to-r from-library-dark via-library-espresso to-library-walnut hover:from-library-espresso hover:to-library-leather shadow-library-dark/30 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] border-gold/50 hover:border-gold'
          }`}
        >
          {/* Subtle golden shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {isGenerating ? (
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
              <span>Weaving Audio Tapestry with Fish Audio...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
              <span className="text-xl">Bring Story To Life</span>
              <Volume2 className="w-6 h-6 text-gold-light group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>

        {!storyData.text.trim() && (
          <p className="text-center text-xs text-library-taupe mt-3">
            Please paste text or upload a document above to activate generation.
          </p>
        )}
      </div>

    </div>
  );
}
