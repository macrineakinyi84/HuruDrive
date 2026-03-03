import { getPreferenceBoost } from './preferenceStore';

export const PLATFORM_OPTIONS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'X',
  'Facebook',
];

export const GOAL_OPTIONS = [
  'Engagement',
  'Growth',
  'Monetization',
  'Education',
  'Brand Awareness',
];

export const EFFORT_OPTIONS = ['Low', 'Medium', 'High'];

const EFFORT_LEVELS = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const PLATFORM_RULES = {
  Instagram: {
    formats: [
      { name: 'Reel', family: 'shortVideo' },
      { name: 'Carousel', family: 'carousel' },
      { name: 'Story Sequence', family: 'story' },
    ],
    strategy: 'Lead with visual contrast in the first 2 seconds.',
  },
  TikTok: {
    formats: [
      { name: 'Short Video', family: 'shortVideo' },
      { name: 'Reply Video', family: 'replyVideo' },
      { name: 'Live Prompt', family: 'live' },
    ],
    strategy: 'Use a strong hook, fast pace, and quick payoff.',
  },
  YouTube: {
    formats: [
      { name: 'Shorts', family: 'shortVideo' },
      { name: 'Long Video', family: 'longVideo' },
      { name: 'Community Post', family: 'text' },
    ],
    strategy: 'Promise a clear outcome and show proof quickly.',
  },
  LinkedIn: {
    formats: [
      { name: 'Text Post', family: 'text' },
      { name: 'Document Carousel', family: 'carousel' },
      { name: 'Thought Video', family: 'longVideo' },
    ],
    strategy: 'Anchor the post with insight, credibility, and a takeaway.',
  },
  X: {
    formats: [
      { name: 'Thread', family: 'thread' },
      { name: 'Single Post', family: 'text' },
      { name: 'Quick Clip', family: 'shortVideo' },
    ],
    strategy: 'Open with a bold statement and keep each line punchy.',
  },
  Facebook: {
    formats: [
      { name: 'Short Video', family: 'shortVideo' },
      { name: 'Community Post', family: 'text' },
      { name: 'Live Session', family: 'live' },
    ],
    strategy: 'Use relatable storytelling and ask for audience opinions.',
  },
};

const GOAL_TO_CTA = {
  Engagement: [
    'Ask your audience to share their experience in comments.',
    'End with a simple question to spark discussion.',
  ],
  Growth: [
    'Invite viewers to follow for the next part.',
    'Mention what they will gain by following your series.',
  ],
  Monetization: [
    'Add a soft call to action to your offer or link in bio.',
    'Invite qualified leads to DM you with a keyword.',
  ],
  Education: [
    'Invite people to save the post for later practice.',
    'Prompt viewers to comment with what they want next.',
  ],
  'Brand Awareness': [
    'Tie your perspective to your signature framework.',
    'Ask viewers to tag someone who needs this insight.',
  ],
};

