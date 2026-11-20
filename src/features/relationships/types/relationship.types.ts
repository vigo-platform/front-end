export type RelationStatus = 'ACTIVE' | 'EXPIRED'

export interface CoachAthleteRelation {
  relation_id: string
  coach_id: string
  coach_name: string
  athlete_id: string
  athlete_name: string
  plan_id: string
  plan_title: string
  starts_at: string
  ends_at: string
  status: RelationStatus
}

export interface RelationPage {
  page: number
  size: number
  total_elements: number
  total_pages: number
  content: CoachAthleteRelation[]
}

export interface RelationQuery {
  page?: number
  size?: number
  status?: RelationStatus
}
