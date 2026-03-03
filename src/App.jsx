import React, { useMemo, useState } from 'react';
import IdeaCard from './components/IdeaCard';
import LearningInsights from './components/LearningInsights';
import {
  EFFORT_OPTIONS,
  GOAL_OPTIONS,
  PLATFORM_OPTIONS,
  generateIdeas,
  rerankIdeasWithPreferences,
} from './ideaEngine';
import {
  getPreferenceInsights,
  loadPreferences,
  recordFeedback,
  resetPreferences,
  savePreferences,
} from './preferenceStore';
import './index.css';

const INITIAL_FORM = {
  platform: 'Instagram',
  niche: '',
  audience: '',
  goal: 'Engagement',
  effort: 'Medium',
  ideaCount: 6,
};

function validateInput(formData) {
  const errors = {};

  if (!formData.platform) {
    errors.platform = 'Select a platform.';
  }

  if (!formData.niche.trim()) {
    errors.niche = 'Enter a content niche.';
  } else if (formData.niche.trim().length < 3) {
    errors.niche = 'Niche should be at least 3 characters.';
  }

  if (!formData.audience.trim()) {
    errors.audience = 'Enter a target audience.';
  } else if (formData.audience.trim().length < 3) {
    errors.audience = 'Audience should be at least 3 characters.';
  }

  if (!formData.goal) {
    errors.goal = 'Select a content goal.';
  }

  if (!formData.effort) {
    errors.effort = 'Select an effort level.';
  }

  return errors;
}

function FieldError({ error }) {
  if (!error) {
    return null;
  }

  return <p className="mt-1 text-xs text-rose-600">{error}</p>;
}

function FieldLabel({ children }) {
  return (
    <label className="mb-1 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [ideas, setIdeas] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const [feedbackByIdea, setFeedbackByIdea] = useState({});

  const insights = useMemo(
    () => getPreferenceInsights(preferences),
    [preferences],
  );

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const createIdeas = (seed = Date.now()) => {
    const validationErrors = validateInput(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const input = {
      platform: formData.platform,
      niche: formData.niche.trim(),
      audience: formData.audience.trim(),
      goal: formData.goal,
      effort: formData.effort,
    };

    const generatedIdeas = generateIdeas(input, preferences, {
      seed,
      count: Number(formData.ideaCount),
    });

    setIdeas(generatedIdeas);
    setFeedbackByIdea({});
    setHasGenerated(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createIdeas();
  };

  const handleFeedback = (idea, liked) => {
    const nextState = liked ? 'liked' : 'disliked';
    if (feedbackByIdea[idea.id] === nextState) {
      return;
    }

    const nextPreferences = recordFeedback(preferences, idea.preferenceKeys, liked);
    savePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setFeedbackByIdea((previous) => ({ ...previous, [idea.id]: nextState }));
    setIdeas((previous) => rerankIdeasWithPreferences(previous, nextPreferences));
  };

  const handleResetLearning = () => {
    const cleared = resetPreferences();
    setPreferences(cleared);
    setFeedbackByIdea({});
    setIdeas((previous) => rerankIdeasWithPreferences(previous, cleared));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
            Frontend AI Content Idea Generator
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Generate platform-specific content ideas with adaptive learning
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Use lightweight rule-based logic and preference learning to create
            relevant, audience-focused social media ideas. All learning is stored
            locally in your browser using localStorage.
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8">
        <section className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Content Input Parameters
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Provide platform, niche, audience, goal, and effort level.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Platform</FieldLabel>
                <select
                  value={formData.platform}
                  onChange={(event) =>
                    updateField('platform', event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                >
                  {PLATFORM_OPTIONS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <FieldError error={errors.platform} />
              </div>

              <div>
                <FieldLabel>Content goal</FieldLabel>
                <select
                  value={formData.goal}
                  onChange={(event) => updateField('goal', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                >
                  {GOAL_OPTIONS.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
                <FieldError error={errors.goal} />
              </div>

              <div>
                <FieldLabel>Niche</FieldLabel>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(event) => updateField('niche', event.target.value)}
                  placeholder="e.g. personal finance, fitness, digital marketing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                />
                <FieldError error={errors.niche} />
              </div>

              <div>
                <FieldLabel>Target audience</FieldLabel>
                <input
                  type="text"
                  value={formData.audience}
                  onChange={(event) =>
                    updateField('audience', event.target.value)
                  }
                  placeholder="e.g. university students, startup founders"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                />
                <FieldError error={errors.audience} />
              </div>

              <div>
                <FieldLabel>Effort level</FieldLabel>
                <select
                  value={formData.effort}
                  onChange={(event) => updateField('effort', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                >
                  {EFFORT_OPTIONS.map((effort) => (
                    <option key={effort} value={effort}>
                      {effort}
                    </option>
                  ))}
                </select>
                <FieldError error={errors.effort} />
              </div>

              <div>
                <FieldLabel>Ideas to generate</FieldLabel>
                <input
                  type="number"
                  min={3}
                  max={12}
                  value={formData.ideaCount}
                  onChange={(event) =>
                    updateField(
                      'ideaCount',
                      Number.isFinite(Number(event.target.value))
                        ? Number(event.target.value)
                        : 6,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-violet-200 transition focus:ring"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Generate ideas
              </button>
              <button
                type="button"
                onClick={() => createIdeas(Date.now() + 11)}
                disabled={!hasGenerated}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Regenerate variations
              </button>
            </div>
          </form>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Generated ideas
                </h2>
                <p className="text-sm text-slate-600">
                  Ranked by rule-based relevance + your learned preferences.
                </p>
              </div>
              {ideas.length > 0 && (
                <p className="text-xs font-medium text-slate-500">
                  {ideas.length} ideas ready
                </p>
              )}
            </div>

            {!hasGenerated && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                Enter your parameters and generate ideas. Mark ideas as
                <span className="mx-1 font-semibold text-emerald-700">
                  Helpful
                </span>
                or
                <span className="mx-1 font-semibold text-rose-700">
                  Not for me
                </span>
                to improve ranking over time.
              </div>
            )}

            {hasGenerated && ideas.length === 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                No matching ideas found with the current filters. Try a broader
                niche or a different effort level.
              </div>
            )}

            {ideas.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    feedback={feedbackByIdea[idea.id]}
                    onFeedback={handleFeedback}
                  />
                ))}
              </div>
            )}
          </section>
        </section>

        <LearningInsights insights={insights} onReset={handleResetLearning} />
      </main>
    </div>
  );
}