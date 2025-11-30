'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let result
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleResetPassword = async () => {
    setResetEmailSent(false)
    setResetError(null)

    if (!email) {
      setResetError('Enter your email above first.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setResetError(error.message)
    } else {
      setResetEmailSent(true)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#1f2937_0,_#020617_55%,_#020617_100%)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Habit Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Stay consistent. One day at a time.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-[0_18px_60px_rgba(0,0,0,0.7)] space-y-5">
          <h2 className="text-lg font-semibold">
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-md shadow-purple-900/40 hover:bg-purple-500 hover:shadow-purple-700/40 transition disabled:opacity-60"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Log in'
                : 'Sign up'}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px]">
            <button
              type="button"
              className="text-slate-300 underline"
              onClick={() =>
                setMode(mode === 'login' ? 'signup' : 'login')
              }
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              className="text-slate-300 underline"
            >
              Forgot password?
            </button>
          </div>

          {resetError && (
            <p className="text-[11px] text-red-400">{resetError}</p>
          )}
          {resetEmailSent && (
            <p className="text-[11px] text-emerald-400">
              Password reset email sent. Check your inbox.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Habit Tracker · v0.1.0
        </p>
      </div>
    </main>
  )
}
