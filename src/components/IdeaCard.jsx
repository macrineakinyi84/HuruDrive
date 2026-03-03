import React, { useState } from 'react';

function scoreClass(score) {
  if (score >= 85) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }
  if (score >= 70) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  return 'bg-amber-100 text-amber-800 border-amber-200';
}

function feedbackClass(isActive, kind) {
  if (!isActive) {
    return 'border-slate-300 text-slate-700 hover:bg-slate-100';
  }

  if (kind === 'liked') {
    return 'border-emerald-300 bg-emerald-100 text-emerald-800';
  }

  return 'border-rose-300 bg-rose-100 text-rose-800';
}

export default function IdeaCard({ idea, feedback, onFeedback }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const message = [
      `Title: ${idea.title}`,
      `Format: ${idea.format}`,
      `Hook: ${idea.hook}`,
      `Execution: ${idea.execution}`,
      `Call-to-action: ${idea.cta}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn('Copy failed:', error);
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${scoreClass(
            idea.score,
          )}`}
        >
          Score: {idea.score}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {idea.format}
        </span>
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800">
          {idea.angle}
        </span>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
          Effort: {idea.estimatedEffort}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-slate-900">{idea.title}</h3>

      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Hook:</span> {idea.hook}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Execution:</span>{' '}
          {idea.execution}
        </p>
        <p>
          <span className="font-semibold text-slate-900">CTA:</span> {idea.cta}
        </p>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Strategy tip: {idea.strategyTip}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onFeedback(idea, true)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${feedbackClass(
            feedback === 'liked',
            'liked',
          )}`}
        >
          Helpful
        </button>
        <button
          type="button"
          onClick={() => onFeedback(idea, false)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${feedbackClass(
            feedback === 'disliked',
            'disliked',
          )}`}
        >
          Not for me
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {copied ? 'Copied' : 'Copy idea'}
        </button>
      </div>
    </article>
  );
}
