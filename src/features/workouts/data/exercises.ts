import type { Exercise } from '../types/workout.types'

// Sample catalog data for frontend development.
// Replace this source with the Exercise API when its contract is available.
export const exerciseLibrary: Exercise[] = [
  {
    id: 'ex-001',
    name: 'Barbell Squat',
    category: 'STRENGTH',
    muscle_group: 'Quadriceps',
    equipment: 'Barbell',
    description: 'A compound lower-body movement focused on squat mechanics.',
  },
  {
    id: 'ex-002',
    name: 'Push-up',
    category: 'STRENGTH',
    muscle_group: 'Chest',
    equipment: 'Bodyweight',
    description: 'A bodyweight pushing movement for the chest, shoulders, and triceps.',
  },
  {
    id: 'ex-003',
    name: 'Dumbbell Row',
    category: 'STRENGTH',
    muscle_group: 'Back',
    equipment: 'Dumbbells',
    description: 'A unilateral pulling movement for the upper back.',
  },
  {
    id: 'ex-004',
    name: 'Plank',
    category: 'CORE',
    muscle_group: 'Core',
    equipment: 'Bodyweight',
    description: 'An isometric exercise focused on trunk stability.',
  },
  {
    id: 'ex-005',
    name: 'Romanian Deadlift',
    category: 'STRENGTH',
    muscle_group: 'Hamstrings',
    equipment: 'Barbell',
    description: 'A hip-hinge movement emphasizing the posterior chain.',
  },
  {
    id: 'ex-006',
    name: 'Jump Rope',
    category: 'CARDIO',
    muscle_group: 'Full body',
    equipment: 'Jump rope',
    description: 'A rhythmic conditioning exercise.',
  },
  {
    id: 'ex-007',
    name: 'World’s Greatest Stretch',
    category: 'MOBILITY',
    muscle_group: 'Hips and thoracic spine',
    equipment: 'Bodyweight',
    description: 'A mobility sequence combining a lunge and upper-body rotation.',
  },
  {
    id: 'ex-008',
    name: 'Glute Bridge',
    category: 'STRENGTH',
    muscle_group: 'Glutes',
    equipment: 'Bodyweight',
    description: 'A hip-extension movement focused on glute activation.',
  },
]
