'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Feather,
  GitFork,
  Users,
  Swords,
  Wand2,
  Send,
  Loader2,
  AlertCircle,
  Lightbulb,
  Settings
} from 'lucide-react';
import { Adventure, SceneNode, AIMode } from '@/types/adventure';

interface AIGenerationPanelProps {
  adventure: Adventure;
  activeScene: SceneNode | null;
  onGenerationComplete: (text: string, mode: AIMode) => void;
  onOpenSettings: () => void;
  isGeminiConfigured: boolean;
  customApiKey?: string;
}

const PROMPT_SUGGESTIONS: Record<AIMode, string[]> = {
  scene: [
    'A waterlogged catacomb where ancient statues whisper when torches dim.',
    'A neon-drenched alleyway with a locked titanium blast door and humming transformer.',
    'An abandoned observatory whose brass telescope is pointing at an impossible star.',
  ],
  branching_choices: [
    'Generate 3 high-stakes choices balancing direct force, stealth, and esoteric lore.',
    'Provide 3 branching dilemmas where each option costs something valuable.',
    'Create 3 choices with specific skill checks (Strength, Agility, Intelligence).',
  ],
  character: [
    'A rogue netrunner with malfunctioning chrome optics and an encrypted datashard.',
    'A blind cathedral cartographer who navigates forgotten catacombs by echo.',
    'An eccentric merchant who trades in memories, forbidden maps, and cursed rings.',
  ],
  quest: [
    'Infiltrate a subterranean laboratory before the emergency meltdown cycle.',
    'Recover the Pearl of Abyssal Will from the sunken monarch’s scepter.',
    'Discover why the lighthouse beacon has turned oily violet.',
  ],
  improve_text: [
    'Heighten sensory tension: describe the smells, echoing sounds, and damp chill.',
    'Tighten pacing and enhance the sense of urgency for the player.',
    'Elevate into immersive second-person gothic prose.',
  ],
  continue_story: [
    'Continue what happens when the player steps across the threshold.',
    'Reveal a sudden twist or an unexpected presence emerging from the shadows.',
    'Escalate the environmental threat as time runs out.',
  ],
  adventure_outline: [
    'A dark fantasy quest to shatter the crown of the Drowned King.',
    'A cyberpunk corporate espionage mission in the neon underbelly of Sector 7.',
    'An investigation into a coastal lighthouse that draws ships into madness.',
  ],
};

export const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  adventure,
  activeScene,
  onGenerationComplete,
  onOpenSettings,
  isGeminiConfigured,
  customApiKey,
}) => {
  const [activeMode, setActiveMode] = useState<AIMode>('scene');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [includeSceneContext, setIncludeSceneContext] = useState(true);

  const hasKey = isGeminiConfigured || Boolean(customApiKey && customApiKey.trim().length > 0);

  const handleSelectMode = (mode: AIMode) => {
    setActiveMode(mode);
    setErrorMessage(null);
  };

  const handleUseSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && activeMode !== 'branching_choices' && activeMode !== 'continue_story') {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          prompt: prompt.trim(),
          customApiKey: customApiKey || undefined,
          context: {
            adventureTitle: adventure.title,
            genre: adventure.genre,
            synopsis: adventure.synopsis,
            currentSceneTitle: includeSceneContext ? activeScene?.title : undefined,
            currentSceneContent: includeSceneContext ? activeScene?.content : undefined,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            'Gemini generation failed. Please check your API key configuration.'
        );
        return;
      }

      if (data.content) {
        onGenerationComplete(data.content, activeMode);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error while contacting Gemini API endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-purple-500/30 bg-slate-900/90 p-5 shadow-xl shadow-purple-950/20 backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-white">
                Gemini AI Studio Co-Pilot
              </h3>
              <span className="rounded bg-purple-950/80 px-1.5 py-0.2 text-[10px] font-bold text-purple-300 ring-1 ring-purple-500/30">
                1.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prompt & generate story beats, scenes, NPCs, and branching choices
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          title="Configure Gemini API Key"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Warning if Key is Missing */}
      {!hasKey && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white">GEMINI_API_KEY Not Detected:</span> To generate story content with Google Gemini, set your API key in <code className="rounded bg-amber-950 px-1 text-amber-300">.env.local</code> or enter a session key in Settings.
            <div className="mt-1.5">
              <button
                onClick={onOpenSettings}
                className="font-bold text-amber-400 underline hover:text-amber-300"
              >
                Click here to add your API Key &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="mt-4">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Generation Mode
        </label>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleSelectMode('scene')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'scene'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Feather className="h-3.5 w-3.5 text-cyan-400" />
            <span>Scene / Room</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('branching_choices')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'branching_choices'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <GitFork className="h-3.5 w-3.5 text-purple-400" />
            <span>Branch Choices</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('character')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'character'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-pink-400" />
            <span>Character / NPC</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('quest')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'quest'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Swords className="h-3.5 w-3.5 text-amber-400" />
            <span>Quest Hook</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('improve_text')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'improve_text'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Polish Prose</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode('continue_story')}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeMode === 'continue_story'
                ? 'border-purple-500 bg-purple-950/60 text-purple-200 shadow ring-1 ring-purple-500/50'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Continue Story</span>
          </button>
        </div>
      </div>

      {/* Prompt Suggestions */}
      <div className="mt-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          <span>Inspiration Prompts:</span>
        </div>
        <div className="mt-1.5 space-y-1">
          {PROMPT_SUGGESTIONS[activeMode]?.slice(0, 2).map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUseSuggestion(sug)}
              className="w-full text-left rounded-md bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              &ldquo;{sug}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Main Prompt Form */}
      <form onSubmit={handleGenerate} className="mt-4 flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300">
            Prompt / Creative Direction:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              activeMode === 'branching_choices'
                ? 'e.g. Provide 3 tactical choices with attribute checks, or leave blank to infer from current scene'
                : 'Describe what you want Gemini to write or expand...'
            }
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Scene Context Checkbox */}
        {activeScene && (
          <label className="flex items-center gap-2 text-[11px] text-slate-400">
            <input
              type="checkbox"
              checked={includeSceneContext}
              onChange={(e) => setIncludeSceneContext(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0"
            />
            <span>
              Include current scene narrative (&ldquo;{activeScene.title}&rdquo;) as context
            </span>
          </label>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-2.5 text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-purple-200" />
              <span>Weaving Narrative with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate with Gemini &rarr; Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
