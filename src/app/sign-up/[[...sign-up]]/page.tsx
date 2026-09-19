import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { Mountain } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Mountain className="w-5 h-5" />
          </div>
          <span>YATRI SETU</span>
        </Link>
        <Link href="/dashboard" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
          Skip to Dashboard →
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <SignUp
          fallbackRedirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © Yatri Setu • Himalayan Safety Infrastructure
      </footer>
    </div>
  );
}