const IDEA_TEMPLATES = [
  {
    id: 'quick-win-framework',
    angle: 'Quick Win Framework',
    families: ['shortVideo', 'carousel', 'thread', 'text'],
    goals: ['Engagement', 'Growth', 'Education'],
    audienceKeywords: ['beginner', 'new', 'student', 'starter'],
    minEffort: 1,
    maxEffort: 2,
    recommendedEffort: 1,
    hookTemplates: [
      'Most people in {audience} overcomplicate {niche}. Try this instead.',
      'If your {audience} wants faster progress in {niche}, start here.',
      'One small change in {niche} can save your audience hours every week.',
    ],
    titleTemplates: [
      'A 3-step {niche} quick win your {audience} can use today',
      'Simple {niche} framework for {audience}',
      'Start-to-finish mini playbook for {audience} in {niche}',
    ],
    executionTemplates: [
      'Break the idea into 3 short steps, each with one clear action.',
      'Demonstrate one practical before/after result using your own example.',
      'Close with a mini checklist viewers can screenshot and apply.',
    ],
  },
  {
    id: 'myth-vs-reality',
    angle: 'Myth vs Reality',
    families: ['carousel', 'text', 'thread', 'longVideo'],
    goals: ['Engagement', 'Brand Awareness', 'Education'],
    audienceKeywords: ['professional', 'founder', 'creator', 'marketer'],
    minEffort: 1,
    maxEffort: 3,
    recommendedEffort: 2,
    hookTemplates: [
      'A common myth in {niche} is holding {audience} back.',
      'What people assume about {niche} is often wrong. Here is the truth.',
      'The biggest misconception your {audience} hears about {niche}.',
    ],
    titleTemplates: [
      '{niche}: myth vs reality for {audience}',
      'What your {audience} thinks about {niche} (and what actually works)',
      'The {niche} belief that is costing your audience results',
    ],
    executionTemplates: [
      'Present 3 myths, then replace each with a practical reality.',
      'Use one mini case study that supports your viewpoint.',
      'Finish with a decision rule your audience can apply immediately.',
    ],
  },
  {
    id: 'case-study-breakdown',
    angle: 'Case Study Breakdown',
    families: ['longVideo', 'carousel', 'thread', 'text'],
    goals: ['Monetization', 'Brand Awareness', 'Education'],
    audienceKeywords: ['business', 'client', 'founder', 'manager'],
    minEffort: 2,
    maxEffort: 3,
    recommendedEffort: 3,
    hookTemplates: [
      'Here is how one {audience} solved a major {niche} challenge.',
      'A real {niche} result breakdown your audience can copy.',
      'From problem to outcome: a {niche} case study for {audience}.',
    ],
    titleTemplates: [
      '{niche} case study: what worked and why',
      'How this {audience} improved results in {niche}',
      'A practical {niche} success breakdown',
    ],
    executionTemplates: [
      'Show context, challenge, action, and measurable outcome.',
      'Add one slide/segment about mistakes avoided during execution.',
      'Wrap up with a reusable framework and offer deeper help.',
    ],
  },
  {
    id: 'behind-the-scenes',
    angle: 'Behind the Scenes',
    families: ['shortVideo', 'story', 'longVideo', 'live'],
    goals: ['Engagement', 'Brand Awareness', 'Growth'],
    audienceKeywords: ['creator', 'team', 'community'],
    minEffort: 1,
    maxEffort: 3,
    recommendedEffort: 2,
    hookTemplates: [
      'A behind-the-scenes look at how I plan {niche} content.',
      'What really happens before a successful {niche} post goes live.',
      'My process for creating consistent {niche} content for {audience}.',
    ],
    titleTemplates: [
      'Behind the scenes: my {niche} creation workflow',
      'How I plan weekly {niche} content for {audience}',
      'Inside my {niche} system from idea to publish',
    ],
    executionTemplates: [
      'Record your planning board and explain your decision criteria.',
      'Highlight one shortcut and one quality-control step.',
      'Ask your audience which part of your process they want next.',
    ],
  },
  {
    id: 'mistakes-and-fixes',
    angle: 'Mistakes and Fixes',
    families: ['shortVideo', 'text', 'thread', 'carousel'],
    goals: ['Engagement', 'Education', 'Growth'],
    audienceKeywords: ['beginner', 'student', 'small business', 'new'],
    minEffort: 1,
    maxEffort: 2,
    recommendedEffort: 1,
    hookTemplates: [
      '3 mistakes your {audience} makes in {niche} and how to fix them.',
      'If your {audience} is stuck in {niche}, these mistakes might be why.',
      'Most people in {niche} repeat these errors. Do this instead.',
    ],
    titleTemplates: [
      '{niche}: common mistakes and better alternatives',
      'Stop doing this in {niche} (especially if you are {audience})',
      'Quick fixes for recurring {niche} mistakes',
    ],
    executionTemplates: [
      'Share each mistake with one concrete correction step.',
      'Use one screenshot/example to show the correct version.',
      'End with a one-line recap: do this, avoid that.',
    ],
  },
  {
    id: 'audience-challenge',
    angle: 'Audience Challenge',
    families: ['story', 'live', 'shortVideo', 'text'],
    goals: ['Engagement', 'Growth', 'Brand Awareness'],
    audienceKeywords: ['community', 'followers', 'fans', 'members'],
    minEffort: 1,
    maxEffort: 2,
    recommendedEffort: 2,
    hookTemplates: [
      'A 5-day {niche} challenge for your {audience}.',
      'Invite your {audience} to try this mini {niche} challenge.',
      'Turn {niche} into a challenge your audience can complete this week.',
    ],
    titleTemplates: [
      '{niche} challenge your audience will want to join',
      'Run a community challenge around {niche}',
      'A simple challenge to activate your {audience}',
    ],
    executionTemplates: [
      'Define one measurable action per day and one check-in hashtag.',
      'Post daily reminders and celebrate participant progress.',
      'Compile audience submissions into a recap post at the end.',
    ],
  },
  {
    id: 'tool-stack',
    angle: 'Tool Stack Breakdown',
    families: ['carousel', 'longVideo', 'text', 'thread'],
    goals: ['Education', 'Monetization', 'Brand Awareness'],
    audienceKeywords: ['professional', 'creator', 'founder', 'manager'],
    minEffort: 2,
    maxEffort: 3,
    recommendedEffort: 2,
    hookTemplates: [
      'The exact tool stack I use for {niche} and why it works.',
      'A realistic {niche} toolkit for {audience} at different budgets.',
      'If your {audience} wants better {niche} outputs, start with these tools.',
    ],
    titleTemplates: [
      '{niche} tool stack breakdown for {audience}',
      'Best tools to improve {niche} execution',
      'A practical toolkit for {audience} in {niche}',
    ],
    executionTemplates: [
      'Categorize tools by planning, production, and analytics.',
      'Explain one use-case and one caveat for each tool.',
      'Include a budget tier recommendation: free, mid, premium.',
    ],
  },
  {
    id: 'qa-response',
    angle: 'Q&A Response',
    families: ['replyVideo', 'shortVideo', 'text', 'live'],
    goals: ['Engagement', 'Growth', 'Education'],
    audienceKeywords: ['community', 'followers', 'clients'],
    minEffort: 1,
    maxEffort: 2,
    recommendedEffort: 1,
    hookTemplates: [
      'A question from my {audience}: "{niche}?" Here is my answer.',
      'You asked about {niche}, so here is a direct breakdown.',
      'Let us solve one common {niche} question in under a minute.',
    ],
    titleTemplates: [
      'Answering audience questions on {niche}',
      'Quick Q&A: your {niche} question, my practical answer',
      'Top audience question in {niche} this week',
    ],
    executionTemplates: [
      'Quote a real audience question, then answer in 3 practical points.',
      'Mention one common misunderstanding and clarify it quickly.',
      'Invite the next question to build a recurring series.',
    ],
  },
];

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickBySeed(items, seed, token) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  const index = hashString(`${seed}-${token}`) % items.length;
  return items[index];
}

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || '');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function audienceSuitabilityScore(template, audience) {
  const audienceLower = audience.toLowerCase();
  const hasStrongMatch = template.audienceKeywords.some((keyword) =>
    audienceLower.includes(keyword),
  );

  return hasStrongMatch ? 18 : 11;
}

