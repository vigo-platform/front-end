import type { AssignedWorkout } from '../types/athlete-workout.types'

// Sample data for frontend development until a Workout API contract is provided.
export const assignedWorkoutsMock: AssignedWorkout[] = [
  {
    id: 'workout-demo-01',
    title: 'Full Body Strength A',
    description: 'A balanced strength session covering the main movement patterns.',
    coach_name: 'Demo Coach',
    assigned_at: '2026-11-05',
    estimated_duration_minutes: 45,
    exercises: [
      {
        exercise_id: 'ex-001',
        name: 'Barbell Squat',
        muscle_group: 'Quadriceps',
        equipment: 'Barbell',
        sets: 3,
        reps: 10,
        rest_seconds: 90,
      },
      {
        exercise_id: 'ex-003',
        name: 'Dumbbell Row',
        muscle_group: 'Back',
        equipment: 'Dumbbells',
        sets: 3,
        reps: 12,
        rest_seconds: 60,
      },
      {
        exercise_id: 'ex-004',
        name: 'Plank',
        muscle_group: 'Core',
        equipment: 'Bodyweight',
        sets: 3,
        reps: 30,
        rest_seconds: 45,
      },
    ],
  },
  {
    id: 'workout-demo-02',
    title: 'Mobility & Conditioning',
    description: 'A short session focused on mobility and general conditioning.',
    coach_name: 'Demo Coach',
    assigned_at: '2026-11-06',
    estimated_duration_minutes: 30,
    exercises: [
      {
        exercise_id: 'ex-007',
        name: 'World’s Greatest Stretch',
        muscle_group: 'Hips and thoracic spine',
        equipment: 'Bodyweight',
        sets: 2,
        reps: 8,
        rest_seconds: 30,
      },
      {
        exercise_id: 'ex-006',
        name: 'Jump Rope',
        muscle_group: 'Full body',
        equipment: 'Jump rope',
        sets: 3,
        reps: 60,
        rest_seconds: 45,
      },
    ],
  },
]
