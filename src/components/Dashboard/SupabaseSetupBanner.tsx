'use client';

import React, { useState, useEffect } from 'react';
import { Database, X, ArrowRight, ShieldCheck, HardDrive } from 'lucide-react';

interface SupabaseSetupBannerProps {
  isConfigured: boolean;
  onOpenSettings: () => void;
}

export const SupabaseSetupBanner: React.FC<SupabaseSetupBannerProps> = ({
  isConfigured,
  onOpenSettings,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('hide_supabase_banner') === 'true';
      setIsDismissed(dismissed);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hide_supabase_banner', 'true');
    }
  };

  // If dismissed and not configured, do not show the banner at all
  if (isDismissed && !isConfigured) {
    return null;
  }

  if (isConfigured) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-xs text-emerald-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>
            <strong>Cloud Sync Active:</strong> Connected to Supabase PostgreSQL database.
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs font-semibold text-emerald-400 hover:underline"
        >
          View Database Info
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-900/80 p-3 text-xs text-slate-300 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between shadow-sm">
      <div className="flex items-start gap-2.5 sm:items-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
          <HardDrive className="h-3.5 w-3.5" />
        </div>
        <div>
          <span className="font-semibold text-white">
            Local Storage Studio Mode Active:
          </span>{' '}
          Adventures are safely saved to your browser storage. Connect Supabase for multi-device cloud synchronization.
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-900/60"
        >
          <span>Connect Supabase</span>
          <ArrowRight className="h-3 w-3" />
        </button>

        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          title="Dismiss banner (use local storage)"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
