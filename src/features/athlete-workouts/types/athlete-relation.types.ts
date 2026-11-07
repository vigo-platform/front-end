export type AthleteRelationStatus = 'ACTIVE' | 'EXPIRED'

export interface AthleteCoachRelation {
  relation_id: string
  coach_id: string
  coach_name: string
  athlete_id: string
  athlete_name: string
  plan_id: string
  plan_title: string
  starts_at: string
  ends_at: string
  status: AthleteRelationStatus
}
