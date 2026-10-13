'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Code2, Globe, FileCode2 } from 'lucide-react';
import { Adventure } from '@/types/adventure';
import {
  exportAdventureAsTxt,
  exportAdventureAsMarkdown,
  exportAdventureAsStandaloneHtml,
  downloadFile,
} from '@/lib/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  adventure: Adventure | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, adventure }) => {
  const [activeFormat, setActiveFormat] = useState<'txt' | 'json' | 'md' | 'html'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !adventure) return null;

  const getContent = () => {
    switch (activeFormat) {
      case 'txt':
        return exportAdventureAsTxt(adventure);
      case 'json':
        return JSON.stringify(adventure, null, 2);
      case 'md':
        return exportAdventureAsMarkdown(adventure);
      case 'html':
        return exportAdventureAsStandaloneHtml(adventure);
    }
  };

  const handleDownload = () => {
    const content = getContent();
    const cleanTitle = adventure.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    switch (activeFormat) {
      case 'txt':
        downloadFile(`${cleanTitle}.txt`, content, 'text/plain');
        break;
      case 'json':
        downloadFile(`${cleanTitle}.json`, content, 'application/json');
        break;
      case 'md':
        downloadFile(`${cleanTitle}.md`, content, 'text/markdown');
        break;
      case 'html':
        downloadFile(`${cleanTitle}-game.html`, content, 'text/html');
        break;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300 ring-1 ring-cyan-500/30">
              Export Studio
            </span>
            <h3 className="mt-1 font-serif text-xl font-bold text-white">
              Export &ldquo;{adventure.title}&rdquo;
            </h3>
            <p className="text-xs text-slate-400">
              Download your adventure as a text manuscript, JSON data, Markdown, or a standalone playable web game.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close export dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            onClick={() => setActiveFormat('html')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              activeFormat === 'html'
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/40'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span className="mt-2 text-xs font-bold">Playable HTML Game</span>
            <span className="text-[10px] text-slate-400">Offline interactive single-file</span>
          </button>

          <button
            onClick={() => setActiveFormat('txt')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              activeFormat === 'txt'
                ? 'border-amber-500 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/40'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4 text-amber-400" />
            <span className="mt-2 text-xs font-bold">Plain Text (.txt)</span>
            <span className="text-[10px] text-slate-400">Clean story script & choices</span>
          </button>

          <button
            onClick={() => setActiveFormat('json')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              activeFormat === 'json'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/40'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Code2 className="h-4 w-4 text-cyan-400" />
            <span className="mt-2 text-xs font-bold">JSON Data (.json)</span>
            <span className="text-[10px] text-slate-400">For engines & database backup</span>
          </button>

          <button
            onClick={() => setActiveFormat('md')}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              activeFormat === 'md'
                ? 'border-purple-500 bg-purple-950/40 text-purple-200 ring-1 ring-purple-500/40'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <FileCode2 className="h-4 w-4 text-purple-400" />
            <span className="mt-2 text-xs font-bold">Markdown (.md)</span>
            <span className="text-[10px] text-slate-400">GitHub / Obsidian format</span>
          </button>
        </div>

        {/* Preview Area */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Preview ({activeFormat.toUpperCase()})
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                <Download className="h-3.5 w-3.5" />
                Download File
              </button>
            </div>
          </div>

          <pre className="mt-2 max-h-64 overflow-x-auto overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300">
            {getContent()}
          </pre>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
