import { Adventure } from '@/types/adventure';

export function exportAdventureAsTxt(adv: Adventure): string {
  let output = `===================================================================\n`;
  output += `              TEXT-BASED RPG ADVENTURE SCRIPT\n`;
  output += `===================================================================\n\n`;
  output += `TITLE: ${adv.title}\n`;
  output += `GENRE: ${adv.genre}\n`;
  output += `STATUS: ${adv.status.toUpperCase()}\n`;
  output += `AUTHOR: ${adv.author || 'Anonymous'}\n`;
  output += `LAST UPDATED: ${new Date(adv.updatedAt).toLocaleString()}\n`;
  output += `TAGS: ${adv.tags.join(', ')}\n\n`;
  output += `SYNOPSIS:\n${adv.synopsis || 'None provided'}\n\n`;

  output += `-------------------------------------------------------------------\n`;
  output += `QUESTS & OBJECTIVES (${adv.quests.length})\n`;
  output += `-------------------------------------------------------------------\n`;
  if (adv.quests.length === 0) {
    output += `No active quests recorded.\n\n`;
  } else {
    adv.quests.forEach((q, i) => {
      output += `[Quest ${i + 1}] ${q.title} (${q.status.toUpperCase()})\n`;
      output += `  Description: ${q.description}\n`;
      if (q.reward) output += `  Reward: ${q.reward}\n`;
      output += `\n`;
    });
  }

  output += `-------------------------------------------------------------------\n`;
  output += `CHARACTERS & NPCS (${adv.characters.length})\n`;
  output += `-------------------------------------------------------------------\n`;
  if (adv.characters.length === 0) {
    output += `No characters recorded.\n\n`;
  } else {
    adv.characters.forEach((c, i) => {
      output += `[Character ${i + 1}] ${c.name} (${c.role})\n`;
      output += `  Description: ${c.description}\n`;
      output += `  Traits: ${c.traits.join(', ')}\n`;
      if (c.stats) {
        output += `  Stats: STR ${c.stats.strength ?? '-'} | AGI ${c.stats.agility ?? '-'} | INT ${c.stats.intelligence ?? '-'} | HP ${c.stats.health ?? '-'}\n`;
      }
      output += `\n`;
    });
  }

  output += `-------------------------------------------------------------------\n`;
  output += `SCENE GRAPH & STORY NODES (${adv.scenes.length})\n`;
  output += `-------------------------------------------------------------------\n`;
  adv.scenes.forEach((s, idx) => {
    output += `[SCENE ${idx + 1}] ${s.title}${s.isStartingScene ? ' (STARTING SCENE)' : ''}${s.isEndingScene ? ` (ENDING - ${s.endingType?.toUpperCase() || 'FINALE'})` : ''}\n`;
    if (s.mood) output += `Mood: ${s.mood}\n`;
    output += `\nNARRATIVE:\n${s.content}\n\n`;

    if (s.choices && s.choices.length > 0) {
      output += `CHOICES:\n`;
      s.choices.forEach((ch, cIdx) => {
        const target = adv.scenes.find(targetS => targetS.id === ch.targetSceneId);
        const targetTitle = target ? target.title : `Node [${ch.targetSceneId}]`;
        const checkStr = ch.skillCheck ? ` [Check: ${ch.skillCheck.attribute} DC ${ch.skillCheck.difficulty}]` : '';
        output += `  ${cIdx + 1}. ${ch.label}${checkStr} --> Leads to "${targetTitle}"\n`;
        if (ch.consequenceText) {
          output += `     Consequence: ${ch.consequenceText}\n`;
        }
      });
    } else {
      output += `(No further choices - Chapter Concludes)\n`;
    }
    output += `\n-------------------------------------------------------------------\n\n`;
  });

  return output;
}

