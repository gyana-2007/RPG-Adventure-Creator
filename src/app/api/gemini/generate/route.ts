import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIGenerateRequest } from '@/types/adventure';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AIGenerateRequest;
    const { mode, prompt, context, customApiKey } = body;

    // Read API key from environment variable (or optional secure studio session key)
    const apiKey = process.env.GEMINI_API_KEY || customApiKey;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json(
        {
          success: false,
          missingKey: true,
          error:
            'Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or configure it in Studio Settings to enable AI story generation.',
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for rapid creative generation
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 1500,
      },
    });

    let systemInstruction = `You are an expert interactive fiction writer and text-based RPG master. 
You specialize in vivid sensory prose, meaningful player agency, memorable characters, and tense branching dilemmas.
Always write in an engaging, immersive style suitable for choice-driven text RPG adventures.
Avoid generic tropes; provide concrete environmental details, mood, and tactile atmosphere.`;

    let userPrompt = '';

    const advGenre = context?.genre || 'Fantasy / Adventure';
    const advTitle = context?.adventureTitle || 'Untitled Adventure';
    const advSynopsis = context?.synopsis ? `Adventure Synopsis: ${context.synopsis}` : '';
    const currentScene = context?.currentSceneTitle ? `Current Scene: "${context.currentSceneTitle}"` : '';
    const currentContent = context?.currentSceneContent ? `Current Scene Text:\n"""\n${context.currentSceneContent}\n"""` : '';

    switch (mode) {
      case 'adventure_outline':
        userPrompt = `Genre: ${advGenre}
Adventure Concept / Prompt: ${prompt}

Create a complete Text-Based RPG Adventure Outline with:
1. Title & High-Concept Premise
2. Atmosphere & Setting Lore
3. Inciting Incident
4. Starting Scene Narrative (2-3 immersive paragraphs in second-person "You...")
5. 3 Branching Paths / Key Locations
6. Main Antagonist or Creature Encounter
7. Primary Quest & High-Stakes Reward`;
        break;

      case 'scene':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
${advSynopsis}
${currentScene}
Prompt / Scene Goal: ${prompt}

Write an evocative, immersive RPG scene in second-person ("You").
Include:
- Distinct sensory details (lighting, sounds, smells, temperature)
- The immediate obstacle, mystery, or character encounter
- 2 or 3 interactive points of interest or potential choices the player can make
Length: 2 to 4 rich paragraphs.`;
        break;

      case 'character':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
Prompt / Concept: ${prompt}

Create a memorable RPG character / NPC with:
- Name & Epithet / Role
- Visual Description & Distinctive Voice / Mannerism
- Secret Motivation or Hidden Flaw
- 3 Core Traits (e.g. [Cynical, Devout, Quick-fingered])
- Suggested RPG Stats (Strength, Agility, Intelligence, Health)
- A sample introductory line of dialogue that hooks the player.`;
        break;

      case 'quest':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
${advSynopsis}
Prompt / Concept: ${prompt}

Design a gripping RPG Quest / Objective:
- Quest Name
- Narrative Hook / Lore Context
- Clear Primary Objective
- Hidden Complication, Moral Dilemma, or Sudden Twist
- Potential Reward (artifact, favor, knowledge, or gold).`;
        break;

      case 'branching_choices':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
${currentScene}
${currentContent}
Player Situation / Context Prompt: ${prompt || 'Generate 3 diverse branching choices based on this scene.'}

Generate 3 compelling, distinct RPG choices for the player:
Choice 1: Direct action or tactical combat [with Attribute skill check]
Choice 2: Stealth, agility, or environmental trick [with Attribute skill check]
Choice 3: Dialogue, arcane knowledge, lore, or creative risk [with Attribute skill check]

For each choice, provide:
- The Choice Label (e.g., "Pry loose the corroded iron grating [Strength DC 13]")
- The Immediate Risk or Consequence description.`;
        break;

      case 'improve_text':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
Instruction: ${prompt || 'Enhance the atmospheric depth, pacing, and sensory details.'}

Original Text:
"""
${context?.selectedText || context?.currentSceneContent || ''}
"""

Rewrite and polish the text above. Elevate the imagery, tension, and agency while preserving the player's choices and context. Return the improved version directly.`;
        break;

      case 'continue_story':
        userPrompt = `Adventure: "${advTitle}" (${advGenre})
${currentScene}
${currentContent}
Player Action / Continuation Prompt: ${prompt || 'Continue the scene narrative based on the tension.'}

Continue the story directly from the current text. Add 1-2 rich paragraphs describing what happens next, raising the stakes and presenting a new critical moment.`;
        break;

      default:
        userPrompt = prompt;
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
        },
      ],
    });

    const response = await result.response;
    const generatedText = response.text();

    return NextResponse.json({
      success: true,
      content: generatedText,
      mode,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errorMessage = error?.message || 'Failed to generate content with Gemini';
    const isApiKeyError =
      errorMessage.toLowerCase().includes('api key') ||
      errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('permission_denied');

    return NextResponse.json(
      {
        success: false,
        error: isApiKeyError
          ? 'Gemini API authentication failed. Please verify your GEMINI_API_KEY in .env.local.'
          : errorMessage,
        missingKey: isApiKeyError,
      },
      { status: 500 }
    );
  }
}
