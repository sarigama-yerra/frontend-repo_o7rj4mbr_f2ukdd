import React from 'react'
import { Shield, Trophy, Sparkles } from 'lucide-react'

export default function Trust() {
  return (
    <section className="bg-gradient-to-b from-black to-zinc-950 text-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-3 font-semibold text-lg">Provably Fair Vibes</h3>
            <p className="mt-1 text-sm text-zinc-400">We don’t rig the odds — it’s pure chance. Each flip returns a roll and seed for transparency.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h3 className="mt-3 font-semibold text-lg">Optional Blockchain</h3>
            <p className="mt-1 text-sm text-zinc-400">Add chain verification later. For now, trust the math — and the thrill.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <Trophy className="h-6 w-6 text-sky-400" />
            <h3 className="mt-3 font-semibold text-lg">Golden Flip</h3>
            <p className="mt-1 text-sm text-zinc-400">Rare 1% chance events and a Luck Meter keep the experience fresh and fun.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
