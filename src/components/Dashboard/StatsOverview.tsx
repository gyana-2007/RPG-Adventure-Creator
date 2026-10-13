'use client';

import React from 'react';
import { BookOpen, GitFork, Users, Trophy, Sparkles, Feather } from 'lucide-react';
import { Adventure } from '@/types/adventure';

interface StatsOverviewProps {
  adventures: Adventure[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ adventures }) => {
  const total = adventures.length;
  const published = adventures.filter((a) => a.status === 'published').length;
  const inProgress = adventures.filter((a) => a.status === 'in-progress').length;
  const drafts = adventures.filter((a) => a.status === 'draft').length;

  const totalScenes = adventures.reduce((acc, a) => acc + (a.scenes?.length || 0), 0);
  const totalChoices = adventures.reduce(
    (acc, a) =>
      acc + (a.scenes?.reduce((cAcc, s) => cAcc + (s.choices?.length || 0), 0) || 0),
    0
  );
  const totalCharacters = adventures.reduce((acc, a) => acc + (a.characters?.length || 0), 0);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {/* Total Adventures */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Adventures</span>
          <BookOpen className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-white">{total}</span>
          <span className="text-[11px] text-slate-400">stories</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>Active Studio Projects</span>
        </div>
      </div>

      {/* Draft & Published Status Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Publication Status</span>
          <Trophy className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-emerald-400">{published}</span>
          <span className="text-[11px] text-slate-400">published</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          <span className="text-amber-300 font-semibold">{inProgress}</span> writing,{' '}
          <span className="text-slate-400">{drafts}</span> draft
        </div>
      </div>

      {/* Story Scenes / Graph Nodes */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Story Nodes / Scenes</span>
          <Feather className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-white">{totalScenes}</span>
          <span className="text-[11px] text-slate-400">interactive</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Avg {total > 0 ? (totalScenes / total).toFixed(1) : 0} scenes / adventure
        </div>
      </div>

      {/* Branching Choices */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Branching Choices</span>
          <GitFork className="h-4 w-4 text-purple-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-white">{totalChoices}</span>
          <span className="text-[11px] text-slate-400">decision paths</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Non-linear narrative forks
        </div>
      </div>

      {/* Characters & Quests */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Characters & NPCs</span>
          <Users className="h-4 w-4 text-pink-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold text-white">{totalCharacters}</span>
          <span className="text-[11px] text-slate-400">dramatis personae</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          With custom stats & traits
        </div>
      </div>
    </div>
  );
};
