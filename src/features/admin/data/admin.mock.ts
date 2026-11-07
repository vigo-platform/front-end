import type { AdminCoachApplication, AdminPage, AdminUser } from '../types/admin.types'

export const previewAdmin: AdminUser = {
  user_id: '00000000-0000-4000-8000-000000000900', email: 'admin@vigo.example', display_name: 'Morgan Lee',
  phone: '+1 202 555 0199', avatar_url: null, role: 'ADMIN', status: 'ACTIVE',
  created_at: '2024-01-12T09:30:00Z', updated_at: '2026-11-01T12:00:00Z',
}
export const previewAdminUsers: AdminUser[] = [
  previewAdmin,
  { user_id: '00000000-0000-4000-8000-000000000101', email: 'alex.morgan@example.com', display_name: 'Alex Morgan', phone: '+1 202 555 0142', role: 'ATHLETE', status: 'ACTIVE', created_at: '2025-08-14T09:30:00Z' },
  { user_id: '00000000-0000-4000-8000-000000000202', email: 'jordan.davis@example.com', display_name: 'Jordan Davis', phone: '+1 202 555 0178', role: 'COACH', status: 'ACTIVE', created_at: '2024-03-12T09:30:00Z' },
  { user_id: '00000000-0000-4000-8000-000000000303', email: 'taylor.reed@example.com', display_name: 'Taylor Reed', role: 'ATHLETE', status: 'SUSPENDED', created_at: '2025-02-20T09:30:00Z' },
  { user_id: '00000000-0000-4000-8000-000000000404', email: 'casey.lee@example.com', display_name: 'Casey Lee', role: 'ATHLETE', status: 'ACTIVE', created_at: '2026-03-05T09:30:00Z' },
]
export const previewCoachApplications: AdminCoachApplication[] = [
  { coach_id: '00000000-0000-4000-8000-000000000501', display_name: 'Jamie Carter', headline: 'Strength & Conditioning Coach', bio: 'I help athletes build sustainable strength and improve movement quality through structured, progressive training.', specialties: ['Strength Training', 'Conditioning', 'Mobility'], experience_years: 7, certifications: [{ title: 'Certified Strength and Conditioning Specialist', issuer: 'NSCA', year: 2022 }], instagram_handle: 'jamie.moves', status: 'PENDING', active_athletes_count: 0, created_at: '2026-11-02T10:00:00Z' },
  { coach_id: '00000000-0000-4000-8000-000000000502', display_name: 'Riley Brooks', headline: 'Mobility Coach', bio: 'A mobility coach focused on helping recreational athletes move with confidence and build consistent habits.', specialties: ['Mobility', 'Recovery'], experience_years: 5, status: 'PENDING', active_athletes_count: 0, created_at: '2026-11-04T13:20:00Z' },
  { coach_id: '00000000-0000-4000-8000-000000000503', display_name: 'Sam Rivera', headline: 'Performance Coach', bio: 'Supporting athletes with practical performance training and long-term development.', specialties: ['Performance', 'Conditioning'], experience_years: 9, status: 'APPROVED', active_athletes_count: 12, created_at: '2026-10-12T08:00:00Z' },
]
export function makePreviewPage<T>(items: T[], page = 0, size = 10): AdminPage<T> {
  return { page, size, total_elements: items.length, total_pages: Math.max(1, Math.ceil(items.length / size)), content: items.slice(page * size, (page + 1) * size) }
}
