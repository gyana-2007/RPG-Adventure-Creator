import type { Metadata } from 'next';
import './globals.css';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export const metadata: Metadata = {
  title: 'Text-Based RPG Adventure Creator | Creative Studio',
  description: 'A focused creative studio for students and writers to design, track, branch, and polish text-based RPG adventures with Google Gemini.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-slate-100 antialiased selection:bg-purple-600 selection:text-white relative bg-[#0a0e17]">
        <AnimatedBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