function effortSuitabilityScore(template, effortValue) {
  const distance = Math.abs(template.recommendedEffort - effortValue);
  if (distance === 0) {
    return 20;
  }
  if (distance === 1) {
    return 14;
  }
  return 8;
}

function buildIdea(input, template, format, platformRule, seed, index) {
  const token = `${template.id}-${format.name}-${index}-${input.niche}-${input.audience}`;
  const interpolationValues = {
    niche: input.niche,
    audience: input.audience,
  };

  const title = interpolate(
    pickBySeed(template.titleTemplates, seed, `${token}-title`),
    interpolationValues,
  );

  const hook = interpolate(
    pickBySeed(template.hookTemplates, seed, `${token}-hook`),
    interpolationValues,
  );

  const execution = interpolate(
    pickBySeed(template.executionTemplates, seed, `${token}-execution`),
    interpolationValues,
  );

  const cta = pickBySeed(
    GOAL_TO_CTA[input.goal] || GOAL_TO_CTA.Engagement,
    seed,
    `${token}-cta`,
  );

  const effortValue = EFFORT_LEVELS[input.effort];
  const goalFitScore = template.goals.includes(input.goal) ? 22 : 10;
  const audienceScore = audienceSuitabilityScore(template, input.audience);
  const effortScore = effortSuitabilityScore(template, effortValue);
  const platformScore = template.families.includes(format.family) ? 12 : 5;
  const baseScore = clamp(
    28 + goalFitScore + audienceScore + effortScore + platformScore,
    0,
    100,
  );

  const preferenceKeys = {
    platform: input.platform,
    format: format.name,
    goal: input.goal,
    angle: template.angle,
  };

  return {
    id: `${template.id}-${format.name}-${hashString(token)}`,
    title,
    hook,
    execution,
    cta,
    format: format.name,
    angle: template.angle,
    estimatedEffort: input.effort,
    strategyTip: platformRule.strategy,
    preferenceKeys,
    scoreBreakdown: {
      goalFitScore,
      audienceScore,
      effortScore,
      platformScore,
    },
    baseScore,
  };
}

