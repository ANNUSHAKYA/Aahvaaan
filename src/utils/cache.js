/**
 * Client-side caching for public invitation reads.
 * Provides instant sub-100ms render on repeat visits and slow 4G mobile networks.
 */

const memoryCache = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCachedInvitation(cacheKey) {
  if (!cacheKey) return null;

  // 1. Check in-memory cache first
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && Date.now() < memoryEntry.expiresAt) {
    return memoryEntry.data;
  }

  // 2. Check sessionStorage
  try {
    const raw = sessionStorage.getItem(`aahvaaan_inv_${cacheKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Date.now() < parsed.expiresAt) {
        // Hydrate memory cache
        memoryCache.set(cacheKey, parsed);
        return parsed.data;
      }
      sessionStorage.removeItem(`aahvaaan_inv_${cacheKey}`);
    }
  } catch {
    // ignore
  }

  return null;
}

export function setCachedInvitation(cacheKey, data, ttlMs = DEFAULT_TTL_MS) {
  if (!cacheKey || !data) return;

  const entry = {
    data,
    expiresAt: Date.now() + ttlMs,
  };

  memoryCache.set(cacheKey, entry);

  try {
    sessionStorage.setItem(`aahvaaan_inv_${cacheKey}`, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function clearInvitationCache(cacheKey) {
  if (cacheKey) {
    memoryCache.delete(cacheKey);
    try {
      sessionStorage.removeItem(`aahvaaan_inv_${cacheKey}`);
    } catch {
      // ignore
    }
  } else {
    memoryCache.clear();
  }
}
