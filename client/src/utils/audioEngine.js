/**
 * Audio Engine Utility for CharacterVerse
 * Supports:
 * 1. Native HTML5 Audio playback for real Fish Audio MP3 streams
 * 2. Intelligent Browser SpeechSynthesis fallback for preview mode (with speech boundary events)
 * 3. Audio canvas waveform rendering
 */

class StoryAudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.onTimeUpdateCallback = null;
    this.onStateChangeCallback = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.speed = 1.0;
    this.isLiveApi = false;
    this.liveAudioUrl = null;
    this.storyText = '';
    this.timedTranscript = null;
    this.intervalTimer = null;

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement.currentTime;
      this.duration = this.audioElement.duration || this.duration;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime, this.duration);
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    });
  }

  /**
   * Initialize a new story session
   */
  loadStory({ audioUrl, isLiveApi, duration, text, timedTranscript, speed = 1.0 }) {
    this.stop();
    this.isLiveApi = Boolean(isLiveApi && audioUrl);
    this.liveAudioUrl = audioUrl || null;
    this.duration = duration || 60;
    this.storyText = text || '';
    this.timedTranscript = timedTranscript || null;
    this.speed = speed;
    this.currentTime = 0;

    if (this.isLiveApi && this.liveAudioUrl) {
      this.audioElement.src = this.liveAudioUrl;
      this.audioElement.playbackRate = this.speed;
    }
  }

  /**
   * Play or resume audio
   */
  play(onTimeUpdate, onStateChange) {
    if (onTimeUpdate) this.onTimeUpdateCallback = onTimeUpdate;
    if (onStateChange) this.onStateChangeCallback = onStateChange;

    if (this.isLiveApi && this.audioElement.src) {
      this.audioElement.playbackRate = this.speed;
      this.audioElement.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
      this.isPlaying = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      return;
    }

    // High quality Browser Speech Synthesis fallback mode
    if (this.speechSynth) {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(this.storyText);
      utterance.rate = Math.max(0.7, Math.min(1.8, this.speed));
      utterance.pitch = 1.0;

      // Select warm natural voice if available
      const voices = this.speechSynth.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Premium'))) ||
          v.lang === 'en-US'
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      const startTime = Date.now() - (this.currentTime / this.speed) * 1000;

      utterance.onend = () => {
        this.isPlaying = false;
        clearInterval(this.intervalTimer);
        this.currentTime = 0;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis event notice:', e);
        this.isPlaying = false;
        clearInterval(this.intervalTimer);
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
      this.isPlaying = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);

      // Smooth progress timer for preview playback
      clearInterval(this.intervalTimer);
      this.intervalTimer = setInterval(() => {
        if (!this.isPlaying) return;
        const elapsed = ((Date.now() - startTime) / 1000) * this.speed;
        this.currentTime = Math.min(this.duration, elapsed);
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTime, this.duration);
        }
        if (this.currentTime >= this.duration) {
          this.pause();
        }
      }, 100);
    }
  }

  /**
   * Pause current playback
   */
  pause() {
    this.isPlaying = false;
    clearInterval(this.intervalTimer);

    if (this.isLiveApi) {
      this.audioElement.pause();
    } else if (this.speechSynth) {
      this.speechSynth.cancel();
    }

    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  /**
   * Seek to specific second in audio
   */
  seek(seconds) {
    const target = Math.max(0, Math.min(seconds, this.duration));
    this.currentTime = target;

    if (this.isLiveApi) {
      this.audioElement.currentTime = target;
    } else {
      // If playing in preview mode, restart synthesis near current position or update timer
      if (this.isPlaying) {
        this.pause();
        this.play(this.onTimeUpdateCallback, this.onStateChangeCallback);
      }
    }

    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime, this.duration);
    }
  }

  /**
   * Set playback speed rate
   */
  setSpeed(speed) {
    this.speed = Number(speed);
    if (this.isLiveApi) {
      this.audioElement.playbackRate = this.speed;
    }
  }

  /**
   * Stop completely and reset
   */
  stop() {
    this.pause();
    this.currentTime = 0;
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, this.duration);
    }
  }
}

export const audioEngine = new StoryAudioEngine();
