'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/Dashboard/StatsOverview';
import { SupabaseSetupBanner } from '@/components/Dashboard/SupabaseSetupBanner';
import { AdventureCard } from '@/components/Dashboard/AdventureCard';
import { AdventureTable } from '@/components/Dashboard/AdventureTable';
import { NewAdventureModal } from '@/components/Dashboard/NewAdventureModal';
import { BuildChecklistModal } from '@/components/BuildChecklistModal';
import { SettingsModal } from '@/components/Studio/SettingsModal';
import { Playtester } from '@/components/Studio/Playtester';
import { ExportModal } from '@/components/Studio/ExportModal';
import { Adventure } from '@/types/adventure';
import { storageService } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function DashboardPage() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [isGeminiReady, setIsGeminiReady] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'scenes'>('updated');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playtestAdv, setPlaytestAdv] = useState<Adventure | null>(null);
  const [exportAdv, setExportAdv] = useState<Adventure | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Check config
    setIsSupabaseReady(isSupabaseConfigured());
    const savedApiKey = typeof window !== 'undefined' ? localStorage.getItem('rpg_custom_gemini_key') || '' : '';
    setCustomApiKey(savedApiKey);

    // Check Gemini server availability or key presence
    fetch('/api/gemini/generate', { method: 'POST', body: JSON.stringify({ mode: 'scene', prompt: 'test' }) })
      .then((r) => r.json())
      .then((res) => {
        setIsGeminiReady(!res.missingKey);
      })
      .catch(() => {
        setIsGeminiReady(false);
      });

    loadAdventures();
  }, []);

  const loadAdventures = async () => {
    setIsLoading(true);
    try {
      const result = await storageService.getAdventures();
      setAdventures(result.adventures);
    } catch (err) {
      console.error('Failed to load adventures', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rpg_custom_gemini_key', key);
    }
    showToast('Gemini API key updated');
  };

  const handleCreateAdventure = async (newAdv: Adventure) => {
    await storageService.saveAdventure(newAdv);
    setAdventures((prev) => [newAdv, ...prev]);
    showToast(`Created "${newAdv.title}"`);
  };

  const handleDeleteAdventure = async (id: string) => {
    const adv = adventures.find((a) => a.id === id);
    if (!adv) return;
    if (confirm(`Are you sure you want to delete "${adv.title}"? This cannot be undone.`)) {
      await storageService.deleteAdventure(id);
      setAdventures((prev) => prev.filter((a) => a.id !== id));
      showToast(`Deleted "${adv.title}"`);
    }
  };

  const handleDuplicateAdventure = async (id: string) => {
    const duplicated = await storageService.duplicateAdventure(id);
    if (duplicated) {
      setAdventures((prev) => [duplicated, ...prev]);
      showToast(`Duplicated adventure as "${duplicated.title}"`);
    }
  };

  // Filter & Sort
  const filteredAdventures = adventures
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre = genreFilter === 'ALL' || a.genre.toLowerCase() === genreFilter.toLowerCase();
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

      return matchesSearch && matchesGenre && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'scenes') {
        return (b.scenes?.length || 0) - (a.scenes?.length || 0);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-amber-500/50 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-amber-300 shadow-xl shadow-black/60 backdrop-blur animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenNewAdventure={() => setIsNewModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady || Boolean(customApiKey)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Persistence Status Banner */}
        <SupabaseSetupBanner
          isConfigured={isSupabaseReady}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Dashboard Header & Hero */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-950/80 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-500/30">
                Writer&apos;s Sanctuary
              </span>
              <span className="text-xs text-slate-400">Interactive Storytelling Studio</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Text-Based RPG Adventure Creator
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Design, organize, branch, and polish choice-driven interactive fiction. Expand scenes and lore with Google Gemini, test branching paths live, and export standalone playable games.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Adventure</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview adventures={adventures} />

        {/* Filters & Search Control Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search adventures by title, synopsis, or tags..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Genre Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Genres</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Eldritch Mystery">Eldritch Mystery</option>
                <option value="Gothic Horror">Gothic Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="draft">Drafts</option>
                <option value="in-progress">In Progress</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="updated">Recently Updated</option>
                <option value="title">Alphabetical</option>
                <option value="scenes">Most Scenes</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                onClick={() => setViewMode('cards')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'cards' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Card Grid View"
                aria-label="Cards view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
                aria-label="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Adventures Display */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
            <span className="ml-2 text-xs text-slate-400">Loading adventures from persistence layer...</span>
          </div>
        ) : filteredAdventures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-slate-600" />
            <h3 className="mt-3 font-serif text-base font-bold text-white">No adventures match your search</h3>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your genre or status filters, or craft a new adventure from scratch.
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Adventure</span>
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredAdventures.map((adv) => (
              <AdventureCard
                key={adv.id}
                adventure={adv}
                onPlaytest={(a) => setPlaytestAdv(a)}
                onExport={(a) => setExportAdv(a)}
                onDuplicate={handleDuplicateAdventure}
                onDelete={handleDeleteAdventure}
              />
            ))}
          </div>
        ) : (
          <AdventureTable
            adventures={filteredAdventures}
            onPlaytest={(a) => setPlaytestAdv(a)}
            onExport={(a) => setExportAdv(a)}
            onDuplicate={handleDuplicateAdventure}
            onDelete={handleDeleteAdventure}
          />
        )}
      </main>

      {/* Modals */}
      <NewAdventureModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateAdventure}
      />

      <BuildChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady || Boolean(customApiKey)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady}
        customApiKey={customApiKey}
        onSaveCustomApiKey={handleSaveCustomKey}
      />

      <Playtester
        isOpen={Boolean(playtestAdv)}
        onClose={() => setPlaytestAdv(null)}
        adventure={playtestAdv}
      />

      <ExportModal
        isOpen={Boolean(exportAdv)}
        onClose={() => setExportAdv(null)}
        adventure={exportAdv}
      />
    </div>
  );
}
