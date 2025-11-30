export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1)) // newest first
  let streak = 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sorted.length; i++) {
    const d = new Date(sorted[i])
    d.setHours(0, 0, 0, 0)

    const diffDays = Math.round(
      (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === streak) {
      streak += 1
    } else if (diffDays > streak) {
      break
    }
  }

  return streak
}
