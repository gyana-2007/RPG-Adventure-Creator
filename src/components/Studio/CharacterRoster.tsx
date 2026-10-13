'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, Shield, Heart, Zap, Brain, Sparkles } from 'lucide-react';
import { Character } from '@/types/adventure';

interface CharacterRosterProps {
  characters: Character[];
  onUpdateCharacters: (chars: Character[]) => void;
  onOpenAIForCharacter: () => void;
}

export const CharacterRoster: React.FC<CharacterRosterProps> = ({
  characters,
  onUpdateCharacters,
  onOpenAIForCharacter,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCharacter = () => {
    const newChar: Character = {
      id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'New Character',
      role: 'Companion',
      description: 'A mysterious traveler met along the journey.',
      traits: ['Wary', 'Resourceful'],
      stats: { strength: 10, agility: 10, intelligence: 10, health: 30 },
    };
    onUpdateCharacters([...characters, newChar]);
    setEditingId(newChar.id);
  };

  const handleUpdate = (id: string, updates: Partial<Character>) => {
    onUpdateCharacters(characters.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDelete = (id: string) => {
    onUpdateCharacters(characters.filter((c) => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-pink-400" />
          <h4 className="font-serif text-sm font-bold text-white">
            Characters & Dramatis Personae ({characters.length})
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIForCharacter}
            className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-900"
          >
            <Sparkles className="h-3 w-3" />
            <span>Generate NPC</span>
          </button>
          <button
            onClick={handleAddCharacter}
            className="flex items-center gap-1 rounded-lg bg-pink-500/20 px-2.5 py-1 text-xs font-semibold text-pink-300 ring-1 ring-pink-500/40 hover:bg-pink-500 hover:text-slate-950 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Character</span>
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {characters.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400">
            <p>No characters created yet.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Add allies, villains, or use the Gemini AI NPC Generator to create unique lore figures.
            </p>
          </div>
        )}

        {characters.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleUpdate(c.id, { name: e.target.value })}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 font-serif text-sm font-bold text-white focus:border-pink-500 focus:outline-none"
                    placeholder="Character Name..."
                  />

                  <select
                    value={c.role}
                    onChange={(e) => handleUpdate(c.id, { role: e.target.value as any })}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-pink-300 focus:outline-none"
                  >
                    <option value="Protagonist">Protagonist</option>
                    <option value="Companion">Companion</option>
                    <option value="Antagonist">Antagonist / Villain</option>
                    <option value="Merchant">Merchant</option>
                    <option value="Quest Giver">Quest Giver</option>
                    <option value="Creature">Creature / Monster</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  value={c.description}
                  onChange={(e) => handleUpdate(c.id, { description: e.target.value })}
                  placeholder="Appearance, backstory, motivation, speech style..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-pink-500 focus:outline-none"
                />

                {/* Traits & Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">Traits:</span>
                    <input
                      type="text"
                      value={c.traits.join(', ')}
                      onChange={(e) =>
                        handleUpdate(c.id, {
                          traits: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. Brave, Secretive, Cursed"
                      className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                    <span className="flex items-center gap-1" title="Strength">
                      <Shield className="h-3 w-3 text-red-400" />
                      STR:
                      <input
                        type="number"
                        value={c.stats?.strength ?? 10}
                        onChange={(e) =>
                          handleUpdate(c.id, {
                            stats: { ...c.stats, strength: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-10 rounded border border-slate-800 bg-slate-900 px-1 text-center text-white"
                      />
                    </span>
                    <span className="flex items-center gap-1" title="Agility">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      AGI:
                      <input
                        type="number"
                        value={c.stats?.agility ?? 10}
                        onChange={(e) =>
                          handleUpdate(c.id, {
                            stats: { ...c.stats, agility: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-10 rounded border border-slate-800 bg-slate-900 px-1 text-center text-white"
                      />
                    </span>
                    <span className="flex items-center gap-1" title="Intelligence">
                      <Brain className="h-3 w-3 text-purple-400" />
                      INT:
                      <input
                        type="number"
                        value={c.stats?.intelligence ?? 10}
                        onChange={(e) =>
                          handleUpdate(c.id, {
                            stats: { ...c.stats, intelligence: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-10 rounded border border-slate-800 bg-slate-900 px-1 text-center text-white"
                      />
                    </span>
                    <span className="flex items-center gap-1" title="Health Points">
                      <Heart className="h-3 w-3 text-rose-400" />
                      HP:
                      <input
                        type="number"
                        value={c.stats?.health ?? 30}
                        onChange={(e) =>
                          handleUpdate(c.id, {
                            stats: { ...c.stats, health: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-12 rounded border border-slate-800 bg-slate-900 px-1 text-center text-white"
                      />
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                title="Delete character"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
