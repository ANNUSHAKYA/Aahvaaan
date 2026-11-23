import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useWeddingAudio Hook
 * Generates an ambient Indian classical wedding melody (Flute / Shehnai timbre + Tanpura drone)
 * using the browser's native Web Audio API. Zero external audio downloads, 100% offline-ready.
 */
export default function useWeddingAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const isRunningRef = useRef(false);
  const intervalRef = useRef(null);

  // Indian Classical Scale Frequencies (Raag Bhupali: Sa, Re, Ga, Pa, Dha, Sa')
  // Root tonic Sa = D4 (approx 293.66 Hz)
  const notes = [
    293.66, // Sa (D4)
    329.63, // Re (E4)
    369.99, // Ga (F#4)
    440.00, // Pa (A4)
    493.88, // Dha (B4)
    587.33, // Sa' (D5)
    493.88, // Dha
    440.00, // Pa
    369.99, // Ga
    329.63, // Re
  ];

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && masterGainRef.current) {
      try {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.suspend();
          }
        }, 300);
      } catch (err) {
        console.warn('Audio stop error:', err);
      }
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
        masterGain.connect(audioCtxRef.current.destination);
        masterGainRef.current = masterGain;
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      master.gain.setTargetAtTime(0.18, ctx.currentTime, 0.4);

      isRunningRef.current = true;
      setIsPlaying(true);

      // ─── 1. Tanpura Drone (Sa + Pa harmonics) ───
      const droneFreqs = [146.83, 220.0, 293.66]; // D3, A3, D4
      droneFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gain.gain.setValueAtTime(0.06 / (idx + 1), ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();

        // Slow vibrato/breathing on drone
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
      });

      // ─── 2. Bansuri / Shehnai Melodic Phrase Loop ───
      let step = 0;
      const playNextNote = () => {
        if (!isRunningRef.current || !audioCtxRef.current) return;
        const noteFreq = notes[step % notes.length];
        step++;

        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const noteFilter = ctx.createBiquadFilter();

        // Shehnai warmth: soft sawtooth + lowpass filter
        noteOsc.type = 'sawtooth';
        noteOsc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        // Flute/Shehnai portamento slide
        noteOsc.frequency.exponentialRampToValueAtTime(
          noteFreq * 1.005,
          ctx.currentTime + 0.6
        );

        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(1200, ctx.currentTime);
        noteFilter.Q.setValueAtTime(3, ctx.currentTime);

        // Attack - Sustain - Release envelope
        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        noteOsc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(master);

        noteOsc.start(now);
        noteOsc.stop(now + 1.15);
      };

      playNextNote();
      intervalRef.current = setInterval(playNextNote, 1200);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }, [notes]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isPlaying, start, stop, toggle };
}
