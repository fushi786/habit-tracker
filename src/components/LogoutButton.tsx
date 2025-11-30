'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export function LogoutButton() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs text-slate-300 underline"
    >
      Log out
    </button>
  )
}
