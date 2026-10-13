'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Server,
  Sparkles,
  Cloud,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { getBuildChecklist } from '@/lib/checklist';

interface BuildChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupabaseConfigured: boolean;
  isGeminiConfigured: boolean;
}

export const BuildChecklistModal: React.FC<BuildChecklistModalProps> = ({
  isOpen,
  onClose,
  isSupabaseConfigured,
  isGeminiConfigured,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const checklist = getBuildChecklist(isSupabaseConfigured, isGeminiConfigured);

  const completedCount = checklist.filter(
    (item) => item.status === 'completed' || item.status === 'configured'
  ).length;

  const copyEnvSnippet = () => {
    const text = `# Environment Variables for Vercel Deployment & Local Development
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-purple-950/40">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-900/60 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-300 ring-1 ring-purple-500/40">
                System Verification
              </span>
              <span className="text-xs text-slate-400">Target: Vercel Production</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl font-bold text-white">
              Application Build Checklist & Readiness
            </h2>
            <p className="text-sm text-slate-300">
              Live status of architecture, frontend, persistence layer, AI integration, and Vercel readiness.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close Checklist Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">Architecture & Build Progress</span>
            <span className="text-amber-400">
              {completedCount} of 5 Core Modules Verified
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* 5 Core Checklist Items */}
        <div className="space-y-3.5">
          {checklist.map((item) => {
            const isDone = item.status === 'completed';
            const isConfigured = item.status === 'configured';
            const isPendingKey = item.status === 'pending_credentials';

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 transition-all ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isConfigured
                    ? 'border-cyan-500/30 bg-cyan-950/10'
                    : 'border-amber-500/30 bg-amber-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : isConfigured ? (
                        <ShieldCheck className="h-5 w-5 text-cyan-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          0{item.id}.
                        </span>
                        <h3 className="font-serif text-base font-bold text-white">
                          {item.title}
                        </h3>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                            isDone
                              ? 'bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500/40'
                              : isConfigured
                              ? 'bg-cyan-900/50 text-cyan-300 ring-1 ring-cyan-500/40'
                              : 'bg-amber-900/50 text-amber-300 ring-1 ring-amber-500/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                      <p className="mt-1.5 text-xs text-slate-400 italic">{item.details}</p>

                      {item.credentialNote && (
                        <div className="mt-2.5 flex items-center gap-2 rounded-md bg-amber-950/40 px-2.5 py-1.5 text-xs text-amber-200 ring-1 ring-amber-500/30">
                          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                          <span>
                            <strong>Note on Credentials:</strong> {item.credentialNote}. Full offline fallback is active.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vercel Deployment Section */}
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-sky-400" />
              <h4 className="font-serif text-sm font-bold text-white">
                Vercel Deployment Guide
              </h4>
            </div>
            <button
              onClick={copyEnvSnippet}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied Env Vars' : 'Copy Env Template'}
            </button>
          </div>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <p>
              1. <strong>Platform:</strong> Tested and configured for <strong>Vercel</strong> (Next.js App Router).
            </p>
            <p>
              2. <strong>One-Command Deploy:</strong> Run <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-amber-300">vercel</code> or push to a GitHub repository connected to Vercel.
            </p>
            <p>
              3. <strong>Environment Variables in Vercel:</strong> Add <code className="rounded bg-slate-800 px-1 text-purple-300">GEMINI_API_KEY</code>, <code className="rounded bg-slate-800 px-1 text-emerald-300">NEXT_PUBLIC_SUPABASE_URL</code>, and <code className="rounded bg-slate-800 px-1 text-emerald-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Project Settings &rarr; Environment Variables.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
