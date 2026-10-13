'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Compass, ArrowRight, Dices, Trophy, Skull } from 'lucide-react';
import { Adventure, SceneNode, ChoiceNode } from '@/types/adventure';

interface PlaytesterProps {
  isOpen: boolean;
  onClose: () => void;
  adventure: Adventure | null;
}

export const Playtester: React.FC<PlaytesterProps> = ({ isOpen, onClose, adventure }) => {
  const [currentSceneId, setCurrentSceneId] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (adventure && adventure.scenes && adventure.scenes.length > 0) {
      const start = adventure.scenes.find((s) => s.isStartingScene) || adventure.scenes[0];
      setCurrentSceneId(start.id);
      setHistory([start.id]);
      setAlertMessage(null);
    }
  }, [adventure, isOpen]);

  if (!isOpen || !adventure) return null;

  const currentScene = adventure.scenes.find((s) => s.id === currentSceneId) || null;

  const handleChoose = (choice: ChoiceNode) => {
    if (choice.consequenceText) {
      setAlertMessage(choice.consequenceText);
    } else {
      setAlertMessage(null);
    }

    if (choice.targetSceneId) {
      setCurrentSceneId(choice.targetSceneId);
      setHistory((prev) => [...prev, choice.targetSceneId]);
    }
  };

  const handleRestart = () => {
    const start = adventure.scenes.find((s) => s.isStartingScene) || adventure.scenes[0];
    if (start) {
      setCurrentSceneId(start.id);
      setHistory([start.id]);
      setAlertMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-white">
                  Interactive Playtester
                </span>
                <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{adventure.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Restart from beginning"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close Playtester"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Playtest Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {alertMessage && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 ring-1 ring-amber-500/20 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Dices className="h-4 w-4" />
                <span>Action Consequence:</span>
              </div>
              <p className="mt-1">{alertMessage}</p>
            </div>
          )}

          {currentScene ? (
            <div>
              {/* Scene Title & Mood */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-serif text-xl font-bold text-amber-300">
                  {currentScene.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  {currentScene.mood && (
                    <span className="rounded-full bg-purple-950/60 px-2.5 py-0.5 text-[11px] text-purple-300 ring-1 ring-purple-500/30">
                      Mood: {currentScene.mood}
                    </span>
                  )}
                  {currentScene.isEndingScene && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        currentScene.endingType === 'victory'
                          ? 'bg-emerald-950 text-emerald-300 ring-1 ring-emerald-500/40'
                          : 'bg-rose-950 text-rose-300 ring-1 ring-rose-500/40'
                      }`}
                    >
                      {currentScene.endingType === 'victory' ? (
                        <Trophy className="h-3 w-3" />
                      ) : (
                        <Skull className="h-3 w-3" />
                      )}
                      {currentScene.endingType?.toUpperCase() || 'FINALE'}
                    </span>
                  )}
                </div>
              </div>

              {/* Narrative Content */}
              <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-5 font-serif text-base leading-relaxed text-slate-100 whitespace-pre-line shadow-inner">
                {currentScene.content || '(This scene has no narrative text yet. Open the editor to write it.)'}
              </div>

              {/* Choices List */}
              <div className="mt-6">
                {currentScene.choices && currentScene.choices.length > 0 ? (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                      What do you do?
                    </h4>
                    <div className="mt-3 space-y-2.5">
                      {currentScene.choices.map((ch, idx) => (
                        <button
                          key={ch.id || idx}
                          onClick={() => handleChoose(ch)}
                          className="group flex w-full flex-col items-start rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-left transition-all hover:border-amber-500/60 hover:bg-slate-850 hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.99]"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-medium text-slate-100 group-hover:text-amber-300 text-sm">
                              {ch.label}
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-amber-400" />
                          </div>
                          {ch.skillCheck && (
                            <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-cyan-400">
                              <Dices className="h-3 w-3" />
                              <span>
                                {ch.skillCheck.attribute} DC {ch.skillCheck.difficulty}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                    <p className="text-sm text-slate-400">
                      You have reached the conclusion of this storyline.
                    </p>
                    <button
                      onClick={handleRestart}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Play Again From Start
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p>Scene not found or graph disconnected.</p>
              <button
                onClick={handleRestart}
                className="mt-2 text-xs text-amber-400 underline"
              >
                Return to start
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/70 px-6 py-2.5 text-[11px] text-slate-400">
          <span>Scenes visited: {history.length}</span>
          <span>Press ESC or close button to exit simulator</span>
        </div>
      </div>
    </div>
  );
};
