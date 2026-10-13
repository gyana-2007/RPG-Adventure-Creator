'use client';

import React from 'react';
import { Swords, Plus, Trash2, CheckCircle2, Circle, XCircle, Sparkles, Gift } from 'lucide-react';
import { Quest } from '@/types/adventure';

interface QuestLogProps {
  quests: Quest[];
  onUpdateQuests: (quests: Quest[]) => void;
  onOpenAIForQuest: () => void;
}

export const QuestLog: React.FC<QuestLogProps> = ({
  quests,
  onUpdateQuests,
  onOpenAIForQuest,
}) => {
  const handleAddQuest = () => {
    const newQuest: Quest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: 'New Quest Objective',
      description: 'Investigate the unusual rumors and secure the objective.',
      status: 'active',
      reward: 'Ancient Relic & 100 Gold',
    };
    onUpdateQuests([...quests, newQuest]);
  };

  const handleUpdate = (id: string, updates: Partial<Quest>) => {
    onUpdateQuests(quests.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const handleDelete = (id: string) => {
    onUpdateQuests(quests.filter((q) => q.id !== id));
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-amber-400" />
          <h4 className="font-serif text-sm font-bold text-white">
            Quest Log & Plot Hooks ({quests.length})
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIForQuest}
            className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-900"
          >
            <Sparkles className="h-3 w-3" />
            <span>Generate Quest</span>
          </button>
          <button
            onClick={handleAddQuest}
            className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/40 hover:bg-amber-500 hover:text-slate-950 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Quest</span>
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {quests.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
            <p>No quests tracked for this adventure.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Create an objective to give your players goals, complications, and high-stakes rewards.
            </p>
          </div>
        )}

        {quests.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={q.title}
                    onChange={(e) => handleUpdate(q.id, { title: e.target.value })}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 font-serif text-sm font-bold text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Quest Title..."
                  />

                  <select
                    value={q.status}
                    onChange={(e) => handleUpdate(q.id, { status: e.target.value as any })}
                    className={`rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                      q.status === 'completed'
                        ? 'text-emerald-400'
                        : q.status === 'failed'
                        ? 'text-red-400'
                        : 'text-amber-300'
                    }`}
                  >
                    <option value="active">Active Quest</option>
                    <option value="completed">Completed ✓</option>
                    <option value="failed">Failed ✗</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  value={q.description}
                  onChange={(e) => handleUpdate(q.id, { description: e.target.value })}
                  placeholder="Quest objective, complications, stakes..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />

                <div className="flex items-center gap-2 text-xs">
                  <Gift className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-slate-400">Reward:</span>
                  <input
                    type="text"
                    value={q.reward || ''}
                    onChange={(e) => handleUpdate(q.id, { reward: e.target.value })}
                    placeholder="e.g. Abyssal Scepter & 250 Gold"
                    className="flex-1 rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-xs text-amber-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleDelete(q.id)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                title="Delete quest"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
