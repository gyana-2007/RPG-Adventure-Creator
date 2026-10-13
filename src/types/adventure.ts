export type AdventureStatus = 'draft' | 'in-progress' | 'published';

export type AdventureGenre =
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Gothic Horror'
  | 'Cyberpunk'
  | 'Eldritch Mystery'
  | 'Post-Apocalyptic'
  | 'Steampunk'
  | 'Custom';

export interface ChoiceNode {
  id: string;
  label: string;
  targetSceneId: string;
  skillCheck?: {
    attribute: string;
    difficulty: number;
  };
  consequenceText?: string;
}

export interface SceneNode {
  id: string;
  title: string;
  content: string;
  choices: ChoiceNode[];
  isStartingScene?: boolean;
  isEndingScene?: boolean;
  endingType?: 'victory' | 'defeat' | 'neutral';
  mood?: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  name: string;
  role: 'Protagonist' | 'Companion' | 'Antagonist' | 'Merchant' | 'Quest Giver' | 'Creature';
  description: string;
  traits: string[];
  stats?: {
    strength?: number;
    agility?: number;
    intelligence?: number;
    health?: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  reward?: string;
}

export interface Adventure {
  id: string;
  title: string;
  genre: string;
  status: AdventureStatus;
  synopsis: string;
  tags: string[];
  scenes: SceneNode[];
  characters: Character[];
  quests: Quest[];
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export type AIMode =
  | 'adventure_outline'
  | 'scene'
  | 'character'
  | 'quest'
  | 'branching_choices'
  | 'improve_text'
  | 'continue_story';

export interface AIGenerateRequest {
  mode: AIMode;
  prompt: string;
  context?: {
    adventureTitle?: string;
    genre?: string;
    synopsis?: string;
    currentSceneTitle?: string;
    currentSceneContent?: string;
    selectedText?: string;
    tone?: string;
  };
  customApiKey?: string;
}

export interface AIGenerateResponse {
  success: boolean;
  content?: string;
  structuredData?: any;
  error?: string;
  missingKey?: boolean;
}

export interface BuildChecklistItem {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'configured' | 'pending_credentials';
  badge: string;
  details: string;
  credentialNote?: string;
}
