import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { AddHabitForm } from '@/components/AddHabitForm'
import { CompleteTodayButton } from '@/components/CompleteTodayButton'
import { DeleteHabitButton } from '@/components/DeleteHabitButton'
import { LogoutButton } from '@/components/LogoutButton'
import { calculateCurrentStreak } from '@/lib/streaks'

type HabitRow = {
  id: string
  name: string
  description: string | null
  frequency: string
  created_at: string
}

type LogRow = {
  habit_id: string
  date: string
  completed: boolean
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: habitsData, error: habitsError } = await supabase
    .from('habits')
    .select('id, name, description, frequency, created_at')
    .order('created_at', { ascending: false })

  const habits: HabitRow[] = habitsData ?? []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: logsData, error: logsError } = await supabase
    .from('habit_logs')
    .select('habit_id, date, completed')
    .gte('date', thirtyDaysAgo.toISOString().slice(0, 10))

  const logs: LogRow[] = logsData ?? []

  if (habitsError) {
    console.error('Failed to load habits', habitsError)
  }
  if (logsError) {
    console.error('Failed to load logs', logsError)
  }

  const totalHabits = habits.length
  const completedTodayCount = habits.filter((habit) => {
    const habitLogs = logs
      .filter((log) => log.habit_id === habit.id && log.completed)
      .map((log) => log.date)
    return habitLogs.some((d) => d === todayStr)
  }).length

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#1f2937_0,_#020617_55%,_#020617_100%)] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl px-8 py-7 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Habits</h1>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>{user.email}</span>
              <LogoutButton />
            </div>
          </header>

          <AddHabitForm />

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Your habits
            </h2>

            {habits.length === 0 && (
              <p className="text-xs text-slate-400">
                No habits yet. Add your first one above.
              </p>
            )}

            <ul className="space-y-2">
              {habits.map((habit) => {
                const habitLogs = logs
                  .filter(
                    (log) => log.habit_id === habit.id && log.completed
                  )
                  .map((log) => log.date)

                const currentStreak = calculateCurrentStreak(habitLogs)
                const doneToday = habitLogs.some((d) => d === todayStr)

                return (
                  <li
                    key={habit.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/80 border border-slate-800 px-5 py-4 text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-50">
                        {habit.name}
                      </p>
                      {habit.description && (
                        <p className="text-xs text-slate-400">
                          {habit.description}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">
                        {doneToday
                          ? 'Done today ✅'
                          : `Frequency: ${habit.frequency}`}
                        {' · '}
                        Current streak: {currentStreak} day
                        {currentStreak === 1 ? '' : 's'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <CompleteTodayButton
                        habitId={habit.id}
                        doneToday={doneToday}
                      />
                      <DeleteHabitButton habitId={habit.id} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="mt-4 rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Today&apos;s stats
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              Completed {completedTodayCount} of {totalHabits} habit
              {totalHabits === 1 ? '' : 's'} today.
            </p>
          </section>
        </div>

        <footer className="mt-4 flex justify-between text-[11px] text-slate-500">
          <span>Habit Tracker</span>
          <span>v0.1.0 · React · Supabase</span>
        </footer>
      </div>
    </main>
  )
}
