import type { PrescribedExercise } from '../types/athlete-workout.types'

export interface WorkoutSetInput {
  actual_reps: string
  weight_kg: string
}

interface WorkoutExerciseCardProps {
  exercise: PrescribedExercise
  exerciseIndex: number
  inputs: Record<string, WorkoutSetInput>
  onInputChange: (
    key: string,
    field: keyof WorkoutSetInput,
    value: string,
  ) => void
}

function WorkoutExerciseCard({
  exercise,
  exerciseIndex,
  inputs,
  onInputChange,
}: WorkoutExerciseCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f5e8] text-xs font-bold text-[#607b38]">
            {String(exerciseIndex + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold">{exercise.name}</h3>
            <p className="mt-1 text-xs text-muted">
              {exercise.muscle_group} · {exercise.equipment}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted">
          {exercise.sets} × {exercise.reps}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        <span>Target: {exercise.reps} reps per set</span>
        <span>Rest: {exercise.rest_seconds}s</span>
      </div>

      <div className="mt-5 space-y-3">
        {Array.from({ length: exercise.sets }, (_, index) => {
          const setNumber = index + 1
          const key = `${exercise.exercise_id}-${setNumber}`

          return (
            <div
              key={key}
              className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] items-end gap-2 sm:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-3"
            >
              <span className="pb-3 text-xs font-semibold text-muted">
                Set {setNumber}
              </span>
              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted">
                  Completed reps
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  inputMode="numeric"
                  value={inputs[key]?.actual_reps ?? ''}
                  onChange={(event) =>
                    onInputChange(key, 'actual_reps', event.target.value)
                  }
                  placeholder={String(exercise.reps)}
                  className="h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-[#8da85d]"
                />
              </label>
              <label className="min-w-0">
                <span className="mb-1.5 block text-xs text-muted">
                  Weight (kg)
                </span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  inputMode="decimal"
                  value={inputs[key]?.weight_kg ?? ''}
                  onChange={(event) =>
                    onInputChange(key, 'weight_kg', event.target.value)
                  }
                  placeholder="Optional"
                  className="h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-[#8da85d]"
                />
              </label>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WorkoutExerciseCard
