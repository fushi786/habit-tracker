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
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 px-6 py-5"
    >
      <h2 className="text-sm font-semibold text-slate-100">
        Create a habit
      </h2>

      <div>
        <label className="mb-1 block text-xs text-slate-300">Name</label>
        <input
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-300">
          Description
        </label>
        <input
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-300">
          Frequency
        </label>
        <select
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          value={frequency}
          onChange={e => setFrequency(e.target.value as 'daily' | 'weekly')}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-md shadow-purple-900/40 hover:bg-purple-500 hover:shadow-purple-700/40 transition disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Add habit'}
      </button>
    </form>
  )
}
