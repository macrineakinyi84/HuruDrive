export const PLATFORM_NAME = 'Instagram';
export const PREFERENCE_STORAGE_KEY = 'igIdeaPreferenceWeights';
export const PROFILE_STORAGE_KEY = 'igIdeaGeneratorProfile';

export const NICHE_OPTIONS = [
  { value: 'wellness', label: 'Wellness' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

export const AUDIENCE_OPTIONS = [
  { value: 'gen-z', label: 'Gen Z (18-24)' },
  { value: 'young-professionals', label: 'Young Professionals' },
  { value: 'busy-parents', label: 'Busy Parents' },
  { value: 'creators', label: 'Aspiring Creators' },
];

export const GOAL_OPTIONS = [
  { value: 'engagement', label: 'Engagement' },
  { value: 'growth', label: 'Follower Growth' },
  { value: 'community', label: 'Community Building' },
  { value: 'conversions', label: 'Product or Service Sales' },
];

export const EFFORT_OPTIONS = [
  { value: 'low', label: 'Low effort (quick post)' },
  { value: 'medium', label: 'Medium effort' },
  { value: 'high', label: 'High effort (deep content)' },
];

const AUDIENCE_PROFILES = {
  'gen-z': {
    label: 'Gen Z',
    focus: 'quick wins and trends',
    preferredFormats: ['Reel', 'Story'],
    hashtag: '#genzcreators',
  },
  'young-professionals': {
    label: 'young professionals',
    focus: 'practical routines and time-saving tips',
    preferredFormats: ['Carousel', 'Reel'],
    hashtag: '#careerandcontent',
  },
  'busy-parents': {
    label: 'busy parents',
    focus: 'simple systems that reduce stress',
    preferredFormats: ['Carousel', 'Story'],
    hashtag: '#realparentlife',
  },
  creators: {
    label: 'aspiring creators',
    focus: 'repeatable frameworks and consistency',
    preferredFormats: ['Reel', 'Carousel'],
    hashtag: '#creatortipsdaily',
  },
};

const GOAL_CONTEXT = {
  engagement: {
    value: 'comments, shares, and saves',
    prompt: 'Ask the audience to comment with their own version.',
  },
  growth: {
    value: 'profile visits and follows',
    prompt: 'Include a follow CTA for the next part in a series.',
  },
  community: {
    value: 'meaningful conversations and trust',
    prompt: 'Invite stories and experiences in the comments.',
  },
  conversions: {
    value: 'DMs, link clicks, and offers',
    prompt: 'Close with a clear action that moves people to your offer.',
  },
};

const GOAL_HASHTAGS = {
  engagement: '#savethispost',
  growth: '#followformore',
  community: '#buildinpublic',
  conversions: '#shopnow',
};

const GOAL_FORMAT_BOOST = {
  engagement: {
    Reel: 14,
    Carousel: 12,
    Story: 10,
    'Single Post': 8,
    Live: 7,
  },
  growth: {
    Reel: 15,
    Carousel: 10,
    Story: 8,
    'Single Post': 7,
    Live: 6,
  },
  community: {
    Reel: 10,
    Carousel: 13,
    Story: 11,
    'Single Post': 9,
    Live: 12,
  },
  conversions: {
    Reel: 9,
    Carousel: 12,
    Story: 11,
    'Single Post': 10,
    Live: 8,
  },
};

const EFFORT_RANK = {
  low: 1,
  medium: 2,
  high: 3,
};

const FORMAT_EFFORT = {
  Story: 'low',
  'Single Post': 'low',
  Carousel: 'medium',
  Reel: 'medium',
  Live: 'high',
};

const FORMAT_POOL_BY_EFFORT = {
  low: ['Story', 'Single Post', 'Carousel'],
  medium: ['Reel', 'Carousel', 'Story', 'Single Post'],
  high: ['Reel', 'Carousel', 'Live', 'Story'],
};

const NICHE_RULES = {
  wellness: {
    themes: [
      '5-minute morning reset',
      'desk stretch routine for energy',
      'evening wind-down checklist',
      'hydration challenge for one week',
      'stress reset in under 2 minutes',
      'sleep quality habit stack',
      'mindful journaling prompts',
      'healthy routine for busy days',
    ],
    angles: [
      'beginner friendly',
      'do this not that',
      'day in my life',
      'common mistakes',
      'checklist format',
      'my weekly system',
      'realistic for busy schedules',
      'habit tracking approach',
    ],
    hashtags: [
      '#wellness',
      '#selfcare',
      '#healthyroutine',
      '#mindset',
      '#mentalwellness',
      '#wellnesstips',
    ],
  },
  fashion: {
    themes: [
      '3 ways to style one blazer',
      'capsule wardrobe starter guide',
      'budget-friendly outfit formulas',
      'color pairing cheat sheet',
      'work-to-weekend style transition',
      'accessory layering rules',
      'outfit planning for one week',
      'how to repeat outfits without looking repetitive',
    ],
    angles: [
      'before and after',
      'do this not that',
      'quick style challenge',
      'mistakes to avoid',
      'minimal pieces maximum looks',
      'closet organization framework',
      'trend adaptation',
      'confident styling system',
    ],
    hashtags: [
      '#fashiontips',
      '#styleinspo',
      '#outfitideas',
      '#capsulewardrobe',
      '#streetstyle',
      '#fashioncreator',
    ],
  },
  lifestyle: {
    themes: [
      'weekly reset routine',
      'realistic productivity habits',
      'meal prep for busy weeks',
      'home organization quick wins',
      'balanced creator schedule',
      'digital cleanup checklist',
      'self-management system',
      'simple weekend planning method',
    ],
    angles: [
      'systems over motivation',
      'what actually worked for me',
      'step-by-step framework',
      'mistakes and lessons',
      'checklist challenge',
      'time-saving routine',
      'minimal and practical',
      'progress not perfection',
    ],
    hashtags: [
      '#lifestylecreator',
      '#lifehacks',
      '#productivehabits',
      '#weeklyreset',
      '#organizedlife',
      '#lifestyletips',
    ],
  },
};

const HOOK_TEMPLATES = {
  engagement: [
    'If you are in {audience}, save this {theme} idea before your next post.',
    'Most people overcomplicate {theme}. Here is a simpler version.',
    'Comment "part 2" if you want a follow-up for this {theme}.',
    'Try this {theme} and tell me your result in 24 hours.',
  ],
  growth: [
    'I wish I knew this {theme} framework earlier.',
    'Steal this {theme} structure for your next Instagram post.',
    'This is how {audience} can build consistency with {theme}.',
    'Follow for daily ideas like this {theme} concept.',
  ],
  community: [
    'Real talk: {theme} is easier when we share what works.',
    'What is your biggest challenge with {theme}?',
    'I am sharing my honest process for {theme}.',
    'Drop your version of this {theme} below so we can learn together.',
  ],
  conversions: [
    'Use this {theme} post to warm up people before your offer.',
    'This {theme} angle can lead naturally into your product CTA.',
    'If you offer services, this is a strong {theme} post idea.',
    'Use this framework, then invite people to DM you for details.',
  ],
};

const FORMAT_STEPS = {
  Reel: [
    'Open with the hook in the first 2 seconds.',
    'Show 3 fast visuals that explain the core idea.',
    'End with a direct CTA and on-screen text.',
  ],
  Carousel: [
    'Slide 1: strong headline and problem statement.',
    'Slides 2-5: step-by-step value in short sentences.',
    'Last slide: CTA with next action.',
  ],
  Story: [
    'Story 1: quick context and problem.',
    'Story 2-3: one practical tip with visual proof.',
    'Story 4: poll, question sticker, or DM CTA.',
  ],
  'Single Post': [
    'Use one strong visual that reflects the topic.',
    'Write a value-first caption with one focused tip.',
    'End the caption with one action prompt.',
  ],
  Live: [
    'Announce the live topic 24 hours before.',
    'Teach one framework and answer live questions.',
    'Close with a clear next step offer or resource.',
  ],
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hashString(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toTitleCase(value) {
  return value
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function selectValue(value, options, fallback) {
  const allowedValues = options.map((option) => option.value);
  return allowedValues.includes(value) ? value : fallback;
}

function getAudienceProfile(audience) {
  return AUDIENCE_PROFILES[audience] ?? AUDIENCE_PROFILES['young-professionals'];
}

function buildHook(goal, audienceProfile, theme, index) {
  const goalHooks = HOOK_TEMPLATES[goal] ?? HOOK_TEMPLATES.engagement;
  const template = goalHooks[index % goalHooks.length];
  return template
    .replace('{audience}', audienceProfile.label)
    .replace('{theme}', theme);
}

function buildTitle(theme, angle, format) {
  return `${toTitleCase(theme)} (${angle}) - ${format}`;
}

function buildOutline(format, angle, audienceFocus) {
  const baseSteps = FORMAT_STEPS[format] ?? FORMAT_STEPS.Reel;
  return [
    baseSteps[0],
    `${baseSteps[1]} Keep it ${angle}.`,
    `${baseSteps[2]} Speak to ${audienceFocus}.`,
  ];
}

function buildCta(goal, audienceProfile) {
  if (goal === 'conversions') {
    return `Invite ${audienceProfile.label} to DM "PLAN" for your offer details.`;
  }

  if (goal === 'growth') {
    return 'Ask viewers to follow for a full content series.';
  }

  if (goal === 'community') {
    return 'Ask one open question and respond to early comments quickly.';
  }

  return 'Ask for a save or share to boost engagement.';
}

function getEffortFitScore(selectedEffort, format) {
  const selectedRank = EFFORT_RANK[selectedEffort] ?? EFFORT_RANK.medium;
  const formatRank = EFFORT_RANK[FORMAT_EFFORT[format] ?? 'medium'];
  const gap = Math.abs(selectedRank - formatRank);

  if (gap === 0) return 12;
  if (gap === 1) return 5;
  return -4;
}

function getAudienceFormatScore(audienceProfile, format) {
  return audienceProfile.preferredFormats.includes(format) ? 8 : 2;
}

function createHashtags(nicheRule, goal, audienceProfile, index) {
  const nicheTags = nicheRule.hashtags;
  const first = nicheTags[index % nicheTags.length];
  const second = nicheTags[(index + 2) % nicheTags.length];
  const third = nicheTags[(index + 4) % nicheTags.length];
  return [first, second, third, GOAL_HASHTAGS[goal], audienceProfile.hashtag];
}

function normalizePreferenceWeights(preferenceWeights) {
  if (!preferenceWeights || typeof preferenceWeights !== 'object') {
    return {};
  }

  const normalized = {};
  Object.entries(preferenceWeights).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      normalized[key] = clamp(value, -20, 20);
    }
  });

  return normalized;
}

export function loadPreferenceWeights() {
  if (typeof window === 'undefined') return {};

  try {
    const rawValue = window.localStorage.getItem(PREFERENCE_STORAGE_KEY);
    if (!rawValue) return {};

    return normalizePreferenceWeights(JSON.parse(rawValue));
  } catch (error) {
    return {};
  }
}

export function savePreferenceWeights(weights) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(normalizePreferenceWeights(weights)));
}

