import { apiRequest } from '../../../shared/api/client'
import type {
  CoachApplicationRequest,
  CoachApplicationSummary,
} from '../types/coach.types'

interface CoachApplicationSummaryResponse {
  applicationId: string
  status: CoachApplicationSummary['status']
  lookupToken?: string | null
  submittedAt: string
  reviewedAt?: string | null
}

interface CoachApplicationStatusResponse {
  applicationId: string
  status: CoachApplicationSummary['status']
  submittedAt: string
  reviewedAt?: string | null
}

function mapApplicationSummary(
  data: CoachApplicationSummaryResponse,
): CoachApplicationSummary {
  return {
    applicationId: data.applicationId,
    status: data.status,
    lookupToken: data.lookupToken ?? null,
    submittedAt: data.submittedAt,
    reviewedAt: data.reviewedAt ?? null,
  }
}

export const coachApplicationService = {
  async submit(data: CoachApplicationRequest) {
    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      headline: data.headline,
      bio: data.bio,
      specialties: data.specialties,
      experienceYears: data.experienceYears,
      profileImageFileId: data.profileImageFileId,
      certificates: data.certificates?.map((certificate) => ({
        category: certificate.category,
        title: certificate.title,
        issuer: certificate.issuer,
        fieldOfStudy: certificate.fieldOfStudy,
        degree: certificate.degree,
        fileId: certificate.fileId,
      })),
      experiences: data.experiences?.map((experience) => ({
        title: experience.title,
        organization: experience.organization,
        description: experience.description,
        durationMonths: experience.durationMonths,
      })),
      instagramHandle: data.instagramHandle,
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
      applicationId: response.data.applicationId,
      status: response.data.status,
      submittedAt: response.data.submittedAt,
      reviewedAt: response.data.reviewedAt ?? null,
    }
  },
}
