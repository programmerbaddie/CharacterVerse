/**
 * CharacterVerse - Main Backend Server
 * Express.js application powering AI-driven storytelling with Fish Audio.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { extractTextFromFile } = require('./services/pdfService');
const {
  VOICE_MODELS,
  CHARACTER_PRESETS,
  synthesizeStoryAudio,
} = require('./services/fishAudioService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware configuration
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer memory storage configuration for uploaded PDFs & text files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/octet-stream',
    ];
    const allowedExts = ['.pdf', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a PDF, TXT, or Markdown document.'));
    }
  },
});

// Curated BookTok / Literature sample stories for instant testing
const SAMPLE_STORIES = [
  {
    id: 'midnight-library-reverie',
    title: 'The Whispering Archives of Oakhaven',
    genre: 'Gothic Fantasy & Dark Romance',
    author: 'Seraphina Vance',
    tagline: 'A forbidden pact made beneath towering mahogany bookshelves and flickering candle flames.',
    text: `The scent of ancient parchment and crushed dried lavender lingered heavy in the air. Julian stepped out from the shadows of the mezzanine, his silver-ringed fingers tracing the carved spine of a forgotten grimoire.\n\n"You should not have returned to the forbidden alcove, Aurelia," he murmured, his voice as smooth and lethal as midnight velvet. "Some secrets were buried beneath these marble floors for good reason."\n\nShe lifted the brass lantern, casting long, trembling amber shadows across the library walls. "I didn't come for your warnings, Julian. I came for the voice that calls to me through the bindings."\n\nA slow, dangerous smile curved his lips. "Then prepare yourself. Because once a story awakens in this room, it never lets you walk away unchanged."`,
    recommendedMode: 'dramatic',
    recommendedVoice: 'drama-3',
    recommendedPreset: 'dark-romance-narrator',
    recommendedEmotion: 'dark-mysterious',
  },
  {
    id: 'autumn-coffee-chronicles',
    title: 'Raindrops on Cobblestone',
    genre: 'Cozy Fiction & Contemporary',
    author: 'Clara Hawthorne',
    tagline: 'Warm cinnamon lattes, dog-eared paperback pages, and second chances.',
    text: `The bell above the antique bookstore door chimed softly as rain tapped a gentle rhythm against the leaded glass windows. Eleanor folded the woolen scarf tighter around her shoulders, cradling a porcelain mug of steaming hazelnut roast.\n\nOutside, the London streetlights were turning to gold in the gathering twilight. In corner booth three, a handwritten manuscript lay open, its margins decorated with whimsical ink sketches of stars and constellations.\n\n"You've been reading that same chapter for three hours," a voice chuckled warmly from behind the counter. Eleanor smiled without looking up. "Because when a book feels like home, you don't rush through the doorway."`,
    recommendedMode: 'audiobook',
    recommendedVoice: 's2.1-pro',
    recommendedPreset: 'cozy-library-curator',
    recommendedEmotion: 'warm-cozy',
  },
  {
    id: 'booktok-deepdive-podcast',
    title: 'Plot Twists & Heartbreak: The Chapter 42 Debrief',
    genre: 'BookTok Discussion Podcast',
    author: 'Bookish Haven Podcast',
    tagline: 'Two avid readers losing their minds over the most controversial plot twist of the year.',
    text: `Welcome back to the Bookish Haven! We are currently screaming, crying, and questioning everything we thought we knew about the Shadow Court.\n\nDid the author really just do that at the end of Chapter forty-two?! We literally threw our paperbacks across the living room. Let's break down the hidden clues from chapter seven that we all completely missed.\n\nGrab your iced matcha, grab a box of tissues, because today we are analyzing every single line of dialogue and every single glance exchanged across the battlefield.`,
    recommendedMode: 'podcast',
    recommendedVoice: 's2.1-pro',
    recommendedPreset: 'podcast-duo',
    recommendedEmotion: 'conversational-lively',
  },
  {
    id: 'mythology-masterclass',
    title: 'The Loom of Fate: Understanding Classical Tragedies',
    genre: 'Educational & Literary Analysis',
    author: 'Prof. Julian Sterling',
    tagline: 'An engaging masterclass breaking down the timeless heroics of ancient legends.',
    text: `Consider for a moment why the tragic hero continues to fascinate human civilization across three millennia. When Achilles sits weeping beside the Aegean waves, he is not merely mourning Patroclus—he is mourning the agonizing weight of mortal destiny.\n\nIn classical literature, fate was never an enemy to be conquered, but a mirror reflecting the character's deepest vulnerabilities. Today, we will examine three pivotal narrative devices that modern writers still borrow from Homer and Sophocles.`,
    recommendedMode: 'teacher',
    recommendedVoice: 's2.1-pro',
    recommendedPreset: 'scholarly-historian',
    recommendedEmotion: 'scholarly-wise',
  },
];

// Available Emotions for styling
const AVAILABLE_EMOTIONS = [
  { id: 'warm-cozy', name: 'Warm & Cozy', description: 'Gentle, comforting, warm hearthside cadence' },
  { id: 'dark-mysterious', name: 'Dark & Mysterious', description: 'Brooding, suspenseful, BookTok dark romance tension' },
  { id: 'melodramatic-romantic', name: 'Melodramatic & Passionate', description: 'Intense romantic yearning and emotional highs' },
  { id: 'epic-heroic', name: 'Epic & Heroic', description: 'Grand, commanding, soaring cinematic timbre' },
  { id: 'scholarly-wise', name: 'Scholarly & Measured', description: 'Calm, authoritative, insightful didactic pacing' },
  { id: 'conversational-lively', name: 'Conversational & Banter', description: 'Upbeat, candid, podcast-style discussion' },
  { id: 'whispering-intimate', name: 'Whispering & Intimate', description: 'Soft, breathless, close-mic emotional proximity' },
];

// Available Experience Modes
const EXPERIENCE_MODES = [
  {
    id: 'audiobook',
    name: 'Audiobook',
    badge: 'Classic Experience',
    description: 'Immersive, cinematic, professional studio narration with fluid chapter pacing.',
    icon: 'BookOpen',
  },
  {
    id: 'dramatic',
    name: 'Dramatic Performance',
    badge: 'Theatrical Tension',
    description: 'Heightened emotion, dynamic character energy, and dramatic pauses tailored for fiction & BookTok.',
    icon: 'Sparkles',
  },
  {
    id: 'podcast',
    name: 'Podcast Discussion',
    badge: 'Conversational',
    description: 'Dynamic conversational dialogue cadence, perfect for story analyses, debriefs, and fanfiction commentary.',
    icon: 'Radio',
  },
  {
    id: 'teacher',
    name: 'Teacher Narration',
    badge: 'Deep Learning',
    description: 'Clear, patient, explanatory cadence engineered for students, non-fiction, and academic literature.',
    icon: 'GraduationCap',
  },
];

/* ==========================================================================
   API Routes
   ========================================================================== */

