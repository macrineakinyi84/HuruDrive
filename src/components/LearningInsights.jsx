import React from 'react';

function InsightItem({ label, value, fallback }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">
        {value || fallback}
      </p>
    </div>
  );
}

export default function LearningInsights({ insights, onReset }) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Preference Learning
          </h2>
          <p className="text-sm text-slate-600">
            Feedback is stored locally and used to rank future ideas.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
        >
          Reset learning
        </button>
      </div>

      <div className="mb-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
        <p className="font-semibold">Total feedback signals</p>
        <p className="text-2xl font-bold">{insights.totalFeedback}</p>
      </div>

      <div className="grid gap-2">
        <InsightItem
          label="Top preferred format"
          value={insights.topFormat?.name}
          fallback="No format preference yet"
        />
        <InsightItem
          label="Top preferred angle"
          value={insights.topAngle?.name}
          fallback="No angle preference yet"
        />
        <InsightItem
          label="Top platform signal"
          value={insights.topPlatform?.name}
          fallback="No platform signal yet"
        />
        <InsightItem
          label="Top goal signal"
          value={insights.topGoal?.name}
          fallback="No goal signal yet"
        />
      </div>
    </aside>
  );
}
