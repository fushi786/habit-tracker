'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export function AddHabitForm() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('habits').insert({
      user_id: user.id,
      name,
      description,
      frequency,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setName('')
      setDescription('')
      setFrequency('daily')
      router.refresh() // reload server data on dashboard
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-slate-900 p-4">
      <h2 className="text-sm font-semibold text-slate-100">Create a habit</h2>

      <div>
        <label className="mb-1 block text-xs text-slate-300">Name</label>
        <input
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-300">Description</label>
        <input
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-300">Frequency</label>
        <select
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          value={frequency}
          onChange={e => setFrequency(e.target.value as 'daily' | 'weekly')}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-purple-600 py-2 text-sm font-medium hover:bg-purple-500 disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Add habit'}
      </button>
    </form>
  )
}
