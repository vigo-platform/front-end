export interface CoachProfileRequest {
  display_name: string
  headline?: string
  bio: string
  specialties: string[]
  experience_years: number
  certifications?: Array<{
    title: string
    issuer?: string
    year?: number
  }>
  instagram_handle?: string | null
  result_image_urls?: string[]
}

export interface CoachPlanFeatureLabel {
  id: number
  code: string
  label: string
}

export interface CoachPublicPlanSummary {
  id: number
  title: string
  summary: string | null
  price: number
  compare_at_price: number | null
  currency: string
  duration_days: number
  is_recommended: boolean
  display_order: number
  features: CoachPlanFeatureLabel[]
}

export interface CoachPlanField {
  id: number
  code: string
  label: string
  help_text?: string | null
  value_type?: string
  value?: unknown
  selected_options?: Array<{ code: string; label: string }>
}

export interface CoachPlanFeature {
  id: number
  code: string
  label: string
  description?: string | null
  category?: string | null
  fields: CoachPlanField[]
}

export interface CoachPublicPlanDetail {
  id: number
  coach_id: number
  title: string
  summary: string | null
  description: string | null
  price: number
  compare_at_price: number | null
  currency: string
  duration_days: number
  first_delivery_days: number | null
  is_recommended: boolean
  display_order: number
  includes: CoachPlanFeatureLabel[]
  features: CoachPlanFeature[]
  general_fields: CoachPlanField[]
}

export interface CoachProfile extends CoachProfileRequest {
  coach_id: string
  avatar_url?: string | null
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejection_reason?: string | null
  min_plan_price?: number | null
  active_athletes_count?: number
  created_at?: string
  updated_at?: string
  has_active_plan?: boolean
  price?: number | null
  compare_at_price?: number | null
  currency?: string | null
  plans?: CoachPublicPlanSummary[]
}

export interface CoachDirectoryItem {
  coachId: number
  displayName: string
  headline: string | null
  bio: string
  specialties: string[]
  experienceYears: number
  certifications: Array<{
    title: string
    issuer?: string
    year?: number
  }>
  instagramHandle: string | null
  resultImageUrls: string[]
  avatarUrl: string | null
  minPlanPrice: number | null
  has_active_plan: boolean
  price: number | null
  compare_at_price: number | null
  currency: string | null
  activeAthletesCount: number
  createdAt: string
  updatedAt: string
}

export interface CoachDirectoryPage {
  page: number
  size: number
  totalElements: number
  totalPages: number
  content: CoachDirectoryItem[]
}

export interface CoachDirectoryQuery {
  page?: number
  size?: number
}

export interface CoachPlanFormField {
  id: number
  code: string
  label: string
  helpText?: string | null
  valueType: string
  required?: boolean
  validationRules?: unknown
}

export interface CoachPlanFormOptions {
  includeOptions: CoachPlanFeatureLabel[]
  generalFields: CoachPlanFormField[]
  features: CoachPlanFeatureLabel[]
}

export interface CoachPlanFieldValueInput {
  fieldId: number
  value: unknown
}

export interface CoachPlanCreateRequest {
  title: string
  summary?: string | null
  description?: string | null
  price: number
  durationDays: number
  firstDeliveryDays?: number | null
  includes: string[]
  featureIds: number[]
  fieldValues: CoachPlanFieldValueInput[]
}

export interface CoachPlanPatchRequest {
  title?: string
  summary?: string | null
  description?: string | null
  price?: number
  compareAtPrice?: number | null
  durationDays?: number
  firstDeliveryDays?: number | null
  includes?: Array<{ code: string }>
  features?: Array<{
    featureId: number
    fields: CoachPlanFieldValueInput[] | null
  }>
  fields?: CoachPlanFieldValueInput[]
}

export interface CoachOwnedPlanSummary extends CoachPublicPlanSummary {
  is_active: boolean
  is_archived: boolean
}

export interface ManagedCoachPlan {
  planId: number
  coachId: number
  title: string
  summary: string | null
  description: string | null
  price: number
  compareAtPrice: number | null
  currency: string
  durationDays: number
  firstDeliveryDays: number | null
  includes: string[]
  features: CoachPlanFeatureLabel[]
  featureIds: number[]
  fieldValues: Array<{
    fieldId: number
    featureId: number | null
    code: string
    label: string
    value: unknown
    selectedOptions: Array<{ code: string; label: string }>
  }>
  status: string
  isActive: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface CoachApplicationCertificate {
  category: 'UNIVERSITY' | 'FEDERATION' | 'SKILL'
  title: string
  issuer?: string
  fieldOfStudy?: string
  degree?: string
  fileId: string
}

export interface CoachApplicationExperience {
  title: string
  organization?: string
  description?: string
  durationMonths?: number
}

export interface CoachApplicationRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  headline?: string | null
  bio: string
  specialties: string[]
  experienceYears: number
  profileImageFileId?: string | null
  certificates?: CoachApplicationCertificate[]
  experiences?: CoachApplicationExperience[]
  instagramHandle?: string | null
  locale?: 'fa' | 'en'
}

export interface CoachApplicationSummary {
  applicationId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  lookupToken?: string | null
  submittedAt: string
  reviewedAt?: string | null
}
