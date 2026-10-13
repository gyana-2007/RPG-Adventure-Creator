# Text-Based RPG Adventure Creator 🏰✨

A focused creative studio for students and writers to design, track, branch, and polish text-based RPG adventures with Google Gemini.

---

## 🌟 Key Features

1. **Focused Creative Studio Dashboard:**
   - Real-time overview of total adventures, drafts, published status, total story nodes, and non-linear branching choices.
   - Filter by genre (*Fantasy*, *Cyberpunk*, *Eldritch Mystery*, *Gothic Horror*, *Sci-Fi*) and publication status.
   - Switch seamlessly between **Card Grid** and **Dense Table** layouts.
   - Instant search across titles, synopses, and lore tags.

2. **Branching Writing Workspace:**
   - Interactive scene graph manager with Starting Scene (🚩) and Ending Scene (🏁) controls.
   - Rich second-person narrative writing area with word and character counters, mood tags (*Ominous*, *Tense*, *Epic*, *Claustrophobic*), and an atmospheric Parchment writing feel.
   - Comprehensive branching choices builder: add tactical actions with optional RPG skill checks (*Strength*, *Agility*, *Intelligence*, *Sanity*) and immediate consequence feedback.

3. **Google Gemini AI Co-Pilot & Mandatory Review Workflow:**
   - Secure server-side endpoint (`/api/gemini/generate`) — API keys are **never** exposed in browser code.
   - Specialized generation modes:
     - 📜 **Scene & Room Generator** (sensory details, immediate tension, interactive points)
     - 🔀 **Branching Choices Generator** (tactical force, stealth, lore/magic paths with DC checks)
     - 👤 **Character & NPC Generator** (roles, distinctive voice, hidden motives, RPG stats)
     - ⚔️ **Quest & Plot Hook Generator** (objectives, complications, twists, rewards)
     - ✨ **Prose Polish & Rewrite** (atmosphere elevation, pacing tightening, sensory immersion)
     - ⏩ **Story Continuation** (smooth narrative progressions)
   - **Full Review & Edit Modal**: Writers review, tweak, and edit generated content *before* committing it to scenes, choices, characters, or quests.

4. **Dual Persistence Layer (Supabase + Local Storage Fallback):**
   - Cloud sync with **Supabase PostgreSQL** when configured via environment variables.
   - Automatic, zero-configuration **Local Storage Fallback** if credentials are not provided.
   - Built-in Supabase setup dialog with one-click copyable SQL migration schema and Row-Level Security (RLS) policies.

5. **Multi-Format Export Studio:**
   - **Playable Standalone HTML Game (`.html`)**: Single-file offline interactive RPG game with responsive design, typewriter feel, and clickable choices. Playable anywhere without servers!
   - **Plain Text Manuscript (`.txt`)**: Clean story screenplay and scene graph documentation.
   - **JSON Schema (`.json`)**: Formatted data ready for import into game engines (Godot, Twine, custom engines).
   - **Markdown Script (`.md`)**: Formatted for Obsidian, GitHub, or portfolio publishing.

6. **Interactive Playtester:**
   - Built-in live engine to playtest storylines, branch choices, consequence popups, and track node trails without leaving the studio.

---

## 📋 Build & Deployment Checklist

The application includes a visible **Build Checklist** accessible via the top navigation bar:
- [x] **1. Understand requirements and architecture**
- [x] **2. Set up the Next.js and Tailwind frontend**
- [x] **3. Connect Supabase persistence** *(Configured with zero-setup local storage fallback; ready for Supabase URL/Key)*
- [x] **4. Add AI-powered generation** *(Secure server route implemented with prompt engineering and review modal; activates with `GEMINI_API_KEY`)*
- [x] **5. Prepare deployment to Vercel** *(Ready for instant Vercel import and build)*

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- Node.js 18+ (Node.js 20+ or 24 LTS recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Edit `.env.local` to add your keys:
```env
# Google Gemini API Key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase Credentials from https://supabase.com/
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*Note: If `GEMINI_API_KEY` is not added to `.env.local`, you can also provide a session test key in **Studio Settings**.*
*If Supabase keys are left empty, the application automatically uses Local Storage fallback.*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Schema

To set up your remote Supabase database, navigate to your **Supabase Dashboard &rarr; SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS adventures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  synopsis TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  scenes JSONB DEFAULT '[]'::jsonb,
  characters JSONB DEFAULT '[]'::jsonb,
  quests JSONB DEFAULT '[]'::jsonb,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;

-- Allow public access for prototyping
CREATE POLICY "Allow public read access" ON adventures FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON adventures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON adventures FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON adventures FOR DELETE USING (true);
```

---

## ☁️ Deploying to Vercel

1. **Push your code to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Text-Based RPG Adventure Creator"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your repository.
   - Framework Preset: **Next.js**.

3. **Configure Environment Variables in Vercel:**
   Add the following in **Settings &rarr; Environment Variables**:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `NEXT_PUBLIC_SUPABASE_URL`: (Optional) Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Optional) Your Supabase anon key.

4. **Deploy:**
   - Click **Deploy**. Vercel will build and deploy the application in seconds.

---

## 🔒 Security & Best Practices

- **Zero Client Key Leakage:** `GEMINI_API_KEY` is strictly accessed in server-side API routes (`/api/gemini/generate`) and never exposed in the browser bundle.
- **Graceful Fallbacks:** The app detects missing credentials and provides clear, actionable setup guides without crashing or faking functionality.
- **User Agency:** Every AI-generated output is presented in an editable preview modal so writers retain complete artistic ownership before anything is committed to their story graph.