export function exportAdventureAsMarkdown(adv: Adventure): string {
  let md = `# ${adv.title}\n\n`;
  md += `> **Genre:** ${adv.genre} | **Status:** ${adv.status} | **Author:** ${adv.author || 'Anonymous'}  \n`;
  md += `> **Last Updated:** ${new Date(adv.updatedAt).toLocaleDateString()} | **Tags:** ${adv.tags.map(t => `\`${t}\``).join(', ')}\n\n`;

  md += `## Synopsis\n\n${adv.synopsis || '*No synopsis provided.*'}\n\n`;

  md += `## Quests\n\n`;
  if (adv.quests.length === 0) {
    md += `*No quests recorded yet.*\n\n`;
  } else {
    adv.quests.forEach(q => {
      const mark = q.status === 'completed' ? 'x' : ' ';
      md += `- [${mark}] **${q.title}** (${q.status})\n  - ${q.description}\n`;
      if (q.reward) md += `  - *Reward:* ${q.reward}\n`;
    });
    md += `\n`;
  }

  md += `## Characters\n\n`;
  if (adv.characters.length === 0) {
    md += `*No characters recorded yet.*\n\n`;
  } else {
    adv.characters.forEach(c => {
      md += `### ${c.name} (${c.role})\n\n${c.description}\n\n`;
      md += `- **Traits:** ${c.traits.join(', ')}\n`;
      if (c.stats) {
        md += `- **Stats:** Strength: ${c.stats.strength ?? '-'}, Agility: ${c.stats.agility ?? '-'}, Intelligence: ${c.stats.intelligence ?? '-'}, HP: ${c.stats.health ?? '-'}\n`;
      }
      md += `\n`;
    });
  }

  md += `## Story Scenes\n\n`;
  adv.scenes.forEach(s => {
    md += `### ${s.title}${s.isStartingScene ? ' 🚩 (Start)' : ''}${s.isEndingScene ? ' 🏁 (Ending)' : ''}\n\n`;
    if (s.mood) md += `*Atmosphere: ${s.mood}*\n\n`;
    md += `${s.content.split('\n\n').map(p => `> ${p}`).join('\n>\n')}\n\n`;

    if (s.choices && s.choices.length > 0) {
      md += `**Branching Choices:**\n\n`;
      s.choices.forEach((ch, idx) => {
        const target = adv.scenes.find(item => item.id === ch.targetSceneId);
        const targetTitle = target ? target.title : ch.targetSceneId;
        const checkStr = ch.skillCheck ? ` *(${ch.skillCheck.attribute} DC ${ch.skillCheck.difficulty})*` : '';
        md += `${idx + 1}. **${ch.label}**${checkStr} $\\rightarrow$ [${targetTitle}](#${targetTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')})\n`;
        if (ch.consequenceText) md += `   - *Consequence:* ${ch.consequenceText}\n`;
      });
      md += `\n`;
    }
  });

  return md;
}

