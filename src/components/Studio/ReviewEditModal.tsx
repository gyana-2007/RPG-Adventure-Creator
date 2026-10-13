'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Copy,
  PlusCircle,
  FileText,
  UserPlus,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { AIMode } from '@/types/adventure';

interface ReviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedText: string;
  mode: AIMode;
  onApply: (editedText: string, actionType: string) => void;
}

export const ReviewEditModal: React.FC<ReviewEditModalProps> = ({
  isOpen,
  onClose,
  generatedText,
  mode,
  onApply,
}) => {
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedText(generatedText);
  }, [generatedText]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'scene':
        return 'Review & Edit: Generated Scene';
      case 'adventure_outline':
        return 'Review & Edit: Adventure Premise & Outline';
      case 'character':
        return 'Review & Edit: Character / NPC Profile';
      case 'quest':
        return 'Review & Edit: Quest & Objective';
      case 'branching_choices':
        return 'Review & Edit: Branching Choices';
      case 'improve_text':
        return 'Review & Edit: Polished Story Prose';
      case 'continue_story':
        return 'Review & Edit: Story Continuation';
      default:
        return 'Review & Edit: AI Generation';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-purple-500/40 bg-slate-900 shadow-2xl shadow-purple-950/50">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 bg-slate-950/80 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-purple-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 ring-1 ring-purple-500/40">
                  Writer Review & Control
                </span>
                <span className="text-xs text-slate-400">Google Gemini Co-Pilot</span>
              </div>
              <h3 className="mt-0.5 font-serif text-lg font-bold text-white">
                {getModeTitle()}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close review modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="border-b border-slate-800 bg-purple-950/20 px-5 py-2.5 text-xs text-purple-200">
          <span>
            You have full control over the generated text. Review and freely edit below before committing to your adventure.
          </span>
        </div>

        {/* Content Editor */}
        <div className="flex-1 overflow-y-auto p-5">
          <label className="block text-xs font-semibold text-slate-300">
            Editable Draft:
          </label>
          <textarea
            rows={12}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-serif text-sm leading-relaxed text-slate-100 placeholder-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="Generated text will appear here..."
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Word count: {editedText.trim().split(/\s+/).filter(Boolean).length} words</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-300 hover:text-white"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/90 p-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Discard
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'scene' && (
              <>
                <button
                  onClick={() => onApply(editedText, 'replace_scene')}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  Replace Scene Text
                </button>
                <button
                  onClick={() => onApply(editedText, 'append_scene')}
                  className="rounded-lg border border-purple-500/40 bg-purple-950/60 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900"
                >
                  Append to Scene
                </button>
                <button
                  onClick={() => onApply(editedText, 'new_scene')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:brightness-110"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create as New Scene Node</span>
                </button>
              </>
            )}

            {mode === 'branching_choices' && (
              <>
                <button
                  onClick={() => onApply(editedText, 'append_scene')}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Append to Scene Narrative
                </button>
                <button
                  onClick={() => onApply(editedText, 'apply_choices')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:brightness-110"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Parse & Add as Branching Choices</span>
                </button>
              </>
            )}

            {mode === 'character' && (
              <>
                <button
                  onClick={() => onApply(editedText, 'append_scene')}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Insert in Scene Narrative
                </button>
                <button
                  onClick={() => onApply(editedText, 'add_character')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:brightness-110"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Save to Character Roster</span>
                </button>
              </>
            )}

            {mode === 'quest' && (
              <>
                <button
                  onClick={() => onApply(editedText, 'append_scene')}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Insert in Scene
                </button>
                <button
                  onClick={() => onApply(editedText, 'add_quest')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:brightness-110"
                >
                  <Check className="h-4 w-4" />
                  <span>Save to Quest Log</span>
                </button>
              </>
            )}

            {(mode === 'improve_text' || mode === 'continue_story' || mode === 'adventure_outline') && (
              <>
                <button
                  onClick={() => onApply(editedText, 'append_scene')}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Append to Narrative
                </button>
                <button
                  onClick={() => onApply(editedText, 'replace_scene')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:brightness-110"
                >
                  <Check className="h-4 w-4" />
                  <span>Apply to Current Scene</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
