import type { UserProfile } from '../../user/types/user.types'
import type { CoachProfile } from '../../coaches/types/coach.types'

export const previewAthlete: UserProfile = {
  user_id: '00000000-0000-4000-8000-000000000101',
  email: 'alex.morgan@example.com',
  display_name: 'Alex Morgan',
  phone: '+1 202 555 0142',
  avatar_url: null,
  role: 'ATHLETE',
  status: 'ACTIVE',
  created_at: '2025-01-18T09:30:00Z',
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

export const previewCoachRelations = [
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

export const previewCoachProfile: CoachProfile = {
  coach_id: previewCoach.user_id,
  display_name: previewCoach.display_name ?? 'Jordan Davis',
  headline: 'Strength & Conditioning Coach',
  bio: 'I help athletes build sustainable strength, improve movement quality, and develop consistent training habits through structured coaching.',
  specialties: ['Strength Training', 'Conditioning', 'Mobility'],
  experience_years: 8,
  certifications: [{ title: 'Certified Strength and Conditioning Specialist', issuer: 'NSCA', year: 2021 }],
  instagram_handle: 'jordan.moves',
  result_image_urls: [],
  avatar_url: null,
  status: 'APPROVED',
  rejection_reason: null,
  min_plan_price: 1200000,
  active_athletes_count: 3,
  created_at: '2024-03-12T09:30:00Z',
  updated_at: '2026-10-28T12:00:00Z',
}