export function exportAdventureAsStandaloneHtml(adv: Adventure): string {
  const jsonString = JSON.stringify(adv).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${adv.title} - Text-Based RPG</title>
  <style>
    :root {
      --bg: #0d1117;
      --panel: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --muted: #8b949e;
      --gold: #d29922;
      --gold-glow: rgba(210, 153, 34, 0.2);
      --cyan: #38bdf8;
      --purple: #bc8cff;
      --card: #21262d;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
    }
    .container {
      width: 100%;
      max-width: 780px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    header {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .badge-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      background: rgba(210, 153, 34, 0.15);
      color: var(--gold);
      border: 1px solid rgba(210, 153, 34, 0.3);
    }
    h1 {
      font-size: 26px;
      color: #fff;
      font-family: "Georgia", serif;
      margin-bottom: 6px;
    }
    .synopsis {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.5;
    }
    .main-stage {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px 28px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      min-height: 380px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .scene-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .scene-title {
      font-size: 20px;
      color: var(--gold);
      font-family: "Georgia", serif;
    }
    .mood-pill {
      font-size: 12px;
      background: rgba(188, 140, 255, 0.15);
      color: var(--purple);
      padding: 2px 10px;
      border-radius: 12px;
      border: 1px solid rgba(188, 140, 255, 0.3);
    }
    .scene-body {
      font-family: "Georgia", serif;
      font-size: 17px;
      line-height: 1.8;
      color: #f0f6fc;
      margin-bottom: 30px;
      white-space: pre-line;
    }
    .choices-title {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
      margin-bottom: 12px;
    }
    .choices-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .choice-btn {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 18px;
      color: #fff;
      font-size: 15px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .choice-btn:hover {
      background: #28303b;
      border-color: var(--gold);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--gold-glow);
    }
    .skill-tag {
      font-size: 11px;
      color: var(--cyan);
      font-family: monospace;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--muted);
      padding: 0 8px;
    }
    .restart-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .restart-btn:hover {
      color: #fff;
      border-color: #8b949e;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-bar">
        <span class="badge">${adv.genre}</span>
        <span class="badge">Interactive Text RPG</span>
      </div>
      <h1>${adv.title}</h1>
      <p class="synopsis">${adv.synopsis}</p>
    </header>

    <main class="main-stage" id="stage">
      <div id="scene-display">
        <!-- Injected via JavaScript -->
      </div>
      <div id="choices-display" class="choices-container">
        <!-- Injected via JavaScript -->
      </div>
    </main>

    <div class="footer-bar">
      <span>Built with Text-Based RPG Adventure Creator</span>
      <button class="restart-btn" onclick="restartAdventure()">Restart Adventure</button>
    </div>
  </div>

  <script>
    const adventure = ${jsonString};
    let currentSceneId = '';

    function init() {
      const startingScene = adventure.scenes.find(s => s.isStartingScene) || adventure.scenes[0];
      if (startingScene) {
        goToScene(startingScene.id);
      } else {
        document.getElementById('scene-display').innerHTML = '<p>No scenes found in this adventure.</p>';
      }
    }

    function goToScene(sceneId) {
      currentSceneId = sceneId;
      const scene = adventure.scenes.find(s => s.id === sceneId);
      if (!scene) {
        document.getElementById('scene-display').innerHTML = '<h2>Scene Not Found</h2><p>This path leads to an uncharted realm.</p>';
        document.getElementById('choices-display').innerHTML = '<button class="choice-btn" onclick="restartAdventure()">Return to Start</button>';
        return;
      }

      const sceneDisplay = document.getElementById('scene-display');
      let moodBadge = scene.mood ? '<span class="mood-pill">' + scene.mood + '</span>' : '';
      let endingBadge = scene.isEndingScene ? '<span class="badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: #38bdf8;">' + (scene.endingType ? scene.endingType.toUpperCase() : 'FINALE') + '</span>' : '';

      sceneDisplay.innerHTML = \`
        <div class="scene-header">
          <h2 class="scene-title">\${scene.title}</h2>
          <div>\${endingBadge} \${moodBadge}</div>
        </div>
        <div class="scene-body">\${scene.content}</div>
      \`;

      const choicesDisplay = document.getElementById('choices-display');
      choicesDisplay.innerHTML = '';

      if (scene.choices && scene.choices.length > 0) {
        const title = document.createElement('div');
        title.className = 'choices-title';
        title.innerText = 'Choose your path:';
        choicesDisplay.appendChild(title);

        scene.choices.forEach(ch => {
          const btn = document.createElement('button');
          btn.className = 'choice-btn';
          let skillHtml = ch.skillCheck ? '<span class="skill-tag">[' + ch.skillCheck.attribute + ' DC ' + ch.skillCheck.difficulty + ']</span>' : '';
          btn.innerHTML = '<span>' + ch.label + '</span>' + skillHtml;
          btn.onclick = () => {
            if (ch.consequenceText) {
              alert(ch.consequenceText);
            }
            goToScene(ch.targetSceneId);
          };
          choicesDisplay.appendChild(btn);
        });
      } else {
        const endNotice = document.createElement('div');
        endNotice.style.textAlign = 'center';
        endNotice.style.padding = '20px';
        endNotice.innerHTML = '<p style="color: var(--muted); margin-bottom: 12px;">This chapter reaches its conclusion.</p><button class="choice-btn" style="text-align:center;" onclick="restartAdventure()">Play Again</button>';
        choicesDisplay.appendChild(endNotice);
      }
    }

    function restartAdventure() {
      const startingScene = adventure.scenes.find(s => s.isStartingScene) || adventure.scenes[0];
      if (startingScene) {
        goToScene(startingScene.id);
      }
    }

    init();
  </script>
</body>
</html>`;
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
