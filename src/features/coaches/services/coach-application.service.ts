import { apiRequest } from '../../../shared/api/client'
import type {
  CoachApplicationRequest,
  CoachApplicationSummary,
} from '../types/coach.types'

interface CoachApplicationSummaryResponse {
  application_id: string
  status: CoachApplicationSummary['status']
  lookup_token?: string | null
  submitted_at: string
  reviewed_at?: string | null
}

interface CoachApplicationStatusResponse {
  application_id: string
  status: CoachApplicationSummary['status']
  submitted_at: string
  reviewed_at?: string | null
}

function mapApplicationSummary(
  data: CoachApplicationSummaryResponse,
): CoachApplicationSummary {
  return {
    applicationId: data.application_id,
    status: data.status,
    lookupToken: data.lookup_token ?? null,
    submittedAt: data.submitted_at,
    reviewedAt: data.reviewed_at ?? null,
  }
}

export const coachApplicationService = {
  async submit(data: CoachApplicationRequest) {
    const requestBody = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      headline: data.headline,
      bio: data.bio,
      specialties: data.specialties,
      experience_years: data.experienceYears,
      profile_image_file_id: data.profileImageFileId,
      certificates: data.certificates?.map((certificate) => ({
        category: certificate.category,
        title: certificate.title,
        issuer: certificate.issuer,
        field_of_study: certificate.fieldOfStudy,
        degree: certificate.degree,
        file_id: certificate.fileId,
      })),
      experiences: data.experiences?.map((experience) => ({
        title: experience.title,
        organization: experience.organization,
        description: experience.description,
        duration_months: experience.durationMonths,
      })),
      instagram_handle: data.instagramHandle,
      locale: data.locale,
    }

    const response = await apiRequest<CoachApplicationSummaryResponse>(
      '/api/v1/coaches/applications',
      {
        method: 'POST',
        body: requestBody,
      },
    )

    return mapApplicationSummary(response.data)
  },

  async getStatus(lookupToken: string) {
    const response = await apiRequest<CoachApplicationStatusResponse>(
      `/api/v1/coaches/applications/${encodeURIComponent(lookupToken)}`,
    )

    return {
      applicationId: response.data.application_id,
      status: response.data.status,
      submittedAt: response.data.submitted_at,
      reviewedAt: response.data.reviewed_at ?? null,
    }
  },
}
