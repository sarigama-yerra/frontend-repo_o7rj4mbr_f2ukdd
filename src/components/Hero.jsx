import React from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero({ onFlipClick, onExploreClick }) {
  return (
    <section className="relative min-h-[82vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/80 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-16 flex flex-col items-start">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          Automate your work.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"> Or flip a coin and let fate decide your price.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-5 max-w-2xl text-lg text-zinc-300"
        >
          Premium automations with a playful twist. Buy at the standard price — or take a 90/10 chance to win a discount or pay a small premium.
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExploreClick}
            className="rounded-lg bg-white/10 hover:bg-white/20 text-white px-5 py-3 backdrop-blur border border-white/20"
          >
            Explore Automations
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onFlipClick}
            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold px-5 py-3 shadow-[0_8px_30px_rgba(251,191,36,0.45)]"
          >
            <span className="relative inline-block">
              <span className="absolute inset-0 rounded-full blur-xl opacity-40 bg-amber-400" />
              <span className="relative">Flip the Coin 💰</span>
            </span>
            <span className="ml-1 text-black/70 group-hover:animate-spin-slow">🪙</span>
          </motion.button>
        </div>
      </div>

      <style>{`
        .group:hover .coin {
          filter: drop-shadow(0 0 24px rgba(251,191,36,.7));
        }
        .animate-spin-slow { animation: spin 1.5s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      `}</style>
    </section>
  )
}