export function clearPreferenceWeights() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREFERENCE_STORAGE_KEY);
}

export function loadSavedProfile(defaultProfile) {
  if (typeof window === 'undefined') return defaultProfile;

  try {
    const rawValue = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!rawValue) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(rawValue) };
  } catch (error) {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function generateInstagramIdeas(input, preferenceWeights = {}) {
  const niche = selectValue(input.niche, NICHE_OPTIONS, 'wellness');
  const audience = selectValue(input.audience, AUDIENCE_OPTIONS, 'young-professionals');
  const goal = selectValue(input.goal, GOAL_OPTIONS, 'engagement');
  const effort = selectValue(input.effort, EFFORT_OPTIONS, 'medium');
  const count = clamp(Number(input.ideaCount) || 6, 3, 12);

  const nicheRule = NICHE_RULES[niche];
  const audienceProfile = getAudienceProfile(audience);
  const formatPool = FORMAT_POOL_BY_EFFORT[effort];
  const weights = normalizePreferenceWeights(preferenceWeights);
  const generated = [];
  const candidateCount = Math.max(count * 3, 15);

  for (let index = 0; index < candidateCount; index += 1) {
    const theme = nicheRule.themes[index % nicheRule.themes.length];
    const angle = nicheRule.angles[(index + 1) % nicheRule.angles.length];
    const format = formatPool[index % formatPool.length];
    const hook = buildHook(goal, audienceProfile, theme, index);
    const preferenceKey = `${niche}|${format}|${goal}`;

    const baseScore = 58;
    const goalBoost = GOAL_FORMAT_BOOST[goal]?.[format] ?? 5;
    const effortBoost = getEffortFitScore(effort, format);
    const audienceBoost = getAudienceFormatScore(audienceProfile, format);
    const preferenceBoost = weights[preferenceKey] ?? 0;
    const deterministicJitter = (hashString(`${theme}|${format}|${goal}`) % 7) - 3;
    const score = clamp(
      Math.round(baseScore + goalBoost + effortBoost + audienceBoost + preferenceBoost + deterministicJitter),
      35,
      99,
    );

    generated.push({
      id: `${niche}-${hashString(`${theme}-${format}-${index}`)}`,
      platform: PLATFORM_NAME,
      niche,
      format,
      effortLevel: FORMAT_EFFORT[format] ?? 'medium',
      matchScore: score,
      title: buildTitle(theme, angle, format),
      hook,
      outline: buildOutline(format, angle, audienceProfile.focus),
      cta: buildCta(goal, audienceProfile),
      hashtags: createHashtags(nicheRule, goal, audienceProfile, index),
      reasoning: `${format} is ranked high for ${GOAL_CONTEXT[goal].value}. ${GOAL_CONTEXT[goal].prompt}`,
      preferenceKey,
    });
  }

  const uniqueByTitle = Array.from(
    new Map(generated.map((idea) => [idea.title, idea])).values(),
  );

  return uniqueByTitle.sort((left, right) => right.matchScore - left.matchScore).slice(0, count);
}
