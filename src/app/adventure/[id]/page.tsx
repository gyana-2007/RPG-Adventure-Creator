'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  Save,
  Play,
  Download,
  Sparkles,
  BookOpen,
  Layers,
  Users,
  Swords,
  Settings,
  Check,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { StoryEditor } from '@/components/Studio/StoryEditor';
import { SceneManager } from '@/components/Studio/SceneManager';
import { AIGenerationPanel } from '@/components/Studio/AIGenerationPanel';
import { ReviewEditModal } from '@/components/Studio/ReviewEditModal';
import { CharacterRoster } from '@/components/Studio/CharacterRoster';
import { QuestLog } from '@/components/Studio/QuestLog';
import { Playtester } from '@/components/Studio/Playtester';
import { ExportModal } from '@/components/Studio/ExportModal';
import { BuildChecklistModal } from '@/components/BuildChecklistModal';
import { SettingsModal } from '@/components/Studio/SettingsModal';
import { Adventure, SceneNode, AIMode, AdventureStatus } from '@/types/adventure';
import { storageService } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdventureStudioPage() {
  const params = useParams();
  const router = useRouter();
  const adventureId = params.id as string;

  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters' | 'quests' | 'meta'>('scenes');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // AI & Modals
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    text: string;
    mode: AIMode;
  }>({ isOpen: false, text: '', mode: 'scene' });

  const [isPlaytesting, setIsPlaytesting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence status
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [isGeminiReady, setIsGeminiReady] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setIsSupabaseReady(isSupabaseConfigured());
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('rpg_custom_gemini_key') || '' : '';
    setCustomApiKey(savedKey);

    fetch('/api/gemini/generate', { method: 'POST', body: JSON.stringify({ mode: 'scene', prompt: 'test' }) })
      .then((r) => r.json())
      .then((res) => {
        setIsGeminiReady(!res.missingKey);
      })
      .catch(() => {
        setIsGeminiReady(false);
      });

    loadAdventure();
  }, [adventureId]);

  const loadAdventure = async () => {
    setIsLoading(true);
    try {
      const { adventure: loaded } = await storageService.getAdventureById(adventureId);
      if (loaded) {
        setAdventure(loaded);
        if (loaded.scenes && loaded.scenes.length > 0) {
          const starting = loaded.scenes.find((s) => s.isStartingScene) || loaded.scenes[0];
          setActiveSceneId(starting.id);
        }
      } else {
        showToast('Adventure not found. Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (overrideAdv?: Adventure) => {
    const advToSave = overrideAdv || adventure;
    if (!advToSave) return;

    setSaveStatus('saving');
    try {
      const res = await storageService.saveAdventure(advToSave);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
      if (res.error) {
        console.warn(res.error);
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleUpdateActiveScene = (updatedScene: SceneNode) => {
    if (!adventure) return;
    const newScenes = adventure.scenes.map((s) => (s.id === updatedScene.id ? updatedScene : s));
    const updatedAdv = { ...adventure, scenes: newScenes, updatedAt: new Date().toISOString() };
    setAdventure(updatedAdv);
    handleSave(updatedAdv);
  };

  const handleAddScene = () => {
    if (!adventure) return;
    const newScene: SceneNode = {
      id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `Scene ${adventure.scenes.length + 1}`,
      content: 'You step into a new chamber...',
      choices: [],
      mood: 'Tense',
      updatedAt: new Date().toISOString(),
    };
    const updatedAdv = {
      ...adventure,
      scenes: [...adventure.scenes, newScene],
      updatedAt: new Date().toISOString(),
    };
    setAdventure(updatedAdv);
    setActiveSceneId(newScene.id);
    handleSave(updatedAdv);
    showToast(`Created "${newScene.title}"`);
  };

  const handleDeleteScene = (sceneId: string) => {
    if (!adventure || adventure.scenes.length <= 1) return;
    const newScenes = adventure.scenes.filter((s) => s.id !== sceneId);
    const nextActive = newScenes[0]?.id || '';
    const updatedAdv = { ...adventure, scenes: newScenes, updatedAt: new Date().toISOString() };
    setAdventure(updatedAdv);
    setActiveSceneId(nextActive);
    handleSave(updatedAdv);
    showToast('Deleted scene');
  };

  // AI Handler
  const handleAIGenerationComplete = (text: string, mode: AIMode) => {
    setReviewModalData({
      isOpen: true,
      text,
      mode,
    });
  };

  // Applying Reviewed Content
  const handleApplyReviewedContent = (editedText: string, actionType: string) => {
    if (!adventure) return;

    const activeScene = adventure.scenes.find((s) => s.id === activeSceneId);

    if (actionType === 'replace_scene' && activeScene) {
      const updated = { ...activeScene, content: editedText, updatedAt: new Date().toISOString() };
      handleUpdateActiveScene(updated);
      showToast('Applied AI text to scene');
    } else if (actionType === 'append_scene' && activeScene) {
      const newContent = `${activeScene.content}\n\n${editedText}`.trim();
      const updated = { ...activeScene, content: newContent, updatedAt: new Date().toISOString() };
      handleUpdateActiveScene(updated);
      showToast('Appended AI text to scene');
    } else if (actionType === 'new_scene') {
      const newScene: SceneNode = {
        id: `scene-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `Scene: ${editedText.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30) || 'New Chamber'}`,
        content: editedText,
        choices: [],
        mood: 'Ominous',
        updatedAt: new Date().toISOString(),
      };
      const updatedAdv = {
        ...adventure,
        scenes: [...adventure.scenes, newScene],
        updatedAt: new Date().toISOString(),
      };
      setAdventure(updatedAdv);
      setActiveSceneId(newScene.id);
      handleSave(updatedAdv);
      showToast('Created new scene from AI content');
    } else if (actionType === 'apply_choices' && activeScene) {
      // Parse lines into choices
      const lines = editedText.split('\n').filter((l) => l.trim().length > 0);
      const newChoices = lines.slice(0, 3).map((line, idx) => ({
        id: `choice-${Date.now()}-${idx}`,
        label: line.replace(/^[0-9-.*#\s]+/, '').trim(),
        targetSceneId: '',
        consequenceText: '',
      }));
      const updated = {
        ...activeScene,
        choices: [...(activeScene.choices || []), ...newChoices],
        updatedAt: new Date().toISOString(),
      };
      handleUpdateActiveScene(updated);
      showToast('Parsed and added branching choices');
    } else if (actionType === 'add_character') {
      const newChar = {
        id: `char-${Date.now()}`,
        name: editedText.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'AI Character',
        role: 'Companion' as any,
        description: editedText,
        traits: ['Enigmatic'],
        stats: { strength: 10, agility: 10, intelligence: 12, health: 35 },
      };
      const updatedAdv = {
        ...adventure,
        characters: [...(adventure.characters || []), newChar],
      };
      setAdventure(updatedAdv);
      handleSave(updatedAdv);
      showToast('Saved character to roster');
    } else if (actionType === 'add_quest') {
      const newQuest = {
        id: `quest-${Date.now()}`,
        title: editedText.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'AI Quest Hook',
        description: editedText,
        status: 'active' as any,
        reward: 'Legendary Lore & Artifact',
      };
      const updatedAdv = {
        ...adventure,
        quests: [...(adventure.quests || []), newQuest],
      };
      setAdventure(updatedAdv);
      handleSave(updatedAdv);
      showToast('Saved quest to log');
    }

    setReviewModalData({ isOpen: false, text: '', mode: 'scene' });
  };

  if (isLoading || !adventure) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex items-center gap-3">
          <Compass className="h-6 w-6 animate-spin text-amber-400" />
          <span className="font-serif text-base">Opening Writing Studio...</span>
        </div>
      </div>
    );
  }

  const activeScene = adventure.scenes?.find((s) => s.id === activeSceneId) || adventure.scenes?.[0] || null;

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-amber-500/50 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-amber-300 shadow-xl shadow-black/60 backdrop-blur animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady || Boolean(customApiKey)}
        activeAdventureTitle={adventure.title}
      />

      {/* Studio Header Bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-16 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adventure.title}
                onChange={(e) => {
                  const updated = { ...adventure, title: e.target.value };
                  setAdventure(updated);
                  handleSave(updated);
                }}
                className="bg-transparent font-serif text-lg font-bold text-white focus:outline-none focus:ring-0 sm:text-xl"
              />
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                {adventure.genre}
              </span>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center gap-2">
            {/* Status Selector */}
            <select
              value={adventure.status}
              onChange={(e) => {
                const updated = {
                  ...adventure,
                  status: e.target.value as AdventureStatus,
                };
                setAdventure(updated);
                handleSave(updated);
              }}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-amber-300 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="published">Published</option>
            </select>

            {/* Playtest Button */}
            <button
              onClick={() => setIsPlaytesting(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60"
            >
              <Play className="h-3.5 w-3.5 text-emerald-400" />
              <span>Playtest</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setIsExporting(true)}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => handleSave()}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              {saveStatus === 'saving' ? (
                <span>Saving...</span>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'scenes'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Story & Scenes ({adventure.scenes?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'characters'
                ? 'bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Characters & NPCs ({adventure.characters?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'quests'
                ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="h-3.5 w-3.5" />
            <span>Quests & Hooks ({adventure.quests?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === 'meta'
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Synopsis & World Lore</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'scenes' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Scenes Graph Sidebar (3 cols) */}
            <div className="lg:col-span-3">
              <SceneManager
                scenes={adventure.scenes || []}
                activeSceneId={activeSceneId}
                onSelectScene={(id) => setActiveSceneId(id)}
                onAddScene={handleAddScene}
                onDeleteScene={handleDeleteScene}
                onOpenAI={() => setIsAiPanelOpen(true)}
              />
            </div>

            {/* Middle: Scene Narrative & Choices Editor (6 cols) */}
            <div className="lg:col-span-6">
              {activeScene ? (
                <StoryEditor
                  scene={activeScene}
                  allScenes={adventure.scenes || []}
                  onUpdateScene={handleUpdateActiveScene}
                  onOpenAIForScene={() => setIsAiPanelOpen(true)}
                />
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
                  <p>No scene selected.</p>
                  <button
                    onClick={handleAddScene}
                    className="mt-2 text-xs font-bold text-amber-400 underline"
                  >
                    Add a new scene
                  </button>
                </div>
              )}
            </div>

            {/* Right: AI Co-Pilot Panel (3 cols) */}
            <div className="lg:col-span-3">
              <AIGenerationPanel
                adventure={adventure}
                activeScene={activeScene}
                onGenerationComplete={handleAIGenerationComplete}
                onOpenSettings={() => setIsSettingsOpen(true)}
                isGeminiConfigured={isGeminiReady}
                customApiKey={customApiKey}
              />
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <CharacterRoster
                characters={adventure.characters || []}
                onUpdateCharacters={(chars) => {
                  const updated = { ...adventure, characters: chars };
                  setAdventure(updated);
                  handleSave(updated);
                }}
                onOpenAIForCharacter={() => {
                  setActiveTab('scenes');
                  setIsAiPanelOpen(true);
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <AIGenerationPanel
                adventure={adventure}
                activeScene={activeScene}
                onGenerationComplete={handleAIGenerationComplete}
                onOpenSettings={() => setIsSettingsOpen(true)}
                isGeminiConfigured={isGeminiReady}
                customApiKey={customApiKey}
              />
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <QuestLog
                quests={adventure.quests || []}
                onUpdateQuests={(quests) => {
                  const updated = { ...adventure, quests };
                  setAdventure(updated);
                  handleSave(updated);
                }}
                onOpenAIForQuest={() => {
                  setActiveTab('scenes');
                  setIsAiPanelOpen(true);
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <AIGenerationPanel
                adventure={adventure}
                activeScene={activeScene}
                onGenerationComplete={handleAIGenerationComplete}
                onOpenSettings={() => setIsSettingsOpen(true)}
                isGeminiConfigured={isGeminiReady}
                customApiKey={customApiKey}
              />
            </div>
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">
              Adventure Worldbuilding & Synopsis
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Synopsis & Premise Hook
              </label>
              <textarea
                rows={4}
                value={adventure.synopsis}
                onChange={(e) => {
                  const updated = { ...adventure, synopsis: e.target.value };
                  setAdventure(updated);
                  handleSave(updated);
                }}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Genre</label>
                <input
                  type="text"
                  value={adventure.genre}
                  onChange={(e) => {
                    const updated = { ...adventure, genre: e.target.value };
                    setAdventure(updated);
                    handleSave(updated);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Author</label>
                <input
                  type="text"
                  value={adventure.author || ''}
                  onChange={(e) => {
                    const updated = { ...adventure, author: e.target.value };
                    setAdventure(updated);
                    handleSave(updated);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={adventure.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                  const updated = { ...adventure, tags };
                  setAdventure(updated);
                  handleSave(updated);
                }}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white"
              />
            </div>
          </div>
        )}
      </main>

      {/* Review & Edit Modal (Crucial AI Constraint) */}
      <ReviewEditModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData({ isOpen: false, text: '', mode: 'scene' })}
        generatedText={reviewModalData.text}
        mode={reviewModalData.mode}
        onApply={handleApplyReviewedContent}
      />

      {/* Interactive Playtester */}
      <Playtester
        isOpen={isPlaytesting}
        onClose={() => setIsPlaytesting(false)}
        adventure={adventure}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        adventure={adventure}
      />

      {/* Build Checklist Modal */}
      <BuildChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady || Boolean(customApiKey)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isSupabaseConfigured={isSupabaseReady}
        isGeminiConfigured={isGeminiReady}
        customApiKey={customApiKey}
        onSaveCustomApiKey={(k) => {
          setCustomApiKey(k);
          if (typeof window !== 'undefined') {
            localStorage.setItem('rpg_custom_gemini_key', k);
          }
          showToast('Updated Gemini API key');
        }}
      />
    </div>
  );
}
