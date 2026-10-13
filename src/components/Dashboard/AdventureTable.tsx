'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Download, Copy, Trash2, ArrowRight } from 'lucide-react';
import { Adventure } from '@/types/adventure';

interface AdventureTableProps {
  adventures: Adventure[];
  onPlaytest: (adventure: Adventure) => void;
  onExport: (adventure: Adventure) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdventureTable: React.FC<AdventureTableProps> = ({
  adventures,
  onPlaytest,
  onExport,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-3.5">
              Adventure Title
            </th>
            <th scope="col" className="px-4 py-3.5">
              Genre
            </th>
            <th scope="col" className="px-4 py-3.5">
              Status
            </th>
            <th scope="col" className="px-4 py-3.5">
              Scenes
            </th>
            <th scope="col" className="px-4 py-3.5">
              NPCs
            </th>
            <th scope="col" className="px-4 py-3.5">
              Last Updated
            </th>
            <th scope="col" className="px-4 py-3.5 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {adventures.map((adv) => (
            <tr key={adv.id} className="transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3.5 font-medium text-white">
                <Link
                  href={`/adventure/${adv.id}`}
                  className="font-serif text-sm font-bold text-amber-200 hover:text-amber-400 hover:underline"
                >
                  {adv.title}
                </Link>
                <p className="mt-0.5 line-clamp-1 max-w-sm text-[11px] text-slate-400">
                  {adv.synopsis || 'No synopsis'}
                </p>
              </td>
              <td className="px-4 py-3.5">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                  {adv.genre}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    adv.status === 'published'
                      ? 'bg-emerald-950 text-emerald-300 ring-1 ring-emerald-500/30'
                      : adv.status === 'in-progress'
                      ? 'bg-amber-950 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {adv.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-cyan-300 font-mono">
                {adv.scenes?.length || 0}
              </td>
              <td className="px-4 py-3.5 text-pink-300 font-mono">
                {adv.characters?.length || 0}
              </td>
              <td className="px-4 py-3.5 text-slate-400">
                {new Date(adv.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onPlaytest(adv)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                    title="Playtest"
                    aria-label="Playtest adventure"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onExport(adv)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                    title="Export"
                    aria-label="Export adventure"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDuplicate(adv.id)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-purple-400"
                    title="Duplicate"
                    aria-label="Duplicate adventure"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(adv.id)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                    title="Delete"
                    aria-label="Delete adventure"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    href={`/adventure/${adv.id}`}
                    className="ml-1 inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500 hover:text-slate-950"
                  >
                    <span>Edit</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
