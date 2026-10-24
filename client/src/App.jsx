import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StoryStudio from './components/StoryStudio';
import OutputPage from './components/OutputPage';
import Footer from './components/Footer';

/**
 * CharacterVerse Main Application
 * AI-powered storytelling platform for BookTok readers, writers, and novel enthusiasts.
 */
export default function App() {
  const [activePage, setActivePage] = useState('landing'); // 'landing' | 'studio' | 'output'
  const [isFishAudioLive, setIsFishAudioLive] = useState(false);
  const [sampleStories, setSampleStories] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  // Studio form input state
  const [storyData, setStoryData] = useState({
    fileInfo: null,
    title: '',
    text: '',
    mode: 'dramatic',
    voiceModel: 'drama-3',
    characterPreset: 'dark-romance-narrator',
    emotion: 'dark-mysterious',
    speed: 1.0,
  });

  // Generated narration output payload
  const [storyOutput, setStoryOutput] = useState(null);

  // Fetch backend status and sample stories on mount
  useEffect(() => {
    // 1. Health check to determine if real Fish Audio API key is loaded
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsFishAudioLive(Boolean(data.fishAudioConfigured));
      })
      .catch((err) => {
        console.warn('Backend connection note:', err.message);
      });

    // 2. Fetch curated BookTok sample stories
    fetch('/api/sample-stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSampleStories(data);
          // Pre-populate with first sample story for an immediate rich experience
          const first = data[0];
          setStoryData((prev) => ({
            ...prev,
            title: first.title,
            text: first.text,
            mode: first.recommendedMode || 'dramatic',
            voiceModel: first.recommendedVoice || 'drama-3',
            characterPreset: first.recommendedPreset || 'dark-romance-narrator',
            emotion: first.recommendedEmotion || 'dark-mysterious',
          }));
        }
      })
      .catch((err) => {
        console.warn('Could not load sample stories:', err.message);
      });
  }, []);

  // Handler for uploading file from Landing page or Studio
  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract text from document.');

      setStoryData((prev) => ({
        ...prev,
        fileInfo: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          pageCount: data.pageCount || 1,
        },
        title: data.title || file.name.replace(/\.[^/.]+$/, ''),
        text: data.text,
      }));

      // Direct user into Story Studio
      setActivePage('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(`Upload notice: ${err.message}`);
    }
  };

  // Handler for selecting sample story from Landing or Studio
  const handleSelectSampleStory = (sample) => {
    if (!sample) return;
    setStoryData({
      fileInfo: null,
      title: sample.title,
      text: sample.text,
      mode: sample.recommendedMode || 'audiobook',
      voiceModel: sample.recommendedVoice || 's2.1-pro',
      characterPreset: sample.recommendedPreset || 'dark-romance-narrator',
      emotion: sample.recommendedEmotion || 'warm-cozy',
      speed: 1.0,
    });
    setActivePage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Story Generation with Fish Audio API
  const handleGenerateStory = async () => {
    if (!storyData.text.trim()) {
      alert('Please enter or upload a story text before generating.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Speech generation encountered an error.');
      }

      setStoryOutput(result);
      setActivePage('output');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Narration generation error:', err);
      setGenerateError(err.message);
      alert(`Story generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 font-sans selection:bg-gold-light selection:text-library-espresso">
      
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isFishAudioLive={isFishAudioLive}
        hasActiveStory={Boolean(storyOutput)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onStartCreating={() => {
              setActivePage('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFileUpload={handleFileUpload}
            onSelectSampleStory={handleSelectSampleStory}
            sampleStories={sampleStories}
          />
        )}

        {activePage === 'studio' && (
          <StoryStudio
            storyData={storyData}
            setStoryData={setStoryData}
            onGenerateStory={handleGenerateStory}
            isGenerating={isGenerating}
            sampleStories={sampleStories}
            onSelectSample={handleSelectSampleStory}
          />
        )}

        {activePage === 'output' && (
          <OutputPage
            storyOutput={storyOutput}
            onRegenerate={handleGenerateStory}
            onBackToStudio={() => {
              setActivePage('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
