'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type Props = { habitId: string }

export function DeleteHabitButton({ habitId }: Props) {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Delete this habit?')) return
    setLoading(true)
    setError(null)

    const { error: logsError } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)

    if (logsError) {
      setError(logsError.message)
      setLoading(false)
      return
    }

    const { error: habitError } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)

    if (habitError) {
      setError(habitError.message)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-[11px] font-medium text-rose-400 hover:text-rose-300 disabled:opacity-60"
      >
        {loading ? 'Deleting…' : 'Delete'}
      </button>
      {error && (
        <span className="text-[10px] text-red-400">{error}</span>
      )}
    </div>
  )
}
