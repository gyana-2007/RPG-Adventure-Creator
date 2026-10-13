'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Flag,
  Trophy,
  GitFork,
  Search,
  Sparkles
} from 'lucide-react';
import { SceneNode } from '@/types/adventure';

interface SceneManagerProps {
  scenes: SceneNode[];
  activeSceneId: string;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onOpenAI: () => void;
}

export const SceneManager: React.FC<SceneManagerProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onOpenAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = scenes.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h4 className="font-serif text-sm font-bold text-white">
            Story Nodes ({scenes.length})
          </h4>
        </div>

        <button
          onClick={onAddScene}
          className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all"
          title="Create a new story scene"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Scene</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="mt-3 relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter scenes..."
          className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Scenes List */}
      <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {filtered.map((s) => {
          const isActive = s.id === activeSceneId;
          const choiceCount = s.choices?.length || 0;

          return (
            <div
              key={s.id}
              className={`group flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                isActive
                  ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/40 shadow-sm'
                  : 'border-slate-800/80 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <button
                onClick={() => onSelectScene(s.id)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-1.5">
                  {s.isStartingScene && (
                    <span title="Starting Scene"><Flag className="h-3 w-3 text-amber-400" /></span>
                  )}
                  {s.isEndingScene && (
                    <span title="Ending Node"><Trophy className="h-3 w-3 text-emerald-400" /></span>
                  )}
                  <span className="font-serif text-xs font-bold text-white group-hover:text-cyan-300">
                    {s.title || 'Untitled Scene'}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3 text-purple-400" />
                    <span>{choiceCount} choices</span>
                  </span>
                  {s.mood && <span>• {s.mood}</span>}
                </div>
              </button>

              {scenes.length > 1 && (
                <button
                  onClick={() => onDeleteScene(s.id)}
                  className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-opacity"
                  title="Delete this scene"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Scene Generator Shortcut */}
      <div className="mt-4 border-t border-slate-800 pt-3">
        <button
          onClick={onOpenAI}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Generate Room with Gemini</span>
        </button>
      </div>
    </div>
  );
};
