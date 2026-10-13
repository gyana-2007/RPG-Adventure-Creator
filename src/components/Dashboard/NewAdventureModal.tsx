'use client';

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Compass, Plus, Wand2 } from 'lucide-react';
import { Adventure, AdventureGenre, AdventureStatus } from '@/types/adventure';

interface NewAdventureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (adventure: Adventure) => void;
}

const PRESETS = [
  {
    id: 'dungeon',
    name: 'Dungeon Crawl',
    genre: 'Fantasy',
    title: 'The Vault of the Silver Lich',
    synopsis: 'Deep under the Frostpeaks, a sealed granite labyrinth opens once every blood moon.',
    tags: ['Dungeon', 'Dark Fantasy', 'Undead'],
    sceneTitle: 'The Shattered Portcullis',
    sceneContent: 'Ice crystals cling to your steel pauldrons. Ahead, the massive iron portcullis lies broken inward, as if smashed by something of unnatural mass.',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Infiltration',
    genre: 'Cyberpunk',
    title: 'Ghost in the Datastream',
    synopsis: 'A high-stakes data extraction from an orbital laboratory owned by the Tyrell-Zaibatsu conglomerate.',
    tags: ['Cyberpunk', 'Hacking', 'Corporate Noir'],
    sceneTitle: 'Sub-Orbital Airlock',
    sceneContent: 'Zero gravity tugs at your mag-boots. Neon diagnostics flicker across your helmet HUD as the airlock pressurizes.',
  },
  {
    id: 'eldritch',
    name: 'Eldritch Mystery',
    genre: 'Eldritch Mystery',
    title: 'The Bell of the Drowned Chapel',
    synopsis: 'A lonely fishing village where the church bell tolls every night from twenty fathoms beneath the waves.',
    tags: ['Cosmic Horror', 'Investigation', 'Coastal'],
    sceneTitle: 'The Salt-Crusted Shingle',
    sceneContent: 'Black rain patters into the sea foam. In the distance, an impossible violet glow illuminates the water from deep below.',
  },
  {
    id: 'custom',
    name: 'Blank Canvas',
    genre: 'Custom',
    title: 'My New RPG Adventure',
    synopsis: 'A gripping journey through unknown lands.',
    tags: ['Adventure', 'Interactive'],
    sceneTitle: 'The Journey Begins',
    sceneContent: 'You stand at the crossroads as the wind rises. The path forward is unwritten.',
  },
];

export const NewAdventureModal: React.FC<NewAdventureModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [selectedPreset, setSelectedPreset] = useState('dungeon');
  const [title, setTitle] = useState(PRESETS[0].title);
  const [genre, setGenre] = useState<string>(PRESETS[0].genre);
  const [status, setStatus] = useState<AdventureStatus>('draft');
  const [synopsis, setSynopsis] = useState(PRESETS[0].synopsis);
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState(PRESETS[0].tags.join(', '));

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setTitle(p.title);
      setGenre(p.genre);
      setSynopsis(p.synopsis);
      setTagsInput(p.tags.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenPreset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[3];

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newAdventure: Adventure = {
      id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      genre: genre.trim() || 'Fantasy',
      status,
      synopsis: synopsis.trim(),
      author: author.trim() || 'Anonymous Writer',
      tags: tags.length > 0 ? tags : ['RPG', genre],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: `scene-start-${Date.now()}`,
          title: chosenPreset.sceneTitle,
          isStartingScene: true,
          mood: 'Tense',
          updatedAt: new Date().toISOString(),
          content: chosenPreset.sceneContent,
          choices: [
            {
              id: `choice-1-${Date.now()}`,
              label: 'Proceed cautiously forward and inspect the surroundings',
              targetSceneId: '',
              consequenceText: 'You advance step by step, taking note of hidden hazards.',
            },
          ],
        },
      ],
      characters: [],
      quests: [],
    };

    onCreate(newAdventure);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Create New RPG Adventure
              </h3>
              <p className="text-xs text-slate-400">
                Choose a world template or craft from a blank slate.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close creation modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Picker */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Studio Templates
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  selectedPreset === p.id
                    ? 'border-amber-500 bg-amber-950/40 text-amber-200 ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{p.name}</span>
                <span className="text-[10px] text-slate-400">{p.genre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Adventure Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Crypt of the Sunken King"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Fantasy">Fantasy</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Eldritch Mystery">Eldritch Mystery</option>
                <option value="Gothic Horror">Gothic Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Post-Apocalyptic">Post-Apocalyptic</option>
                <option value="Steampunk">Steampunk</option>
                <option value="Custom">Custom / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdventureStatus)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Synopsis & Lore Premise
            </label>
            <textarea
              rows={3}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="High concept hook, setting atmosphere, and player motive..."
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Author / Lead Writer
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or pen name"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Dungeon, Mystery, High-Stakes"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              <span>Create Adventure</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
