'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Music, Play, Pause, Volume2, VolumeX, Check, Sparkles,
  Search, Upload, Trash2, Loader2, Disc3, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  MUSIC_CATEGORIES,
  STARTER_MUSIC_TRACKS,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_SIZE_BYTES,
  formatDuration,
} from '@/lib/music/constants';

export default function MusicLibraryStep({ data, onChange, invitationId }) {
  const [tracks, setTracks] = useState(STARTER_MUSIC_TRACKS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [activeMode, setActiveMode] = useState(
    data.music_meta?.source === 'custom' ? 'custom' : 'library'
  );

  // Unified Audio Player State (single audio instance -> only 1 plays at a time)
  const audioRef = useRef(null);
  const [playingTrack, setPlayingTrack] = useState(null); // { id, title, artist, audio_url, cover_url }
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [audioError, setAudioError] = useState('');

  // Custom Upload State
  const fileRef = useRef(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(
    Boolean(data.music_meta?.source === 'custom' && data.music_meta?.rights_confirmed)
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadLibrary() {
      setLoading(true);
      setLoadError('');
      try {
        const res = await fetch('/api/music');
        const json = await res.json();
        if (!cancelled && Array.isArray(json.tracks)) {
          setTracks(json.tracks);
        }
      } catch {
        if (!cancelled) setLoadError('Could not refresh music library; showing starter tracks.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLibrary();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  function startOrTogglePlay(track) {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioError('');

    if (playingTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => setAudioError('Unable to play this track.'));
      }
      return;
    }

    // Stop previous track cleanly and switch
    audio.pause();
    audio.src = track.audio_url;
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(track.duration_seconds || 0);
    setPlayingTrack(track);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        setAudioError('Unable to play this audio file.');
      });
  }

  function handleSeek(e) {
    const nextTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
    setCurrentTime(nextTime);
  }

  function selectLibraryTrack(track) {
    onChange({
      ...data,
      music_choice: track.id,
      music_meta: {
        source: 'library',
        track_id: track.id,
        title: track.title,
        artist: track.artist || '',
        movie_or_album: track.movie_or_album || '',
        category: track.category,
        audio_url: track.audio_url,
        cover_url: track.cover_url || null,
        duration_seconds: track.duration_seconds || 0,
        rights_confirmed: true,
      },
    });
  }

  async function handleCustomFile(file) {
    if (!file) return;
    setUploadError('');

    if (!rightsConfirmed) {
      setUploadError('Please tick the rights confirmation checkbox before uploading.');
      return;
    }

    const ext = file.name?.split('.').pop()?.toLowerCase() || '';
    const validExt = ['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext);
    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !validExt) {
      setUploadError('Supported formats: MP3, M4A, WAV, OGG, or AAC.');
      return;
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      setUploadError('Audio file must be 10 MB or smaller.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/invitations/${invitationId}/music`);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) resolve(json);
            else reject(new Error(json.error || 'Upload failed'));
          } catch {
            reject(new Error('Invalid upload response'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));

        const form = new FormData();
        form.append('file', file);
        form.append('rightsConfirmed', String(rightsConfirmed));
        xhr.send(form);
      });

      const cleanTitle = file.name.replace(/\.[^.]+$/, '');
      onChange({
        ...data,
        music_choice: 'custom',
        music_meta: {
          source: 'custom',
          track_id: 'custom',
          title: cleanTitle,
          artist: 'Custom Upload',
          movie_or_album: 'Personal Audio',
          category: 'Custom Upload',
          audio_url: result.signedUrl || result.path,
          storage_path: result.path,
          cover_url: null,
          duration_seconds: 0,
          rights_confirmed: true,
        },
      });
    } catch (err) {
      setUploadError(err.message || 'Could not upload audio.');
    } finally {
      setUploading(false);
    }
  }

  async function removeCustomAudio() {
    const path = data.music_meta?.storage_path;
    if (playingTrack?.id === 'custom' && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingTrack(null);
    }
    onChange({
      ...data,
      music_choice: '',
      music_meta: null,
    });
    if (path) {
      await fetch(`/api/invitations/${invitationId}/music`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      }).catch(() => {});
    }
  }

  const filteredTracks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tracks.filter((t) => {
      if (activeCategory === 'Featured' && !t.is_featured) return false;
      if (
        activeCategory !== 'All' &&
        activeCategory !== 'Featured' &&
        t.category !== activeCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        t.movie_or_album?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    });
  }, [tracks, activeCategory, search]);

  const selectedCustom = data.music_meta?.source === 'custom' ? data.music_meta : null;

  return (
    <div className="space-y-5">
      {/* Hidden unified audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setAudioError('Audio file could not be loaded.');
        }}
      />

      {/* Top Mode Switcher: Library vs Custom Upload */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-sm border border-stone-200 bg-stone-50 p-1">
          <button
            type="button"
            onClick={() => setActiveMode('library')}
            className={`inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-medium transition ${
              activeMode === 'library'
                ? 'bg-[#0E4D4F] text-white'
                : 'text-stone-600 hover:text-[#0E4D4F]'
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            Wedding Music Library
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('custom')}
            className={`inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-medium transition ${
              activeMode === 'custom'
                ? 'bg-[#0E4D4F] text-white'
                : 'text-stone-600 hover:text-[#0E4D4F]'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Your Own
          </button>
        </div>

        {data.music_meta?.title && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B69A70]/60 bg-[#FAF4E8] px-3 py-1 text-xs font-medium text-[#0E4D4F]">
            <Check className="h-3.5 w-3.5 text-emerald-700" />
            Selected: {data.music_meta.title}
          </div>
        )}
      </div>

      {/* Unified Sticky Mini Player when a track is loaded */}
      {playingTrack && (
        <div className="rounded-xl border border-[#B69A70]/60 bg-gradient-to-r from-[#0E4D4F] to-[#174243] p-4 text-[#FAF7F2] shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => startOrTogglePlay(playingTrack)}
                aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B69A70] text-[#0E4D4F] shadow transition hover:scale-105"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{playingTrack.title}</p>
                <p className="truncate text-xs text-[#E3D3AE]">
                  {playingTrack.artist || 'Wedding Melody'}
                </p>
              </div>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="text-[#E3D3AE] hover:text-white"
              >
                {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setMuted(false);
                  setVolume(Number(e.target.value));
                }}
                aria-label="Volume"
                className="w-16 sm:w-20 accent-[#B69A70]"
              />
            </div>
          </div>

          {/* Progress bar + timestamps */}
          <div className="mt-3 flex items-center gap-2.5 text-[11px] text-[#E3D3AE]">
            <span className="w-9 text-right tabular-nums">{formatDuration(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={1}
              value={Math.min(currentTime, duration || 1)}
              onChange={handleSeek}
              aria-label="Seek audio"
              className="flex-1 accent-[#B69A70]"
            />
            <span className="w-9 tabular-nums">{formatDuration(duration)}</span>
          </div>
          {audioError && <p className="mt-2 text-xs text-rose-200">{audioError}</p>}
        </div>
      )}

      {/* ─── LIBRARY MODE ─── */}
      {activeMode === 'library' && (
        <div className="space-y-4">
          {/* Search + Category Filter Tabs */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by song, artist, movie, or mood…"
              className="w-full rounded-sm border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-stone-800 focus:border-[#0E4D4F] focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['All', 'Featured', ...MUSIC_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                  activeCategory === cat
                    ? 'bg-[#0E4D4F] text-white'
                    : 'border border-stone-200 bg-stone-50 text-stone-600 hover:border-[#B69A70]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadError && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
              {loadError}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-stone-500 gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading music library…
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="rounded-sm border border-dashed border-stone-300 py-10 text-center text-sm text-stone-500">
              No tracks match this filter yet. Try another category or upload your own track.
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredTracks.map((track) => {
                const isSelected = data.music_choice === track.id;
                const isThisPlaying = playingTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition ${
                      isSelected
                        ? 'border-[#0E4D4F] bg-[#0E4D4F]/5 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-[#B69A70]/70'
                    }`}
                  >
                    {/* Cover art */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#B69A70]/40 bg-gradient-to-br from-[#0E4D4F] to-[#1D5D5F] flex items-center justify-center text-[#E3D3AE]">
                      {track.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={track.cover_url}
                          alt={track.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Disc3 className={`h-6 w-6 ${isThisPlaying ? 'animate-spin' : ''}`} />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="truncate text-sm font-semibold text-[#0E4D4F]">
                          {track.title}
                        </h3>
                        {track.is_featured && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FAF4E8] border border-[#B69A70]/50 px-2 py-0.5 text-[10px] font-semibold text-[#96752d]">
                            <Sparkles className="h-2.5 w-2.5" /> Popular
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-stone-500 mt-0.5">
                        {[track.artist, track.movie_or_album].filter(Boolean).join(' · ') || 'Wedding Track'}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
                        <span className="rounded bg-stone-100 px-1.5 py-0.5 text-stone-600">
                          {track.category}
                        </span>
                        <span className="tabular-nums">{formatDuration(track.duration_seconds)}</span>
                      </div>
                    </div>

                    {/* Preview + Select actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startOrTogglePlay(track)}
                        aria-label={isThisPlaying ? `Pause ${track.title}` : `Preview ${track.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-700 hover:border-[#0E4D4F] hover:text-[#0E4D4F] transition"
                      >
                        {isThisPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => selectLibraryTrack(track)}
                        className={`inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? 'bg-[#0E4D4F] text-white'
                            : 'border border-[#0E4D4F] text-[#0E4D4F] hover:bg-[#0E4D4F] hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── CUSTOM UPLOAD MODE ─── */}
      {activeMode === 'custom' && (
        <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-5">
          <div>
            <h3 className="text-sm font-semibold text-[#0E4D4F]">Upload Your Own Wedding Music</h3>
            <p className="mt-1 text-xs text-stone-500">
              Upload an MP3, M4A, WAV, OGG, or AAC file (max 10 MB) for your digital invitation.
            </p>
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={rightsConfirmed}
              onChange={(e) => setRightsConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#0E4D4F]"
            />
            <span>
              I confirm that I own this recording or hold the necessary rights/license to use it in my digital wedding invitation.
            </span>
          </label>

          {selectedCustom ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#0E4D4F]/30 bg-white p-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    startOrTogglePlay({
                      id: 'custom',
                      title: selectedCustom.title || 'Custom Music',
                      artist: 'Custom Upload',
                      audio_url: selectedCustom.audio_url,
                      duration_seconds: selectedCustom.duration_seconds || 0,
                    })
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E4D4F] text-white"
                >
                  {playingTrack?.id === 'custom' && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0E4D4F]">
                    {selectedCustom.title}
                  </p>
                  <p className="text-xs text-emerald-700">Uploaded &amp; selected ✓</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-sm border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  <RefreshCw className="h-3 w-3" /> Replace
                </button>
                <button
                  type="button"
                  onClick={removeCustomAudio}
                  className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleCustomFile(e.dataTransfer.files?.[0]);
              }}
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-stone-300 bg-white py-10 text-center hover:border-[#0E4D4F] transition"
            >
              <Upload className="mb-2 h-8 w-8 text-[#B69A70]" />
              <p className="text-sm font-medium text-stone-700">Click or drop an audio file here</p>
              <p className="mt-1 text-xs text-stone-400">MP3, M4A, WAV, OGG, AAC · Max 10 MB</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.m4a,.wav,.ogg,.aac,audio/*"
            className="hidden"
            onChange={(e) => {
              handleCustomFile(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Uploading audio…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full bg-[#0E4D4F] transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
