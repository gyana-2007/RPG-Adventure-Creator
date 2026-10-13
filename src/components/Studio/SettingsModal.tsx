'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Save,
  HardDrive,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '@/lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupabaseConfigured: boolean;
  isGeminiConfigured: boolean;
  customApiKey: string;
  onSaveCustomApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isSupabaseConfigured,
  isGeminiConfigured,
  customApiKey,
  onSaveCustomApiKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [isSavingEnv, setIsSavingEnv] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'supabase' | 'gemini' | 'vercel'>('supabase');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    const envExample = `# .env.local file template
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
GEMINI_API_KEY=AIzaSy...`;
    navigator.clipboard.writeText(envExample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleSaveSupabaseToEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      setSaveFeedback({ success: false, message: 'Please provide both Supabase Project URL and Anon Public Key.' });
      return;
    }

    setIsSavingEnv(true);
    setSaveFeedback(null);

    try {
      const res = await fetch('/api/config/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: supabaseUrlInput.trim(),
          supabaseAnonKey: supabaseKeyInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveFeedback({
          success: true,
          message: 'Supabase credentials saved to .env.local! Reloading studio...',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setSaveFeedback({ success: false, message: data.error || 'Failed to update credentials' });
      }
    } catch (err: any) {
      setSaveFeedback({ success: false, message: err?.message || 'Network error saving credentials' });
    } finally {
      setIsSavingEnv(false);
    }
  };

  const handlePreferLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hide_supabase_banner', 'true');
    }
    setSaveFeedback({
      success: true,
      message: 'Local Storage mode selected. Cloud connection warnings have been muted.',
    });
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 1200);
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomApiKey(apiKeyInput.trim());

    // Also persist to .env.local if provided
    if (apiKeyInput.trim()) {
      try {
        await fetch('/api/config/env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geminiApiKey: apiKeyInput.trim() }),
        });
      } catch (err) {
        // silent fallback to session
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              Studio Configuration & Persistence
            </h3>
            <p className="text-xs text-slate-400">
              Manage Supabase cloud connection, Gemini AI credentials, and deployment environments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="mt-4 flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'supabase'
                ? 'bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            Supabase Connection {isSupabaseConfigured ? '✓' : '(Local Mode)'}
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'gemini'
                ? 'bg-amber-950/80 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Gemini AI Key {isGeminiConfigured || customApiKey ? '✓' : '!'}
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'vercel'
                ? 'bg-purple-950/80 text-purple-300 ring-1 ring-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Vercel Deployment
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'supabase' && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-xl border p-4 ${
                isSupabaseConfigured
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-slate-700 bg-slate-950/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Current Mode:</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    isSupabaseConfigured
                      ? 'bg-emerald-900 text-emerald-200'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Local Storage Studio Mode'}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {isSupabaseConfigured
                  ? 'Connected and syncing with your remote Supabase PostgreSQL database.'
                  : 'You are currently working in Local Storage mode. All your adventures and scenes are automatically saved to your browser.'}
              </p>
            </div>

            {/* Direct In-App Credential Setup Form */}
            <form onSubmit={handleSaveSupabaseToEnv} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Connect Your Supabase Project
              </h4>
              <p className="text-[11px] text-slate-400">
                Paste your credentials from your Supabase Dashboard &rarr; Project Settings &rarr; API.
              </p>

              <div>
                <label className="block text-[11px] font-medium text-slate-300">
                  NEXT_PUBLIC_SUPABASE_URL
                </label>
                <input
                  type="text"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {saveFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs ${
                    saveFeedback.success
                      ? 'border border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border border-red-500/40 bg-red-950/30 text-red-300'
                  }`}
                >
                  {saveFeedback.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  )}
                  <span>{saveFeedback.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePreferLocalStorage}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-750 hover:text-white"
                >
                  <HardDrive className="h-3.5 w-3.5" />
                  <span>Use Local Mode Only (Dismiss Banner)</span>
                </button>

                <button
                  type="submit"
                  disabled={isSavingEnv}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSavingEnv ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save & Connect</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Supabase SQL Migration Script
                </h4>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700"
                >
                  {copiedSql ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedSql ? 'Copied SQL' : 'Copy SQL'}
                </button>
              </div>
              <pre className="mt-2 max-h-36 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-300">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'gemini' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">Google Gemini Integration</h4>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {isGeminiConfigured
                  ? 'GEMINI_API_KEY is configured in server environment variables. AI generation runs securely through the server-side proxy.'
                  : 'GEMINI_API_KEY is not currently set in your .env.local file. Add your key below to unlock live AI story generation.'}
              </p>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Gemini API Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Saved directly to .env.local and browser session. Free API keys available at{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  Google AI Studio
                </a>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'vercel' && (
          <div className="mt-4 space-y-4 text-xs text-slate-300">
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
              <h4 className="font-semibold text-white">Deploying to Vercel</h4>
              <p className="mt-1">
                The application is built for zero-config deployment on Vercel with Next.js App Router.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white">Steps:</h5>
              <ol className="list-inside list-decimal space-y-1 text-slate-300">
                <li>Push this repository to GitHub / GitLab / Bitbucket.</li>
                <li>Import the project into your Vercel Dashboard.</li>
                <li>Under <strong>Environment Variables</strong>, add your production keys:
                  <ul className="ml-4 mt-1 list-disc font-mono text-[11px] text-amber-300">
                    <li>GEMINI_API_KEY</li>
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </li>
                <li>Click <strong>Deploy</strong>. Vercel will automatically run <code className="text-purple-300">next build</code>.</li>
              </ol>
            </div>

            <button
              onClick={handleCopyEnv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
            >
              {copiedEnv ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedEnv ? 'Copied .env Template' : 'Copy .env.example Template'}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
