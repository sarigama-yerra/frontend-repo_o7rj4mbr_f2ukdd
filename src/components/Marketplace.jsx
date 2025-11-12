import React from 'react'
import AutomationCard from './AutomationCard'

const items = [
  { id: 1, title: 'Twitter DM Auto-Responder', description: 'Auto-reply to new DMs with custom flows.', price: 19 },
  { id: 2, title: 'Notion to Slack Sync', description: 'Sync Notion updates to your Slack channel.', price: 29 },
  { id: 3, title: 'Lead Enrichment Bot', description: 'Enrich email lists with social data.', price: 39 },
  { id: 4, title: 'CRM Cleaner', description: 'Deduplicate and normalize contacts.', price: 24 },
]

export default function Marketplace() {
  return (
    <section id="marketplace" className="relative bg-black text-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Automation Marketplace</h2>
            <p className="mt-2 text-zinc-400">Pick an automation. Buy normally or flip for a chance at a discount.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AutomationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
