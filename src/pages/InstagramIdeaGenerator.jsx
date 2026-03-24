import React, { useEffect, useMemo, useState } from 'react';
import {
  AUDIENCE_OPTIONS,
  EFFORT_OPTIONS,
  GOAL_OPTIONS,
  NICHE_OPTIONS,
  PLATFORM_NAME,
  clearPreferenceWeights,
  generateInstagramIdeas,
  loadPreferenceWeights,
  loadSavedProfile,
  savePreferenceWeights,
  saveProfile,
} from '../lib/instagramIdeaEngine';

const DEFAULT_PROFILE = {
  niche: 'wellness',
  audience: 'young-professionals',
  goal: 'engagement',
  effort: 'medium',
  ideaCount: 6,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toLabel(value, options) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function InstagramIdeaGenerator() {
  const [formValues, setFormValues] = useState(DEFAULT_PROFILE);
  const [activeProfile, setActiveProfile] = useState(DEFAULT_PROFILE);
  const [preferenceWeights, setPreferenceWeights] = useState({});
  const [ideas, setIdeas] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedIdeaId, setCopiedIdeaId] = useState('');

  useEffect(() => {
    const savedProfile = loadSavedProfile(DEFAULT_PROFILE);
    const savedWeights = loadPreferenceWeights();
    setFormValues(savedProfile);
    setActiveProfile(savedProfile);
    setPreferenceWeights(savedWeights);
  }, []);

  useEffect(() => {
    setIdeas(generateInstagramIdeas(activeProfile, preferenceWeights));
  }, [activeProfile, preferenceWeights]);

  const learningSummary = useMemo(() => {
    const values = Object.values(preferenceWeights);
    const positive = values.filter((value) => value > 0).length;
    const negative = values.filter((value) => value < 0).length;
    return { positive, negative, total: values.length };
  }, [preferenceWeights]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: name === 'ideaCount' ? Number(value) : value,
    }));
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    const nextProfile = {
      ...formValues,
      ideaCount: clamp(Number(formValues.ideaCount) || 6, 3, 12),
    };
    setActiveProfile(nextProfile);
    saveProfile(nextProfile);
    setStatusMessage('Generated fresh Instagram ideas using your selected niche and audience profile.');
  };

  const handleFeedback = (idea, vote) => {
    const delta = vote === 'up' ? 2 : -2;
    setPreferenceWeights((previous) => {
      const current = previous[idea.preferenceKey] ?? 0;
      const nextValue = clamp(current + delta, -20, 20);
      const nextWeights = { ...previous, [idea.preferenceKey]: nextValue };
      savePreferenceWeights(nextWeights);
      return nextWeights;
    });

    setStatusMessage(
      vote === 'up'
        ? 'Thanks for the positive feedback. Future ideas will prioritize this style.'
        : 'Feedback saved. The generator will reduce similar ideas in future rankings.',
    );
  };

  const handleClearLearning = () => {
    clearPreferenceWeights();
    setPreferenceWeights({});
    setStatusMessage('Preference learning has been reset for a fresh start.');
  };

  const handleCopyIdea = async (idea) => {
    const text = [
      `Platform: ${PLATFORM_NAME}`,
      `Niche: ${toLabel(idea.niche, NICHE_OPTIONS)}`,
      `Format: ${idea.format}`,
      `Title: ${idea.title}`,
      `Hook: ${idea.hook}`,
      '',
      'Outline:',
      ...idea.outline.map((step, index) => `${index + 1}. ${step}`),
      '',
      `CTA: ${idea.cta}`,
      `Hashtags: ${idea.hashtags.join(' ')}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdeaId(idea.id);
      setStatusMessage('Idea copied to clipboard.');
    } catch (error) {
      setStatusMessage('Could not copy automatically. Your browser may block clipboard access.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50">
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <p className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
            Platform locked: Instagram only
          </p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
            AI Content Idea Generator
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-gray-600 md:text-base">
            Generate ranked Instagram ideas for exactly three niches: wellness, fashion, and lifestyle.
            The system uses rule-based logic and learns from your feedback to improve relevance over time.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {NICHE_OPTIONS.map((niche) => (
              <span
                key={niche.value}
                className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
              >
                {niche.label}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
          <form
            onSubmit={handleGenerate}
            className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">Content Inputs</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="platform">
                  Platform
                </label>
                <input
                  id="platform"
                  value={PLATFORM_NAME}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="niche">
                  Niche
                </label>
                <select
                  id="niche"
                  name="niche"
                  value={formValues.niche}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {NICHE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="audience">
                  Audience
                </label>
                <select
                  id="audience"
                  name="audience"
                  value={formValues.audience}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {AUDIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="goal">
                  Content Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formValues.goal}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="effort">
                  Effort Level
                </label>
                <select
                  id="effort"
                  name="effort"
                  value={formValues.effort}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {EFFORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="ideaCount">
                  Number of Ideas
                </label>
                <input
                  id="ideaCount"
                  name="ideaCount"
                  type="number"
                  min="3"
                  max="12"
                  value={formValues.ideaCount}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              Generate Instagram Ideas
            </button>

            <button
              type="button"
              onClick={handleClearLearning}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Reset Preference Learning
            </button>

            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
              <p className="font-semibold">Learning Profile</p>
              <p className="mt-1">
                Positive patterns: {learningSummary.positive} | Negative patterns: {learningSummary.negative}
              </p>
              <p>Total learned rules: {learningSummary.total}</p>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                Active profile: <strong>{toLabel(activeProfile.niche, NICHE_OPTIONS)}</strong> niche for{' '}
                <strong>{toLabel(activeProfile.audience, AUDIENCE_OPTIONS)}</strong> focused on{' '}
                <strong>{toLabel(activeProfile.goal, GOAL_OPTIONS)}</strong>.
              </p>
              {statusMessage ? <p className="mt-2 text-sm text-purple-700">{statusMessage}</p> : null}
            </div>

            {ideas.map((idea, index) => (
              <article
                key={idea.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      Rank #{index + 1}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {idea.format}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Match {idea.matchScore}%
                    </span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Effort: {idea.effortLevel}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Hook:</span> {idea.hook}
                </p>

                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800">Execution Plan</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {idea.outline.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>

                <p className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">CTA:</span> {idea.cta}
                </p>

                <p className="mt-2 text-xs text-gray-600">{idea.reasoning}</p>

                <p className="mt-3 text-sm font-medium text-purple-700">{idea.hashtags.join(' ')}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleFeedback(idea, 'up')}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Helpful
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback(idea, 'down')}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    Not for me
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyIdea(idea)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    {copiedIdeaId === idea.id ? 'Copied' : 'Copy idea'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
