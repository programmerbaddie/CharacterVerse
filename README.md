# CharacterVerse 📖🎙️
> **"Every Story Deserves a Voice."**

An AI-powered storytelling platform designed specifically for **BookTok readers, novel enthusiasts, fanfiction communities, authors, and students**. 

CharacterVerse transforms uploaded manuscripts (PDF, TXT, Markdown) or pasted story excerpts into personalized, cinematic audio narrations using **Fish Audio** voice intelligence.

---

## ✨ Features & Highlights

- **Cozy Library & BookTok Aesthetic**: Warm cream, parchment beige, deep walnut leather, and antiqued gold palette with soft shadows, glassmorphic panels, and smooth animations.
- **Three Core Experiences**:
  1. **Landing Page**: Brand hero, community tag, quick PDF / text actions, curated BookTok stories showcase, and feature breakdown.
  2. **Story Studio**: File management with word count and duration estimations, Story Title editor, and customization controls:
     - **Experience Modes**: Audiobook, Dramatic Performance, Podcast Discussion, Teacher Narration.
     - **Voice Models**: Fish Audio S2.1 Pro (Flagship Studio) & Fish Audio Drama 3 (Theatrical & Romance).
     - **Character Voice Presets**: Julian (Dark Romance velvet baritone), Aurelia (Fantasy Chronicler), Eleanor (Cozy Library Host), Dr. Sterling (Literary Scholar), River & Kai (Podcast Discussion Hosts).
     - **Controls**: Emotional tone picker (*Warm & Cozy, Dark & Mysterious, Melodramatic, Epic, Whispering, etc.*) and variable playback speed slider (*0.75x to 2.0x*).
     - **Large CTA**: *"Bring Story To Life"* with interactive status feedback.
  3. **Output Page**:
     - **Audio Player**: Canvas waveform visualizer, responsive play/pause, seek scrub bar, 10s skip backward/forward, volume and mute, playback speed pills.
     - **Interactive Transcript**: Real-time line-by-line synchronized highlighting as audio plays. Click any sentence to jump the audio directly to that exact moment!
     - **Download Audio**: One-click download of the generated MP3 or exported story script package.
     - **Regenerate Narration**: Quick-tweak and re-voice with new pacing or emotion.
- **Robust Security**: API secrets strictly stored in backend `.env` and never leaked to the client browser.
- **Zero-Friction Fallback**: Fully functional out of the box even before adding an API key! If no Fish Audio key is set, the application automatically activates an intelligent browser speech engine with timed sentence timestamps so you can immediately experience all UI features, waveforms, and transcript syncing.

---

## 📁 Project Architecture & File Structure

```text
CharacterVerse/
├── client/                     # Frontend: React + Vite + Tailwind CSS
│   ├── public/
│   │   └── logo.svg            # CharacterVerse golden book brandmark
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation header & Fish Audio live status badge
│   │   │   ├── LandingPage.jsx # Hero, feature cards, BookTok picks & audience
│   │   │   ├── StoryStudio.jsx # Modes, Voice models, emotion controls & CTA
│   │   │   ├── OutputPage.jsx  # Audio player, waveform visualizer & synced transcript
│   │   │   └── Footer.jsx      # Cozy library footer & security badge
│   │   ├── utils/
│   │   │   └── audioEngine.js  # Audio player engine & canvas waveform synchronizer
│   │   ├── App.jsx             # Main application state and page routing
│   │   ├── index.css           # Custom parchment glassmorphism & typography
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML shell with Google Fonts (Cormorant & Plus Jakarta)
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Custom theme colors (parchment, library, gold)
│   └── vite.config.js          # Vite config with backend API proxy (/api)
│
├── server/                     # Backend: Node.js + Express
│   ├── services/
│   │   ├── fishAudioService.js # Fish Audio API caller, prosody & transcript timer
│   │   └── pdfService.js       # PDF & text file extraction with word counters
│   ├── server.js               # Express server, routes & static frontend delivery
│   ├── package.json            # Backend dependencies (express, multer, pdf-parse)
│   ├── .env.example            # Backend environment template
│   └── .env                    # Local private secrets (ignored by Git)
│
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules for node_modules, .env & logs
├── package.json                # Root convenience scripts
└── README.md                   # Beginner setup guide & documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended; Node v22 supported)
- **npm** (v9 or higher)

### 1. Installation

Install dependencies for both the server and client:

```bash
# In the project root:
cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment (Optional Fish Audio API Key)

Copy the sample environment file to create your local `.env`:

```bash
# In server/ directory:
cp .env.example .env
```

Open `server/.env` and insert your Fish Audio API Key (obtainable at [fish.audio](https://fish.audio)):

```env
PORT=5000
FISH_AUDIO_API_KEY=your_actual_fish_audio_api_key_here
FISH_AUDIO_BASE_URL=https://api.fish.audio
```

> **Note**: If you do not have a Fish Audio API key right now, **CharacterVerse will run seamlessly in intelligent preview mode**. You can upload PDFs, test all 4 modes, customize emotions, watch the audio visualizer, scrub the player, and click synced transcript sentences right away!

---

## 🏃 Running the Application

### Option A: Development Mode (Hot Reloading)

Run the backend and frontend in separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Server listens at http://localhost:5000
```

**Terminal 2 (Frontend with Vite):**
```bash
cd client
npm run dev
# Frontend live at http://localhost:5173
```

Open your browser to `http://localhost:5173`. Any changes you make to the React components will reload instantly.

### Option B: Production Mode (Unified Server)

Build the React frontend and let Express serve both the API and client from a single port:

```bash
# Build the client:
cd client
npm run build

# Start the unified server:
cd ../server
npm start
```

Now open `http://localhost:5000` in your browser.

---

## 🎧 Supported Experience Modes

| Mode | Description | Recommended Engine |
| :--- | :--- | :--- |
| **Audiobook** | Cinematic, balanced novel cadence for extended chapter listening without fatigue. | `Fish Audio S2.1 Pro` |
| **Dramatic Performance** | High emotional variance, dynamic character energy, theatrical pauses for BookTok romance & fantasy. | `Fish Audio Drama 3` |
| **Podcast Discussion** | Two-host conversational dialogue and banter cadence for reviews and plot twist breakdowns. | `Fish Audio S2.1 Pro` |
| **Teacher Narration** | Articulate, calm, didactic pacing crafted for students, essays, and educational materials. | `Fish Audio S2.1 Pro` |

---

## 🛡️ Security & Privacy Best Practices

1. **API Keys Never Exposed**: The Fish Audio API key is strictly stored on the server side in `server/.env` and read via `process.env.FISH_AUDIO_API_KEY`.
2. **Git Ignored**: `.gitignore` prevents `.env`, `node_modules`, and temporary files from ever being committed to source control.
3. **In-Memory Document Processing**: Uploaded PDF and text files are parsed in memory using `multer.memoryStorage()`, ensuring user documents are never permanently stored on unencrypted server disks.

---

## 📜 License
MIT License. Built with love for readers and storytellers everywhere.
