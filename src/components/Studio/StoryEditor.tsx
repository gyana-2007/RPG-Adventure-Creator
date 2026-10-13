'use client';

import React, { useState } from 'react';
import {
  Feather,
  Plus,
  Trash2,
  GitFork,
  Dices,
  Flag,
  Trophy,
  Skull,
  FileText,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SceneNode, ChoiceNode } from '@/types/adventure';

interface StoryEditorProps {
  scene: SceneNode;
  allScenes: SceneNode[];
  onUpdateScene: (updated: SceneNode) => void;
  onOpenAIForScene: () => void;
}

const COMMON_MOODS = [
  'Ominous',
  'Tense',
  'Mystical',
  'Claustrophobic',
  'Epic',
  'Eerie',
  'Gloomy',
  'Triumphant',
  'Melancholic',
];

export const StoryEditor: React.FC<StoryEditorProps> = ({
  scene,
  allScenes,
  onUpdateScene,
  onOpenAIForScene,
}) => {
  const [isParchmentMode, setIsParchmentMode] = useState(false);

  const wordCount = scene.content.trim() ? scene.content.trim().split(/\s+/).length : 0;
  const charCount = scene.content.length;

  const handleTitleChange = (newTitle: string) => {
    onUpdateScene({ ...scene, title: newTitle, updatedAt: new Date().toISOString() });
  };

  const handleContentChange = (newContent: string) => {
    onUpdateScene({ ...scene, content: newContent, updatedAt: new Date().toISOString() });
  };

  const handleMoodChange = (mood: string) => {
    onUpdateScene({ ...scene, mood, updatedAt: new Date().toISOString() });
  };

  const handleToggleStarting = () => {
    onUpdateScene({
      ...scene,
      isStartingScene: !scene.isStartingScene,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleEnding = () => {
    onUpdateScene({
      ...scene,
      isEndingScene: !scene.isEndingScene,
      endingType: scene.isEndingScene ? undefined : 'victory',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEndingTypeChange = (type: 'victory' | 'defeat' | 'neutral') => {
    onUpdateScene({ ...scene, endingType: type, updatedAt: new Date().toISOString() });
  };

  // Choice Operations
  const handleAddChoice = () => {
    const newChoice: ChoiceNode = {
      id: `choice-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: 'Examine the mysterious surroundings',
      targetSceneId: allScenes.find((s) => s.id !== scene.id)?.id || '',
      consequenceText: '',
    };

    onUpdateScene({
      ...scene,
      choices: [...(scene.choices || []), newChoice],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateChoice = (choiceId: string, updates: Partial<ChoiceNode>) => {
    const updatedChoices = (scene.choices || []).map((ch) =>
      ch.id === choiceId ? { ...ch, ...updates } : ch
    );
    onUpdateScene({ ...scene, choices: updatedChoices, updatedAt: new Date().toISOString() });
  };

  const handleDeleteChoice = (choiceId: string) => {
    const updatedChoices = (scene.choices || []).filter((ch) => ch.id !== choiceId);
    onUpdateScene({ ...scene, choices: updatedChoices, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Scene Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
              <Feather className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={scene.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Scene Title..."
              className="w-full bg-transparent font-serif text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Scene Tags & Flags */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStarting}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                scene.isStartingScene
                  ? 'bg-amber-950 text-amber-300 ring-1 ring-amber-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle as adventure entry point"
            >
              <Flag className="h-3.5 w-3.5" />
              <span>{scene.isStartingScene ? 'Starting Scene' : 'Set as Start'}</span>
            </button>

            <button
              onClick={handleToggleEnding}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                scene.isEndingScene
                  ? 'bg-rose-950 text-rose-300 ring-1 ring-rose-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle as narrative conclusion"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>{scene.isEndingScene ? 'Ending Node' : 'Set as Ending'}</span>
            </button>
          </div>
        </div>

        {/* Secondary controls: Mood & Ending Type */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Atmosphere / Mood:</span>
            <select
              value={scene.mood || ''}
              onChange={(e) => handleMoodChange(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-purple-300 focus:outline-none"
            >
              <option value="">Select Mood...</option>
              {COMMON_MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {scene.isEndingScene && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Outcome:</span>
              <select
                value={scene.endingType || 'victory'}
                onChange={(e) =>
                  handleEndingTypeChange(e.target.value as 'victory' | 'defeat' | 'neutral')
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="victory">Victory / Triumph</option>
                <option value="defeat">Defeat / Peril</option>
                <option value="neutral">Ambiguous / Neutral</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Narrative Writing Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <h4 className="font-serif text-sm font-bold text-white">
              Scene Narrative & Descriptive Prose
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setIsParchmentMode(!isParchmentMode)}
              className="rounded px-2 py-0.5 text-slate-400 hover:text-white"
              title="Toggle parchment writing feel"
            >
              {isParchmentMode ? 'Dark Theme' : 'Parchment Feel'}
            </button>
            <span className="font-mono text-slate-400">
              {wordCount} words ({charCount} chars)
            </span>
            <button
              onClick={onOpenAIForScene}
              className="flex items-center gap-1.5 rounded-lg bg-purple-950/60 px-2.5 py-1 text-xs font-semibold text-purple-300 ring-1 ring-purple-500/30 hover:bg-purple-900"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gemini Polish</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <textarea
            rows={14}
            value={scene.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write the room or scene narrative in second-person ('You stand at the threshold of the sunken crypt...'). Describe sights, sounds, tactile details, and the immediate obstacle."
            className={`w-full rounded-xl border p-4 text-base leading-relaxed transition-all focus:outline-none ${
              isParchmentMode
                ? 'parchment-mode border-amber-900/30 text-slate-900'
                : 'border-slate-800 bg-slate-950/90 font-serif text-slate-100 placeholder-slate-600 focus:border-amber-500/60'
            }`}
          />
        </div>
      </div>

      {/* Branching Choices & Decision Paths */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-purple-400" />
            <div>
              <h4 className="font-serif text-sm font-bold text-white">
                Branching Choices ({scene.choices?.length || 0})
              </h4>
              <p className="text-[11px] text-slate-400">
                Decision paths available to the player from this scene
              </p>
            </div>
          </div>

          <button
            onClick={handleAddChoice}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/40 hover:bg-amber-500 hover:text-slate-950 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Branching Choice</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {(!scene.choices || scene.choices.length === 0) && (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
              <p>No branching choices connected yet.</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Click &ldquo;Add Branching Choice&rdquo; above or use Gemini AI Co-Pilot to generate 3 diverse paths.
              </p>
            </div>
          )}

          {scene.choices?.map((ch, idx) => (
            <div
              key={ch.id || idx}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  {/* Choice Label */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400">
                      Choice Prompt / Action
                    </label>
                    <input
                      type="text"
                      value={ch.label}
                      onChange={(e) => handleUpdateChoice(ch.id, { label: e.target.value })}
                      placeholder="e.g. Pry loose the corroded brass grating..."
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Destination & Skill Check Grid */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Destination Target Scene */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400">
                        Leads to Scene Node:
                      </label>
                      <select
                        value={ch.targetSceneId || ''}
                        onChange={(e) =>
                          handleUpdateChoice(ch.id, { targetSceneId: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="">Select Target Destination...</option>
                        {allScenes.map((target) => (
                          <option key={target.id} value={target.id}>
                            {target.title} {target.id === scene.id ? '(Loops to Self)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Skill Check (Optional) */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400">
                        Skill Check (Optional):
                      </label>
                      <div className="mt-1 flex gap-2">
                        <select
                          value={ch.skillCheck?.attribute || 'None'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'None') {
                              handleUpdateChoice(ch.id, { skillCheck: undefined });
                            } else {
                              handleUpdateChoice(ch.id, {
                                skillCheck: {
                                  attribute: val,
                                  difficulty: ch.skillCheck?.difficulty || 12,
                                },
                              });
                            }
                          }}
                          className="w-1/2 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="None">No Check</option>
                          <option value="Strength">Strength</option>
                          <option value="Agility">Agility</option>
                          <option value="Intelligence">Intelligence</option>
                          <option value="Sanity">Sanity</option>
                          <option value="Charisma">Charisma</option>
                        </select>

                        {ch.skillCheck && (
                          <input
                            type="number"
                            min={5}
                            max={25}
                            value={ch.skillCheck.difficulty}
                            onChange={(e) =>
                              handleUpdateChoice(ch.id, {
                                skillCheck: {
                                  attribute: ch.skillCheck!.attribute,
                                  difficulty: parseInt(e.target.value) || 10,
                                },
                              })
                            }
                            placeholder="DC 12"
                            className="w-1/2 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Immediate Consequence */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400">
                      Consequence / Immediate Reaction:
                    </label>
                    <input
                      type="text"
                      value={ch.consequenceText || ''}
                      onChange={(e) =>
                        handleUpdateChoice(ch.id, { consequenceText: e.target.value })
                      }
                      placeholder="e.g. A rusted valve screeches, echoing through the flooded halls..."
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteChoice(ch.id)}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                  title="Delete choice"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
