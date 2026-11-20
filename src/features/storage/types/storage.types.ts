export type FileCategory = 'WORKOUT' | 'DIET' | 'SUPPLEMENT' | 'OTHER'

export interface StoredFileVersion {
  version: number
  original_name: string
  content_type: string
  size_bytes: number
  checksum_sha256: string
  change_note: string | null
  uploaded_by: string
  uploaded_at: string
}

export interface StoredFile {
  file_id: string
  coach_id: string
  athlete_id: string
  category: FileCategory
  title: string
  description?: string | null
  latest_version: number
  content_type?: string
  size_bytes?: number
  created_at: string
  updated_at: string
}

export interface StoredFileDetail extends StoredFile {
  versions: StoredFileVersion[]
}

export interface StoredFilePage {
  page: number
  size: number
  total_elements: number
  total_pages: number
  content: StoredFile[]
}

export interface FileListFilters {
  athlete_id?: string
  coach_id?: string
  category?: FileCategory
  page?: number
  size?: number
}

export interface UpdateStoredFileRequest {
  title?: string
  description?: string | null
  category?: FileCategory
}
