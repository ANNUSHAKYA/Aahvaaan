import { useState, useEffect, useRef, useCallback } from 'react';

const SESSION_MUTE_KEY = 'aahvaaan_music_muted';

/**
 * useRealWeddingAudio
 * Real HTML5 Audio controller with:
 * - Smooth volume fade-in on "Tap to open"
 * - Smooth volume fade-out on mute
 * - Tab visibility change listener (pauses in background, resumes when active)
 * - SessionStorage persistence for mute preference
 * - Resilient error handling (graceful fallback silence if file missing)
 */
export default function useRealWeddingAudio(audioUrl, enabled = true) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const wasPlayingBeforeTabHide = useRef(false);

  // Initialize Audio instance
  useEffect(() => {
    if (!enabled || !audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const audio = new Audio();
    audio.src = audioUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;

    // Graceful error trap
    audio.addEventListener('error', (e) => {
      console.warn('Notice: Background wedding audio file not found or unsupported. Running silent mode.', e?.message || '');
      setIsPlaying(false);
    });

    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, enabled]);

  // Handle Tab Visibility (Pause on background, resume on active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingBeforeTabHide.current = true;
          audio.pause();
          setIsPlaying(false);
        } else {
          wasPlayingBeforeTabHide.current = false;
        }
      } else {
        if (wasPlayingBeforeTabHide.current && !isMuted) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMuted]);

  // Smooth fade utility
  const fadeTo = useCallback((targetVol, durationMs = 800, callback) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const stepMs = 40;
    const steps = Math.max(1, Math.floor(durationMs / stepMs));
    const startVol = audio.volume;
    const diff = targetVol - startVol;
    let stepCount = 0;

    fadeIntervalRef.current = setInterval(() => {
      stepCount++;
      const current = Math.min(1, Math.max(0, startVol + (diff * (stepCount / steps))));
      if (audio) audio.volume = current;

      if (stepCount >= steps) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (audio) audio.volume = targetVol;
        if (callback) callback();
      }
    }, stepMs);
  }, []);

  // Triggered on user interaction ("Tap to open")
  const startMusic = useCallback(() => {
    if (!enabled || !audioRef.current) return;
    const audio = audioRef.current;

    if (isMuted) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play notice (browser policy):', err?.message);
      });
      return;
    }

    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
        fadeTo(0.48, 1400); // Gentle fade in to 48% volume
      }).catch((err) => {
        console.warn('Audio play notice:', err?.message);
      });
    }
  }, [enabled, isMuted, fadeTo]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmuting: Fade in
      setIsMuted(false);
      try { sessionStorage.setItem(SESSION_MUTE_KEY, 'false'); } catch {}
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          fadeTo(0.48, 600);
        }).catch(() => {});
      } else {
        fadeTo(0.48, 600);
        setIsPlaying(true);
      }
    } else {
      // Muting: Fade out smoothly
      setIsMuted(true);
      try { sessionStorage.setItem(SESSION_MUTE_KEY, 'true'); } catch {}
      fadeTo(0, 400, () => {
        // Keep playing silently or pause
        audio.volume = 0;
      });
    }
  }, [isMuted, fadeTo]);

  return {
    isPlaying,
    isMuted,
    startMusic,
    toggleMute,
  };
}
