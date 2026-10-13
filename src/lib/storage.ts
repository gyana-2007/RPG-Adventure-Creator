import { Adventure } from '@/types/adventure';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'rpg_adventure_creator_adventures_v1';

export const STARTER_ADVENTURES: Adventure[] = [
  {
    id: 'crypt-sunken-king',
    title: 'The Crypt of the Sunken King',
    genre: 'Fantasy',
    status: 'in-progress',
    synopsis: 'Deep beneath the Crag of Oakhaven lies the forgotten tomb of King Marrow, submerged in black tides and guarded by tide-bound spirits.',
    tags: ['Dungeon Crawl', 'Dark Fantasy', 'Eldritch Tides', 'High Stakes'],
    author: 'Archmage Kaelen',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    scenes: [
      {
        id: 'scene-1',
        title: 'The Drowned Archway',
        isStartingScene: true,
        mood: 'Ominous',
        updatedAt: new Date().toISOString(),
        content: `Sea-water sloshes around your greaves, cold as grave-iron. Ancient obsidian pillars jut from the black swell like broken ribs. Above the cracked archway, a luminescent bas-relief depicts a monarch crowned with living kelp.\n\nA heavy brass gate blocks the inner stairs, covered in barnacles and pulsing with faint violet phosphorescence. To your right, a flooded drainage chute whispers with the gurgle of unseen currents.`,
        choices: [
          {
            id: 'c-1',
            label: 'Examine the glowing brass gate and attempt to decipher its runes',
            targetSceneId: 'scene-2',
            skillCheck: { attribute: 'Intelligence', difficulty: 12 },
            consequenceText: 'You risk triggering an arcane tide trap if you mispronounce the glyphs.'
          },
          {
            id: 'c-2',
            label: 'Dive through the flooded drainage chute to bypass the gate',
            targetSceneId: 'scene-3',
            skillCheck: { attribute: 'Agility', difficulty: 14 },
            consequenceText: 'You must hold your breath in total darkness amidst razor sharp coral.'
          },
          {
            id: 'c-3',
            label: 'Consult Brother Vaelin for ancient salt-clergy lore',
            targetSceneId: 'scene-2',
            consequenceText: 'Vaelin shares a psalm that quiets the glyphs, revealing the hidden lock.'
          }
        ]
      },
      {
        id: 'scene-2',
        title: 'The Hall of Barnacled Knights',
        isStartingScene: false,
        mood: 'Tense',
        updatedAt: new Date().toISOString(),
        content: `The brass mechanism yields with a grinding wail. You step into a colossal vaulted nave where twelve iron statues of royal guards stand submerged waist-deep.\n\nTheir eyes glow with pale phosphorescence as your torch flickers. At the far dais sits the petrified sarcophagus of King Marrow, clutching a scepter topped with a pulsating Pearl of Abyssal Will.`,
        choices: [
          {
            id: 'c-4',
            label: 'Approach the sarcophagus and wrest the Abyssal Pearl from the dead king',
            targetSceneId: 'scene-4',
            skillCheck: { attribute: 'Strength', difficulty: 15 },
            consequenceText: 'Disturbing the king will awaken the iron sentinels from their watery sleep.'
          },
          {
            id: 'c-5',
            label: 'Offer a vial of sanctified salt-oil upon the royal brazier',
            targetSceneId: 'scene-4',
            consequenceText: 'The spirits accept the homage and lower their weapons.'
          }
        ]
      },
      {
        id: 'scene-3',
        title: 'The Coral Chasm',
        isStartingScene: false,
        mood: 'Claustrophobic',
        updatedAt: new Date().toISOString(),
        content: `You kick desperately against the undertow. Sharp red coral rakes against your leather armor before you burst into an air pocket inside a hollow stalactite.\n\nFrom here, an elevated ledge overlooks the Hall of Barnacled Knights. You have the advantage of stealth and a vantage point directly above the sarcophagus.`,
        choices: [
          {
            id: 'c-6',
            label: 'Rapel down using grappling hook directly onto the king’s dais',
            targetSceneId: 'scene-4',
            skillCheck: { attribute: 'Agility', difficulty: 11 },
            consequenceText: 'Land silently without alerting the perimeter guards.'
          }
        ]
      },
      {
        id: 'scene-4',
        title: 'The Sunken King Awakens',
        isStartingScene: false,
        isEndingScene: true,
        endingType: 'victory',
        mood: 'Epic',
        updatedAt: new Date().toISOString(),
        content: `As your fingers close upon the Abyssal Pearl, the tide rushes out in a thunderous roar! King Marrow’s ghostly voice rings out: "Bearer of the deep tide, the realm beneath is yours to command!"\n\nA secret staircase spirals upward into the dawn light overlooking the Oakhaven cliffs. You have survived the Crypt of the Sunken King!`,
        choices: []
      }
    ],
    characters: [
      {
        id: 'char-1',
        name: 'Brother Vaelin',
        role: 'Companion',
        description: 'A weathered monk of the Order of Drowned Whispers, clutching a brass astrolabe and salt-stained scriptures.',
        traits: ['Scholarly', 'Devout', 'Fearful of deep water'],
        stats: { intelligence: 16, agility: 9, strength: 10, health: 35 }
      },
      {
        id: 'char-2',
        name: 'King Marrow the Sunken',
        role: 'Antagonist',
        description: 'The petrified corpse of a 300-year-old monarch wrapped in kelp vestments and barnacle-encrusted crown.',
        traits: ['Undying', 'Commanding', 'Wrathful'],
        stats: { intelligence: 14, agility: 8, strength: 18, health: 120 }
      }
    ],
    quests: [
      {
        id: 'q-1',
        title: 'Retrieve the Pearl of Abyssal Will',
        description: 'Venture into the drowned nave and claim the ancient artifact before high tide seals the tomb forever.',
        status: 'active',
        reward: 'Abyssal Scepter & 250 Gold'
      },
      {
        id: 'q-2',
        title: 'Protect Brother Vaelin',
        description: 'Ensure the salt-clergyman survives the dungeon so he can translate the royal epitaphs.',
        status: 'active',
        reward: 'Blessing of the Silent Deep'
      }
    ]
  },
  {
    id: 'neon-shadows-sector4',
    title: 'Neon Shadows: Sector 4',
    genre: 'Cyberpunk',
    status: 'published',
    synopsis: 'A wet neo-noir heist in the neon rain of Neo-Kyoto. Infiltrate Arasaka-biotech sub-level 9 to secure an unreleased neural combat core.',
    tags: ['Cyberpunk', 'Heist', 'Netrunning', 'Noir'],
    author: 'Zero_Cool_99',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    scenes: [
      {
        id: 'ns-scene-1',
        title: 'Rain-Slick Fire Escape',
        isStartingScene: true,
        mood: 'Grimy & Electric',
        updatedAt: new Date().toISOString(),
        content: `Acid rain sizzles against your trench coat. Down in Sector 4, holographic dragons curl across neon billboards advertising synthetic noodles and neural implants.\n\nYou stand crouched on a rusty fire escape overlooking the service ventilation port of the Aethelgard Biotech research facility. A heavy military ICE firewall monitors the door.`,
        choices: [
          {
            id: 'ns-c-1',
            label: 'Jack directly into the service terminal with your Cyberdeck',
            targetSceneId: 'ns-scene-2',
            skillCheck: { attribute: 'Intelligence', difficulty: 14 },
            consequenceText: 'Failing ICE breach will trigger neural feedback and alarm security drones.'
          },
          {
            id: 'ns-c-2',
            label: 'Drop down silently behind the patrolling combat android and disable its battery',
            targetSceneId: 'ns-scene-2',
            skillCheck: { attribute: 'Agility', difficulty: 13 },
            consequenceText: 'Requires swift stealth before the camera sweeps your sector.'
          }
        ]
      },
      {
        id: 'ns-scene-2',
        title: 'The Cryo-Vault Corridor',
        isStartingScene: false,
        isEndingScene: true,
        endingType: 'victory',
        mood: 'Sterile & Deadly',
        updatedAt: new Date().toISOString(),
        content: `Cold vapor curls across white polished floors. Inside the central cylinder, floating in liquid argon, sits the Neural Combat Core Prototype. You plug your datashard in and copy the payload in 3.4 seconds.\n\nSirens begin to wail, but your extraction hover-car is already hovering outside the high-rise window!`,
        choices: []
      }
    ],
    characters: [
      {
        id: 'ns-char-1',
        name: 'Nyx (Netrunner)',
        role: 'Protagonist',
        description: 'Ex-corporate hacker with chrome optic fibers and a neural deck overclocked to dangerous thresholds.',
        traits: ['Cynical', 'Sharp-witted', 'Adrenaline junkie'],
        stats: { intelligence: 18, agility: 14, strength: 8, health: 40 }
      }
    ],
    quests: [
      {
        id: 'ns-q-1',
        title: 'Infiltrate Sector 4 Vault',
        description: 'Extract prototype neural shard before corporate strike teams arrive.',
        status: 'completed',
        reward: '50,000 Neo-Credits'
      }
    ]
  },
  {
    id: 'whispers-black-lighthouse',
    title: 'Whispers of the Black Lighthouse',
    genre: 'Eldritch Mystery',
    status: 'draft',
    synopsis: 'An isolated lighthouse on an uncharted granite reef has begun beaming a violet beam that draws sea birds and sailors into madness.',
    tags: ['Cosmic Horror', 'Investigation', 'Sanity Meter', 'Atmospheric'],
    author: 'E. P. Lovecraft Fan',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    scenes: [
      {
        id: 'wbl-scene-1',
        title: 'The Fogbound Jetty',
        isStartingScene: true,
        mood: 'Dread',
        updatedAt: new Date().toISOString(),
        content: `Your rowing dinghy crunches into black jagged shingle. Above, through churning sea fog, the basalt spire of the lighthouse rises like a claw against the moonless sky.\n\nThe light at the top is not yellow or white—it is a sick, oily violet that makes the back of your eyes ache. Dead gulls litter the rocks, arranged in concentric circles pointing toward the heavy iron entry door.`,
        choices: [
          {
            id: 'wbl-c-1',
            label: 'Inspect the occult spiral circle of gulls',
            targetSceneId: 'wbl-scene-2',
            skillCheck: { attribute: 'Sanity', difficulty: 11 },
            consequenceText: 'A creeping migraine tests your mental fortitude.'
          },
          {
            id: 'wbl-c-2',
            label: 'Push open the unbolted iron door into the lower spiraling stair',
            targetSceneId: 'wbl-scene-2',
            consequenceText: 'The sound of rhythmic dripping and a music box echoes from above.'
          }
        ]
      },
      {
        id: 'wbl-scene-2',
        title: 'The Spiraling Clockwork',
        isStartingScene: false,
        mood: 'Surreal',
        updatedAt: new Date().toISOString(),
        content: `Inside, the spiral staircase is not stone—it is constructed from hundreds of ticking brass clocks, each running backwards at varying speeds. The air smells of ozone, salt, and old bookbinding glue.`,
        choices: []
      }
    ],
    characters: [
      {
        id: 'wbl-char-1',
        name: 'Inspector Margaret Vance',
        role: 'Protagonist',
        description: 'Constabulary investigator dispatched after three merchant ships vanished near Black Reef.',
        traits: ['Methodical', 'Skeptical', 'Iron-willed'],
        stats: { intelligence: 15, agility: 11, strength: 12, health: 50 }
      }
    ],
    quests: [
      {
        id: 'wbl-q-1',
        title: 'Extinguish the Violet Beacon',
        description: 'Climb the spiral tower and stop whatever cosmic lens is powering the beacon.',
        status: 'active',
        reward: 'Save the Coastline'
      }
    ]
  }
];

