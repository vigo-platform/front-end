import type { UserProfile } from '../../user/types/user.types'

export const previewAthlete: UserProfile = {
  user_id: '00000000-0000-4000-8000-000000000101',
  email: 'alex.morgan@example.com',
  display_name: 'Alex Morgan',
  phone: '+1 202 555 0142',
  avatar_url: null,
  role: 'ATHLETE',
  status: 'ACTIVE',
  created_at: '2025-08-14T09:30:00Z',
  updated_at: '2026-10-28T12:00:00Z',
}

export const previewCoach: UserProfile = {
  user_id: '00000000-0000-4000-8000-000000000202',
  email: 'jordan.davis@example.com',
  display_name: 'Jordan Davis',
  phone: '+1 202 555 0178',
  avatar_url: null,
  role: 'COACH',
  status: 'ACTIVE',
  created_at: '2024-03-12T09:30:00Z',
  updated_at: '2026-10-28T12:00:00Z',
}

export const previewAthleteCoachRelation = {
  relation_id: '00000000-0000-4000-8000-000000000301',
  coach_id: previewCoach.user_id,
  coach_name: 'Jordan Davis',
  athlete_id: previewAthlete.user_id,
  athlete_name: 'Alex Morgan',
  plan_id: '00000000-0000-4000-8000-000000000401',
  plan_title: 'Strength & Conditioning',
  starts_at: '2026-10-01T00:00:00Z',
  ends_at: '2026-12-31T23:59:59Z',
  status: 'ACTIVE' as const,
}

export const previewCoachRelations = [
  previewAthleteCoachRelation,
  {
    relation_id: '00000000-0000-4000-8000-000000000302',
    coach_id: previewCoach.user_id,
    coach_name: 'Jordan Davis',
    athlete_id: '00000000-0000-4000-8000-000000000102',
    athlete_name: 'Taylor Reed',
    plan_id: '00000000-0000-4000-8000-000000000402',
    plan_title: 'Mobility & Recovery',
    starts_at: '2026-09-15T00:00:00Z',
    ends_at: '2026-12-15T23:59:59Z',
    status: 'ACTIVE' as const,
  },
  {
    relation_id: '00000000-0000-4000-8000-000000000303',
    coach_id: previewCoach.user_id,
    coach_name: 'Jordan Davis',
    athlete_id: '00000000-0000-4000-8000-000000000103',
    athlete_name: 'Casey Lee',
    plan_id: '00000000-0000-4000-8000-000000000403',
    plan_title: 'Core Stability',
    starts_at: '2026-08-20T00:00:00Z',
    ends_at: '2026-11-20T23:59:59Z',
    status: 'ACTIVE' as const,
  },
]

export const previewCoachPlans = [
  {
    plan_id: '00000000-0000-4000-8000-000000000401',
    coach_id: previewCoach.user_id,
    title: 'Strength & Conditioning',
    description: 'A balanced strength plan focused on progressive training.',
    price: 1800000,
    duration_days: 90,
    includes: ['WORKOUT'] as const,
    status: 'ACTIVE' as const,
  },
  {
    plan_id: '00000000-0000-4000-8000-000000000402',
    coach_id: previewCoach.user_id,
    title: 'Mobility & Recovery',
    description: 'A plan focused on mobility and recovery routines.',
    price: 1200000,
    duration_days: 60,
    includes: ['WORKOUT'] as const,
    status: 'ACTIVE' as const,
  },
]
