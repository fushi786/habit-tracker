import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { AddHabitForm } from '@/components/AddHabitForm'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: habits, error } = await supabase
    .from('habits')
    .select('id, name, description, frequency, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load habits', error)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Habits</h1>
          <span className="text-xs text-slate-400">{user.email}</span>
        </header>

        <AddHabitForm />

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-100">Your habits</h2>
          {(!habits || habits.length === 0) && (
            <p className="text-xs text-slate-400">No habits yet. Add your first one above.</p>
          )}
          <ul className="space-y-2">
            {habits?.map(habit => (
              <li
                key={habit.id}
                className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{habit.name}</p>
                  {habit.description && (
                    <p className="text-xs text-slate-400">{habit.description}</p>
                  )}
                </div>
                <span className="text-xs uppercase text-slate-400">
                  {habit.frequency}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
