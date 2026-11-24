/**
 * Client-side rate limiter utility to prevent spam and flood requests.
 * Uses localStorage to persist action timestamps across page reloads.
 */

export function checkRateLimit(actionKey, maxAttempts = 5, windowMinutes = 10) {
  try {
    const key = `aahvaaan_rl_${actionKey}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const raw = localStorage.getItem(key);
    let attempts = raw ? JSON.parse(raw) : [];

    // Filter out attempts older than the window
    attempts = attempts.filter((ts) => now - ts < windowMs);

    if (attempts.length >= maxAttempts) {
      const oldestAttempt = Math.min(...attempts);
      const remainingMs = windowMs - (now - oldestAttempt);
      const remainingSec = Math.ceil(remainingMs / 1000);
      const remainingMin = Math.ceil(remainingSec / 60);

      return {
        allowed: false,
        remainingSec,
        remainingMin,
        error: `Rate limit reached. Please wait ${remainingMin} minute${remainingMin === 1 ? '' : 's'} before trying again.`,
      };
    }

    return { allowed: true, attemptsCount: attempts.length };
  } catch {
    // If localStorage unavailable, permit request
    return { allowed: true, attemptsCount: 0 };
  }
}

export function recordRateLimitAction(actionKey) {
  try {
    const key = `aahvaaan_rl_${actionKey}`;
    const now = Date.now();
    const raw = localStorage.getItem(key);
    let attempts = raw ? JSON.parse(raw) : [];

    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
  } catch {
    // ignore
  }
}
