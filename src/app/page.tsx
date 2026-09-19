import Link from 'next/link';
import { Mountain, ShieldCheck, Radio, AlertTriangle, ArrowRight, Compass, MapPin, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">YATRI SETU</span>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">HIMALAYAN SAFETY INFRASTRUCTURE</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-xs font-bold px-4 py-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition border border-transparent"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white transition flex items-center gap-1.5 shadow-sm"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 sm:py-24 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>REAL-TIME CORRIDOR TELEMETRY & ZERO-SIGNAL SAFETY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight max-w-4xl">
          Safe High-Altitude Travel, <br />
          <span className="text-emerald-600">Built for Zero-Connectivity Zones.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Geo-fenced landslide & avalanche radar, browser-based offline Web Audio SOS sirens, valley carrying-capacity load balancing, and verified digital checkpost clearances.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/sign-up"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center gap-2"
          >
            Launch Yatri Cockpit <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 transition shadow-xs"
          >
            Explore Dashboard as Guest →
          </Link>
        </div>

        {/* Key Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-12 w-full text-left">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Offline SOS Siren</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browser Web Audio frequency alarm designed to sound audibly even when cellular towers and data are completely down.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Valley Carrying Capacity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live crowd and vehicle threshold telemetry that routes travelers toward serene, offbeat corridors like Sethan.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5 hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">112 Rescue Dispatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pre-computed GPS latitude/longitude payloads ready for 1-touch telephone calls or queued offline SMS to SDRF units.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-medium">
        © Yatri Setu • Himalayan Safety & Mobility Infrastructure
      </footer>
    </div>
  );
}