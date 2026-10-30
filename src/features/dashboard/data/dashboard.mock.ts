import type { AthleteDashboardData } from '../types/dashboard.types'

// All IDs and personal information below are fictional.
// API-backed objects follow user.yaml.
// Workout previews and dashboard statistics are UI-only mock data.

export const athleteDashboardMock: AthleteDashboardData = {
  user: {
    user_id: '7d1c0b1e-0000-0000-0000-000000000001',
    email: 'sarina@example.com',
    display_name: 'Sarina',
    phone: null,
    avatar_url: null,
    role: 'ATHLETE',
    status: 'ACTIVE',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-10-20T09:00:00Z',
  },

  coach: {
    coach_id: '7d1c0b1e-0000-0000-0000-000000000002',
    display_name: 'Alex Morgan',
    headline: 'Personal Trainer',
    bio: 'A fictional coach profile used for frontend development and layout testing.',
    specialties: ['Strength Training', 'Conditioning'],
    experience_years: 8,
    certifications: [],
    instagram_handle: null,
    result_image_urls: [],
    avatar_url: null,
    status: 'APPROVED',
    active_athletes_count: 12,
  },

  relation: {
    relation_id: '7d1c0b1e-0000-0000-0000-000000000003',
    coach_id: '7d1c0b1e-0000-0000-0000-000000000002',
    coach_name: 'Alex Morgan',
    athlete_id: '7d1c0b1e-0000-0000-0000-000000000001',
    athlete_name: 'Sarina',
    plan_id: '7d1c0b1e-0000-0000-0000-000000000004',
    plan_title: 'Strength Foundation',
    starts_at: '2026-10-01T00:00:00Z',
    ends_at: '2026-11-30T23:59:59Z',
    status: 'ACTIVE',
  },

  plan: {
    plan_id: '7d1c0b1e-0000-0000-0000-000000000004',
    coach_id: '7d1c0b1e-0000-0000-0000-000000000002',
    title: 'Strength Foundation',
    description: 'A fictional training plan for dashboard development.',
    price: 1500000,
    duration_days: 60,
    includes: ['WORKOUT'],
    status: 'ACTIVE',
  },

  // These statistics are illustrative.
  // The currently available YAML contracts do not define these metrics.
  stats: {
    completed_workouts: 12,
    training_hours: 18.5,
    current_streak_days: 5,
  },

  // Temporary frontend models.
  // Replace these with the actual Workout API contract when it is available.
  next_workout: {
    id: 'workout-preview-001',
    title: 'Upper Body Strength',
    category: 'STRENGTH',
    duration_minutes: 45,
    exercise_count: 6,
    difficulty: 'INTERMEDIATE',
    scheduled_label: 'Today',
  },

  assigned_workouts: [
    {
      id: 'workout-preview-001',
      title: 'Upper Body Strength',
      category: 'STRENGTH',
      duration_minutes: 45,
      exercise_count: 6,
      difficulty: 'INTERMEDIATE',
      scheduled_label: 'Today',
    },
    {
      id: 'workout-preview-002',
      title: 'Lower Body & Core',
      category: 'STRENGTH',
      duration_minutes: 50,
      exercise_count: 7,
      difficulty: 'INTERMEDIATE',
      scheduled_label: 'Tomorrow',
    },
    {
      id: 'workout-preview-003',
      title: 'Active Recovery',
      category: 'RECOVERY',
      duration_minutes: 30,
      exercise_count: 4,
      difficulty: 'BEGINNER',
      scheduled_label: 'Friday',
    },
  ],
}
