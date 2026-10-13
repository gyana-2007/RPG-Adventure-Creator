'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Database, CheckCircle2, AlertCircle, Settings, Plus, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenChecklist: () => void;
  onOpenNewAdventure?: () => void;
  onOpenSettings: () => void;
  isSupabaseConfigured: boolean;
  isGeminiConfigured: boolean;
  activeAdventureTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChecklist,
  onOpenNewAdventure,
  onOpenSettings,
  isSupabaseConfigured,
  isGeminiConfigured,
  activeAdventureTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Active Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-purple-700 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/30">
              <Compass className="h-5 w-5 text-slate-950 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  RPG Adventure Creator
                </span>
                <span className="hidden rounded bg-purple-950/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-300 ring-1 ring-purple-500/30 sm:inline-block">
                  Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive Fiction & Worldbuilder</p>
            </div>
          </Link>

          {activeAdventureTitle && (
            <div className="hidden items-center gap-2 border-l border-slate-800 pl-4 md:flex">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="max-w-[200px] truncate text-sm font-medium text-slate-200">
                {activeAdventureTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right Status Badges & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visible Build Checklist Button */}
          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 text-xs font-medium text-purple-200 transition-all hover:border-purple-400 hover:bg-purple-900/50"
            title="View Build & Deployment Checklist"
            aria-label="Build Checklist"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">Build Checklist</span>
            <span className="rounded-full bg-purple-500/20 px-1.5 py-0.2 text-[10px] font-bold text-purple-300">
              5/5
            </span>
          </button>

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSettings}
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all sm:flex ${
              isSupabaseConfigured
                ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
            }`}
            title={
              isSupabaseConfigured
                ? 'Connected to live Supabase Cloud database'
                : 'Local Storage Fallback mode active (Supabase env vars missing)'
            }
          >
            <Database className={`h-3.5 w-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="hidden md:inline">DB:</span>
            <span>{isSupabaseConfigured ? 'Cloud Sync' : 'Local Storage'}</span>
          </button>

          {/* Gemini AI Status Pill */}
          <button
            onClick={onOpenSettings}
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all sm:flex ${
              isGeminiConfigured
                ? 'border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
            }`}
            title={
              isGeminiConfigured
                ? 'Google Gemini AI Co-Pilot Ready'
                : 'Gemini API key missing. Click to configure.'
            }
          >
            <Sparkles className={`h-3.5 w-3.5 ${isGeminiConfigured ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Gemini AI</span>
            {!isGeminiConfigured && (
              <span className="text-[10px] text-amber-400 font-semibold">• Set Key</span>
            )}
          </button>

          {/* New Adventure Button (if on dashboard) */}
          {onOpenNewAdventure && (
            <button
              onClick={onOpenNewAdventure}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95"
              aria-label="Create New Adventure"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">New Adventure</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
            title="Studio Settings & Setup Guide"
            aria-label="Studio Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
