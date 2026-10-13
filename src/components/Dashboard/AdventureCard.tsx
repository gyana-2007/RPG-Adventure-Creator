'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Layers,
  Users,
  Swords,
  Play,
  Download,
  Copy,
  Trash2,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Adventure } from '@/types/adventure';

interface AdventureCardProps {
  adventure: Adventure;
  onPlaytest: (adventure: Adventure) => void;
  onExport: (adventure: Adventure) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({
  adventure,
  onPlaytest,
  onExport,
  onDuplicate,
  onDelete,
}) => {
  const getGenreColor = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'fantasy':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      case 'cyberpunk':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
      case 'eldritch mystery':
      case 'cosmic horror':
        return 'text-purple-400 bg-purple-950/40 border-purple-500/30';
      case 'gothic horror':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
      case 'sci-fi':
        return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Published
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        );
    }
  };

  const formattedDate = new Date(adventure.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-black/40">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${getGenreColor(
              adventure.genre
            )}`}
          >
            {adventure.genre}
          </span>
          <div className="flex items-center gap-2">{getStatusBadge(adventure.status)}</div>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-serif text-lg font-bold text-white transition-colors group-hover:text-amber-400">
          <Link href={`/adventure/${adventure.id}`}>{adventure.title}</Link>
        </h3>

        {/* Synopsis */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
          {adventure.synopsis || 'No synopsis added yet. Open the writing studio to flesh out lore and opening scenes.'}
        </p>

        {/* Tags */}
        {adventure.tags && adventure.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {adventure.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400"
              >
                #{tag}
              </span>
            ))}
            {adventure.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{adventure.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Story Stats Metrics */}
        <div className="mt-4 flex items-center gap-4 border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5" title="Interactive Scenes">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>{adventure.scenes?.length || 0} scenes</span>
          </span>
          <span className="flex items-center gap-1.5" title="Characters & NPCs">
            <Users className="h-3.5 w-3.5 text-pink-400" />
            <span>{adventure.characters?.length || 0} NPCs</span>
          </span>
          <span className="flex items-center gap-1.5" title="Quests & Plot Hooks">
            <Swords className="h-3.5 w-3.5 text-amber-400" />
            <span>{adventure.quests?.length || 0} quests</span>
          </span>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {/* Quick Playtest */}
          <button
            onClick={() => onPlaytest(adventure)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-emerald-400"
            title="Interactive Playtest"
            aria-label="Playtest adventure"
          >
            <Play className="h-4 w-4" />
          </button>

          {/* Quick Export */}
          <button
            onClick={() => onExport(adventure)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-cyan-400"
            title="Export Script & Playable HTML"
            aria-label="Export adventure"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Duplicate */}
          <button
            onClick={() => onDuplicate(adventure.id)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-purple-400"
            title="Duplicate Adventure"
            aria-label="Duplicate adventure"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(adventure.id)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
            title="Delete Adventure"
            aria-label="Delete adventure"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Studio Open Link */}
          <Link
            href={`/adventure/${adventure.id}`}
            className="ml-1 flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30 transition-all hover:bg-amber-500 hover:text-slate-950"
          >
            <span>Write</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