/**
 * Health check & configuration status
 */
app.get('/api/health', (req, res) => {
  const hasFishAudioKey = Boolean(
    process.env.FISH_AUDIO_API_KEY &&
    process.env.FISH_AUDIO_API_KEY.trim() &&
    process.env.FISH_AUDIO_API_KEY !== 'your_fish_audio_api_key_here'
  );

  res.json({
    status: 'healthy',
    service: 'CharacterVerse API',
    version: '1.0.0',
    fishAudioConfigured: hasFishAudioKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * Get available voice models, character presets, modes, and emotions
 */
app.get('/api/voices', (req, res) => {
  res.json({
    voiceModels: Object.values(VOICE_MODELS),
    characterPresets: CHARACTER_PRESETS,
    experienceModes: EXPERIENCE_MODES,
    emotions: AVAILABLE_EMOTIONS,
  });
});

/**
 * Get sample curated BookTok / literature stories
 */
app.get('/api/sample-stories', (req, res) => {
  res.json(SAMPLE_STORIES);
});

/**
 * Extract text from uploaded PDF or TXT document
 */
app.post('/api/extract-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const extracted = await extractTextFromFile(buffer, mimetype, originalname);

    if (!extracted.text || extracted.text.trim().length === 0) {
      return res.status(422).json({
        error: 'Unable to extract text from the file. Please ensure the document is not an image scan without OCR.',
      });
    }

    // Derive a clean title from the filename
    const cleanTitle = path.basename(originalname, path.extname(originalname))
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    res.json({
      success: true,
      filename: originalname,
      title: cleanTitle,
      text: extracted.text,
      wordCount: extracted.wordCount,
      readingTimeMinutes: extracted.readingTimeMinutes,
      pageCount: extracted.pageCount,
    });
  } catch (error) {
    console.error('File extraction error:', error);
    res.status(500).json({
      error: 'Failed to process document: ' + (error.message || 'Unknown error'),
    });
  }
});

/**
 * Synthesize story into speech with Fish Audio
 */
app.post('/api/generate-story', async (req, res) => {
  try {
    const {
      text,
      title,
      mode = 'audiobook',
      voiceModel = 's2.1-pro',
      characterPreset = 'dark-romance-narrator',
      emotion = 'warm-cozy',
      speed = 1.0,
    } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Story text is required to generate speech.' });
    }

    const result = await synthesizeStoryAudio({
      text: text.trim(),
      title: title ? title.trim() : 'Untitled Story',
      mode,
      voiceModel,
      characterPreset,
      emotion,
      speed: Number(speed) || 1.0,
    });

    res.json(result);
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      error: 'Story narration synthesis failed: ' + (error.message || 'Internal error'),
    });
  }
});

// Serve frontend production build if available
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Endpoint not found and frontend build not ready.' });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: err.message || 'An unexpected server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`✨ CharacterVerse Server running at http://localhost:${PORT}`);
  console.log(`🎙️ Fish Audio Integration: ${process.env.FISH_AUDIO_API_KEY ? 'Configured ✅' : 'Preview/Fallback Mode (Ready) 🚀'}`);
});
