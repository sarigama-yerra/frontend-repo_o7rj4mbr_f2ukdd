import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const formatUSD = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function AutomationCard({ item, onFlipStart }) {
  const [funMode, setFunMode] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState(null)
  const [showTerms, setShowTerms] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const doFlip = async () => {
    setShowTerms(false)
    setFlipping(true)
    setResult(null)
    try {
      const res = await fetch(`${baseUrl}/api/flip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_price: item.price })
      })
      if (!res.ok) throw new Error('Flip failed')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: e.message })
    } finally {
      setFlipping(false)
    }
  }

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{formatUSD(item.price)}</div>
          <div className="text-xs text-zinc-500">Standard</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={funMode} onChange={(e) => setFunMode(e.target.checked)} />
          Flip for Fun
        </label>

        {!funMode ? (
          <button className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:bg-zinc-200">Buy Now</button>
        ) : (
          <button onClick={() => setShowTerms(true)} className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold px-4 py-2 shadow-[0_8px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.6)]">
            🪙 Flip
          </button>
        )}
      </div>

      <AnimatePresence>
        {flipping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-center">
            <motion.div
              className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-2xl"
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            >
              🪙
            </motion.div>
            <p className="mt-3 text-zinc-300">Flipping...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <div className="mt-4 rounded-xl border border-white/10 bg-zinc-800/60 p-4">
          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : result.outcome === 'win' ? (
            <div>
              <p className="text-emerald-400 font-semibold">Congratulations! 🎉</p>
              <p className="text-zinc-300 text-sm mt-1">You got this automation for <span className="font-bold">{formatUSD(result.final_price)}</span></p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg bg-emerald-500 text-white px-3 py-2 text-sm hover:bg-emerald-600">Accept</button>
                <button className="rounded-lg bg-zinc-700 text-white px-3 py-2 text-sm hover:bg-zinc-600">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-amber-400 font-semibold">Oops! 😬</p>
              <p className="text-zinc-300 text-sm mt-1">The coin decided <span className="font-bold">{formatUSD(result.final_price)}</span> this time.</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg bg-amber-500 text-black px-3 py-2 text-sm hover:bg-amber-600">Accept</button>
                <button className="rounded-lg bg-zinc-700 text-white px-3 py-2 text-sm hover:bg-zinc-600">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} className="max-w-md w-full rounded-2xl bg-zinc-900 p-6 border border-white/10">
              <h4 className="text-white font-semibold text-lg">Flip Terms</h4>
              <p className="mt-2 text-sm text-zinc-300">By flipping, you agree to pay whichever price the coin decides. No refunds after flip.</p>
              <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
                <input id="agree" type="checkbox" />
                I understand
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded-lg bg-zinc-700 text-white hover:bg-zinc-600" onClick={() => setShowTerms(false)}>Cancel</button>
                <button className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold" onClick={doFlip}>Start Flip</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