class StorageService {
  private getLocalAdventures(): Adventure[] {
    if (typeof window === 'undefined') return STARTER_ADVENTURES;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_ADVENTURES));
        return STARTER_ADVENTURES;
      }
      return JSON.parse(data);
    } catch (err) {
      console.warn('Failed reading from localStorage', err);
      return STARTER_ADVENTURES;
    }
  }

  private setLocalAdventures(adventures: Adventure[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adventures));
    } catch (err) {
      console.error('Failed writing to localStorage', err);
    }
  }

  async getAdventures(): Promise<{ adventures: Adventure[]; source: 'supabase' | 'local'; error?: string }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('adventures')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.warn('Supabase query error, falling back to local storage:', error.message);
          return { adventures: this.getLocalAdventures(), source: 'local', error: error.message };
        }

        if (data && data.length > 0) {
          const mapped: Adventure[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            genre: row.genre,
            status: row.status,
            synopsis: row.synopsis || '',
            tags: Array.isArray(row.tags) ? row.tags : [],
            scenes: Array.isArray(row.scenes) ? row.scenes : [],
            characters: Array.isArray(row.characters) ? row.characters : [],
            quests: Array.isArray(row.quests) ? row.quests : [],
            author: row.author || 'Anonymous',
            createdAt: row.created_at || new Date().toISOString(),
            updatedAt: row.updated_at || new Date().toISOString()
          }));
          return { adventures: mapped, source: 'supabase' };
        } else {
          // If Supabase table is empty, seed it with starters
          const starters = this.getLocalAdventures();
          for (const adv of starters) {
            await this.saveAdventure(adv);
          }
          return { adventures: starters, source: 'supabase' };
        }
      } catch (err: any) {
        return { adventures: this.getLocalAdventures(), source: 'local', error: err?.message };
      }
    }

    return { adventures: this.getLocalAdventures(), source: 'local' };
  }

  async getAdventureById(id: string): Promise<{ adventure: Adventure | null; source: 'supabase' | 'local'; error?: string }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('adventures')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          // Check local
          const localAdv = this.getLocalAdventures().find(a => a.id === id) || null;
          return { adventure: localAdv, source: 'local', error: error?.message };
        }

        const mapped: Adventure = {
          id: data.id,
          title: data.title,
          genre: data.genre,
          status: data.status,
          synopsis: data.synopsis || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          scenes: Array.isArray(data.scenes) ? data.scenes : [],
          characters: Array.isArray(data.characters) ? data.characters : [],
          quests: Array.isArray(data.quests) ? data.quests : [],
          author: data.author || 'Anonymous',
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString()
        };
        return { adventure: mapped, source: 'supabase' };
      } catch (err: any) {
        const localAdv = this.getLocalAdventures().find(a => a.id === id) || null;
        return { adventure: localAdv, source: 'local', error: err?.message };
      }
    }

    const localAdv = this.getLocalAdventures().find(a => a.id === id) || null;
    return { adventure: localAdv, source: 'local' };
  }

  async saveAdventure(adventure: Adventure): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> {
    const updated = {
      ...adventure,
      updatedAt: new Date().toISOString()
    };

    // Always update local storage for seamless offline reliability
    const list = this.getLocalAdventures();
    const index = list.findIndex(a => a.id === adventure.id);
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    this.setLocalAdventures(list);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = {
          id: updated.id,
          title: updated.title,
          genre: updated.genre,
          status: updated.status,
          synopsis: updated.synopsis,
          tags: updated.tags,
          scenes: updated.scenes,
          characters: updated.characters,
          quests: updated.quests,
          author: updated.author || 'Author',
          updated_at: updated.updatedAt
        };

        const { error } = await supabase
          .from('adventures')
          .upsert(row, { onConflict: 'id' });

        if (error) {
          return { success: true, source: 'local', error: `Supabase sync error: ${error.message} (saved to local storage)` };
        }
        return { success: true, source: 'supabase' };
      } catch (err: any) {
        return { success: true, source: 'local', error: `Supabase error: ${err.message} (saved to local storage)` };
      }
    }

    return { success: true, source: 'local' };
  }

  async deleteAdventure(id: string): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> {
    const list = this.getLocalAdventures().filter(a => a.id !== id);
    this.setLocalAdventures(list);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('adventures')
          .delete()
          .eq('id', id);

        if (error) {
          return { success: true, source: 'local', error: error.message };
        }
        return { success: true, source: 'supabase' };
      } catch (err: any) {
        return { success: true, source: 'local', error: err?.message };
      }
    }

    return { success: true, source: 'local' };
  }

  async duplicateAdventure(id: string): Promise<Adventure | null> {
    const { adventure } = await this.getAdventureById(id);
    if (!adventure) return null;

    const duplicated: Adventure = {
      ...adventure,
      id: `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${adventure.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.saveAdventure(duplicated);
    return duplicated;
  }
}

export const storageService = new StorageService();
