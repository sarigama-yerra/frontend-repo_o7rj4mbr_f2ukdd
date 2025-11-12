import React, { useRef } from 'react'
import Hero from './components/Hero'
import Marketplace from './components/Marketplace'
import Trust from './components/Trust'

function App() {
  const marketRef = useRef(null)

  const scrollToMarket = () => {
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })
  }

  const startFlip = () => {
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-black">
      <Hero onFlipClick={startFlip} onExploreClick={scrollToMarket} />
      <Marketplace />
      <Trust />
      <footer className="border-t border-white/10 text-zinc-400 text-sm py-8 text-center bg-black">© {new Date().getFullYear()} Flip2Win — Automate smarter. Or gamble your way to a deal.</footer>
    </div>
  )
}

export default App
