import { BuildChecklistItem } from '@/types/adventure';

export function getBuildChecklist(isSupabaseReady: boolean, isGeminiReady: boolean): BuildChecklistItem[] {
  return [
    {
      id: 1,
      title: 'Understand requirements & architecture',
      description: 'Defined RPG creator scope, interactive scene graph, writing studio, secure API endpoints, and dual-layer persistence.',
      status: 'completed',
      badge: 'Completed',
      details: 'Architecture comprises Next.js 14 App Router, Tailwind theme, client-side story runner, server-side Gemini 1.5 Flash proxy, Supabase integration, and standalone HTML game exporter.'
    },
    {
      id: 2,
      title: 'Set up the Next.js & Tailwind frontend',
      description: 'Crafted atmospheric RPG creative studio UI with dashboard stats, search, genre filters, and responsive layout.',
      status: 'completed',
      badge: 'Completed',
      details: 'Built custom parchment & arcane dark theme, responsive grid/card/table views, adventure management modals, and mobile-friendly navigation.'
    },
    {
      id: 3,
      title: 'Connect Supabase persistence',
      description: isSupabaseReady
        ? 'Connected to live Supabase PostgreSQL database with RLS policies enabled.'
        : 'Persistence engine ready with zero-setup local storage fallback. Cloud sync awaits Supabase project credentials.',
      status: isSupabaseReady ? 'completed' : 'configured',
      badge: isSupabaseReady ? 'Live Cloud Connected' : 'Local Fallback Active',
      details: isSupabaseReady
        ? 'Adventures are persisted to the remote Supabase database and synced across devices.'
        : 'Currently operating in Local Storage Fallback mode. Fully functional for offline creation. To connect cloud Supabase, provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      credentialNote: isSupabaseReady ? undefined : 'Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    },
    {
      id: 4,
      title: 'Add AI-powered generation',
      description: isGeminiReady
        ? 'Connected to Google Gemini 1.5 Flash via secure server-side endpoint with review & edit workspace.'
        : 'Secure server-side API route and review-and-edit studio interface built. Awaits GEMINI_API_KEY.',
      status: isGeminiReady ? 'completed' : 'pending_credentials',
      badge: isGeminiReady ? 'Live Gemini Ready' : 'Awaiting API Key',
      details: isGeminiReady
        ? 'Gemini 1.5 Flash generates premises, scenes, NPCs, quests, and branching choices. Writers review and edit before inserting.'
        : 'Server-side endpoint /api/gemini/generate is fully built with prompt engineering and safety guards. Live generation activates when GEMINI_API_KEY is supplied in .env.local or Studio Settings.',
      credentialNote: isGeminiReady ? undefined : 'Requires GEMINI_API_KEY from Google AI Studio'
    },
    {
      id: 5,
      title: 'Prepare deployment to Vercel',
      description: 'Created Vercel configuration, environment variable specifications, build scripts, and production assets.',
      status: 'completed',
      badge: 'Vercel Ready',
      details: 'Configured Next.js production build, .env.example, vercel.json, and deployment documentation. Deployable to Vercel with a single git push or `vercel` command.'
    }
  ];
}