function dedupeIdeas(ideas) {
  const seen = new Set();
  return ideas.filter((idea) => {
    const key = `${idea.title.toLowerCase()}-${idea.format}-${idea.angle}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function rerankIdeasWithPreferences(ideas, preferences) {
  return [...ideas]
    .map((idea) => {
      const preferenceBoost = getPreferenceBoost(preferences, idea.preferenceKeys);
      const score = clamp(Math.round(idea.baseScore + preferenceBoost), 0, 100);

      return {
        ...idea,
        preferenceBoost,
        score,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.baseScore - a.baseScore;
    });
}

export function generateIdeas(input, preferences, options = {}) {
  const platformRule = PLATFORM_RULES[input.platform];
  if (!platformRule) {
    return [];
  }

  const effortValue = EFFORT_LEVELS[input.effort];
  const requestedCount = clamp(options.count || 6, 3, 12);
  const seed = options.seed || Date.now();

  const rawCandidates = [];
  IDEA_TEMPLATES.forEach((template) => {
    if (effortValue < template.minEffort || effortValue > template.maxEffort) {
      return;
    }

    if (!template.goals.includes(input.goal)) {
      return;
    }

    platformRule.formats.forEach((format, index) => {
      if (!template.families.includes(format.family)) {
        return;
      }

      rawCandidates.push(
        buildIdea(input, template, format, platformRule, seed, index),
      );
    });
  });

  if (rawCandidates.length === 0) {
    // Fallback: if filters become too restrictive, only relax goal filtering.
    IDEA_TEMPLATES.forEach((template) => {
      if (effortValue < template.minEffort || effortValue > template.maxEffort) {
        return;
      }

      platformRule.formats.forEach((format, index) => {
        if (!template.families.includes(format.family)) {
          return;
        }

        rawCandidates.push(
          buildIdea(input, template, format, platformRule, seed, index),
        );
      });
    });
  }

  const uniqueCandidates = dedupeIdeas(rawCandidates);
  const ranked = rerankIdeasWithPreferences(uniqueCandidates, preferences);

  return ranked.slice(0, requestedCount);
}
