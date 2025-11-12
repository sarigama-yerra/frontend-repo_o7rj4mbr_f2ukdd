import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const formatUSD = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function AutomationCard({ item }) {
  const [funMode, setFunMode] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState(null)
  const [showTerms, setShowTerms] = useState(false)
  const [agree, setAgree] = useState(false)
  const [locked, setLocked] = useState(false) // prevents toggling out mid-flow

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const doFlip = async () => {
    if (!agree) return
    setShowTerms(false)
    setFlipping(true)
    setResult(null)
    setLocked(true)
    try {
      const res = await fetch(`${baseUrl}/api/flip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_price: item.price }) // backend default win_odds = 0.1 (90% surcharge path)
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

  const onToggleFunMode = (checked) => {
    if (locked) return // cannot exit while locked into a flip decision
    setFunMode(checked)
    if (!checked) {
      // reset state when turning off flip mode
      setResult(null)
      setAgree(false)
    }
  }

  const acceptPrice = () => {
    // In a real app, proceed to checkout with result.final_price
    // For now, we just unlock and show a small confirmation
    setLocked(false)
    setFunMode(false)
    alert(`Proceeding with ${result ? formatUSD(result.final_price) : formatUSD(item.price)}`)
    setResult(null)
  }

  const cancelFlip = () => {
    // Cancels the flip offer but keeps user from toggling mid-animation exploit
    setLocked(false)
    setResult(null)
    setAgree(false)
  }

  const coinVariants = {
    idle: { rotateY: 0 },
    flipping: {
      rotateY: [0, 180, 360],
      transition: { repeat: Infinity, duration: 1.1, ease: 'linear' }
    }
  }

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/70 to-black/60 p-5 hover:border-white/20 transition-colors overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        background: 'radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(251,191,36,0.08), transparent 40%)'
      }} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg tracking-tight">{item.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{formatUSD(item.price)}</div>
          <div className="text-xs text-zinc-500">Standard</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className={`flex items-center gap-2 text-sm ${locked ? 'text-zinc-500' : 'text-zinc-300'}`}>
          <input
            type="checkbox"
            checked={funMode}
            onChange={(e) => onToggleFunMode(e.target.checked)}
            disabled={locked}
          />
          <span className="flex items-center gap-1">
            Flip Mode
            <span className="text-xs text-zinc-500">(90% chance of surcharge)</span>
          </span>
        </label>

        {/* Primary CTA morphs between Buy and Flip; during flip the SAME element spins as the coin */}
        <motion.button
          layoutId={`cta-${item.id}`}
          onClick={() => {
            if (!funMode) {
              alert(`Proceeding with ${formatUSD(item.price)}`)
            } else {
              setShowTerms(true)
            }
          }}
          disabled={flipping}
          className={`${funMode ? 'rounded-full px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold shadow-[0_8px_30px_rgba(251,191,36,0.45)]' : 'rounded-lg px-4 py-2 bg-white text-black font-semibold hover:bg-zinc-200'} relative will-change-transform`}
          style={{ perspective: 800 }}
          animate={funMode && flipping ? 'flipping' : 'idle'}
          variants={coinVariants}
        >
          {funMode ? 'Flip' : 'Buy Now'}
        </motion.button>
      </div>

      {/* Result Panel */}
      {result && (
        <div className="mt-4 rounded-xl border border-white/10 bg-zinc-800/60 p-4">
          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : result.outcome === 'win' ? (
            <div>
              <p className="text-emerald-400 font-semibold">You won a discount</p>
              <p className="text-zinc-300 text-sm mt-1">New price: <span className="font-bold">{formatUSD(result.final_price)}</span></p>
              <div className="mt-3 flex gap-2">
                <button onClick={acceptPrice} className="rounded-lg bg-emerald-500 text-white px-3 py-2 text-sm hover:bg-emerald-600">Accept</button>
                <button onClick={cancelFlip} className="rounded-lg bg-zinc-700 text-white px-3 py-2 text-sm hover:bg-zinc-600">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-amber-400 font-semibold">Surcharge applied</p>
              <p className="text-zinc-300 text-sm mt-1">New price: <span className="font-bold">{formatUSD(result.final_price)}</span></p>
              <p className="text-xs text-zinc-500 mt-1">Standard purchase is temporarily locked while Flip Mode is active.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={acceptPrice} className="rounded-lg bg-amber-500 text-black px-3 py-2 text-sm hover:bg-amber-600">Accept</button>
                <button onClick={cancelFlip} className="rounded-lg bg-zinc-700 text-white px-3 py-2 text-sm hover:bg-zinc-600">Cancel</button>
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
              <p className="mt-2 text-sm text-zinc-300">By flipping, you agree to pay the coin-decided price (discount or surcharge). Standard purchase is locked until you accept or cancel.</p>
              <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
                <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                I understand
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded-lg bg-zinc-700 text-white hover:bg-zinc-600" onClick={() => setShowTerms(false)}>Close</button>
                <button disabled={!agree} className={`px-3 py-2 text-sm rounded-lg font-semibold ${agree ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black' : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'}`} onClick={doFlip}>Start Flip</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .group:hover { --x: 50%; --y: 10%; }
      `}</style>
    </div>
  )
}
