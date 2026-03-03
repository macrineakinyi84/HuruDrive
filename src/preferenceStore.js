const STORAGE_KEY = 'ai-content-idea-generator-preferences-v1';

function createEmptyPreferences() {
  return {
    version: 1,
    totalFeedback: 0,
    updatedAt: null,
    byPlatform: {},
    byFormat: {},
    byGoal: {},
    byAngle: {},
  };
}

function sanitizeBucket(bucketValue) {
  if (!bucketValue || typeof bucketValue !== 'object') {
    return {};
  }

  const sanitized = {};
  Object.entries(bucketValue).forEach(([key, stats]) => {
    if (!stats || typeof stats !== 'object') {
      return;
    }

    const likes = Number.isFinite(stats.likes) ? Math.max(0, stats.likes) : 0;
    const dislikes = Number.isFinite(stats.dislikes)
      ? Math.max(0, stats.dislikes)
      : 0;

    sanitized[key] = { likes, dislikes };
  });

  return sanitized;
}

function normalizePreferences(rawPreferences) {
  const defaults = createEmptyPreferences();
  if (!rawPreferences || typeof rawPreferences !== 'object') {
    return defaults;
  }

  return {
    version: 1,
    totalFeedback: Number.isFinite(rawPreferences.totalFeedback)
      ? Math.max(0, rawPreferences.totalFeedback)
      : 0,
    updatedAt:
      typeof rawPreferences.updatedAt === 'string'
        ? rawPreferences.updatedAt
        : null,
    byPlatform: sanitizeBucket(rawPreferences.byPlatform),
    byFormat: sanitizeBucket(rawPreferences.byFormat),
    byGoal: sanitizeBucket(rawPreferences.byGoal),
    byAngle: sanitizeBucket(rawPreferences.byAngle),
  };
}

export function loadPreferences() {
  if (typeof window === 'undefined') {
    return createEmptyPreferences();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createEmptyPreferences();
    }

    return normalizePreferences(JSON.parse(stored));
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return createEmptyPreferences();
  }
}

export function savePreferences(preferences) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const normalized = normalizePreferences(preferences);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn('Failed to save preferences:', error);
  }
}

function updateBucket(bucket, key, liked) {
  if (!key) {
    return;
  }

  const current = bucket[key] || { likes: 0, dislikes: 0 };
  bucket[key] = {
    likes: current.likes + (liked ? 1 : 0),
    dislikes: current.dislikes + (liked ? 0 : 1),
  };
}

export function recordFeedback(preferences, keys, liked) {
  const nextPreferences = normalizePreferences(preferences);
  const normalizedLiked = Boolean(liked);

  updateBucket(nextPreferences.byPlatform, keys?.platform, normalizedLiked);
  updateBucket(nextPreferences.byFormat, keys?.format, normalizedLiked);
  updateBucket(nextPreferences.byGoal, keys?.goal, normalizedLiked);
  updateBucket(nextPreferences.byAngle, keys?.angle, normalizedLiked);

  nextPreferences.totalFeedback += 1;
  nextPreferences.updatedAt = new Date().toISOString();

  return nextPreferences;
}

function signalFromStats(stats) {
  const likes = stats?.likes || 0;
  const dislikes = stats?.dislikes || 0;
  const total = likes + dislikes;

  if (total === 0) {
    return 0;
  }

  // Signal strength scales as confidence grows with more feedback.
  const confidence = Math.min(1, total / 6);
  return ((likes - dislikes) / total) * confidence;
}

export function getPreferenceBoost(preferences, keys) {
  const normalized = normalizePreferences(preferences);

  const platformSignal = signalFromStats(normalized.byPlatform[keys?.platform]);
  const formatSignal = signalFromStats(normalized.byFormat[keys?.format]);
  const goalSignal = signalFromStats(normalized.byGoal[keys?.goal]);
  const angleSignal = signalFromStats(normalized.byAngle[keys?.angle]);

  const boost =
    platformSignal * 4 +
    formatSignal * 8 +
    goalSignal * 5 +
    angleSignal * 7;

  return Math.round(boost);
}

function sortBucket(bucket) {
  return Object.entries(bucket)
    .map(([name, stats]) => {
      const likes = stats?.likes || 0;
      const dislikes = stats?.dislikes || 0;
      const total = likes + dislikes;
      return {
        name,
        likes,
        dislikes,
        total,
        net: likes - dislikes,
      };
    })
    .sort((a, b) => {
      if (b.net !== a.net) {
        return b.net - a.net;
      }

      return b.total - a.total;
    });
}

export function getPreferenceInsights(preferences) {
  const normalized = normalizePreferences(preferences);
  const formatSignals = sortBucket(normalized.byFormat);
  const angleSignals = sortBucket(normalized.byAngle);
  const platformSignals = sortBucket(normalized.byPlatform);
  const goalSignals = sortBucket(normalized.byGoal);

  return {
    totalFeedback: normalized.totalFeedback,
    updatedAt: normalized.updatedAt,
    topFormat: formatSignals[0] || null,
    topAngle: angleSignals[0] || null,
    topPlatform: platformSignals[0] || null,
    topGoal: goalSignals[0] || null,
  };
}

export function resetPreferences() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return createEmptyPreferences();
}
