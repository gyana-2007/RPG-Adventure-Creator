import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supabaseUrl, supabaseAnonKey, geminiApiKey } = body;

    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const updateEnvVar = (content: string, key: string, value?: string) => {
      if (value === undefined) return content;
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        return content.replace(regex, `${key}=${value}`);
      } else {
        return `${content.trim()}\n${key}=${value}\n`;
      }
    };

    if (supabaseUrl !== undefined) {
      envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_URL', supabaseUrl.trim());
    }
    if (supabaseAnonKey !== undefined) {
      envContent = updateEnvVar(envContent, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey.trim());
    }
    if (geminiApiKey !== undefined) {
      envContent = updateEnvVar(envContent, 'GEMINI_API_KEY', geminiApiKey.trim());
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Credentials saved to .env.local successfully.',
      hasSupabase: Boolean(supabaseUrl && supabaseUrl.trim().startsWith('https://')),
    });
  } catch (error: any) {
    console.error('Failed to update .env.local:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save environment variables' },
      { status: 500 }
    );
  }
}
