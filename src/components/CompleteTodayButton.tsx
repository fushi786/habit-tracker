'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Props = {
  habitId: string
  doneToday: boolean
}

export function CompleteTodayButton({ habitId, doneToday }: Props) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (doneToday) return
    setLoading(true)
    setError(null)

    const today = new Date().toISOString().slice(0, 10)

    const { error: insertError } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: habitId,
        date: today,
        completed: true,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  if (doneToday) {
    return null
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-slate-50 shadow-sm hover:bg-emerald-500 disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Complete today'}
      </button>
      {error && (
        <span className="text-[10px] text-red-400">{error}</span>
      )}
    </div>
  )
}
