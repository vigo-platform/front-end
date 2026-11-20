import { apiDownload, apiRequest } from '../../../shared/api/client'
import type {
  AssetAccessEntry,
  AssetAccessGrant,
  FileCategory,
  AssetDownloadUrl,
  FileListFilters,
  StorageAsset,
  StoredFile,
  StoredFileDetail,
  StoredFilePage,
  UpdateStoredFileRequest,
} from '../types/storage.types'

const auth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
})

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  return query.toString()
}

function uploadForm(file: File, fields: Record<string, string | undefined> = {}) {
  const form = new FormData()
  form.append('file', file)
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) form.append(key, value)
  })
  return form
}

export const storageService = {
  async uploadProgramFile(
    accessToken: string,
    file: File,
    details: { athlete_id: string; category: FileCategory; title: string; description?: string },
  ) {
    const body = uploadForm(file, details)
    return (await apiRequest<StoredFile>('/api/v1/files', {
      ...auth(accessToken),
      method: 'POST',
      body,
    })).data
  },

  async listFiles(accessToken: string, filters: FileListFilters = {}) {
    const query = queryString({
      athlete_id: filters.athlete_id,
      coach_id: filters.coach_id,
      category: filters.category,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    })
    return (await apiRequest<StoredFilePage>('/api/v1/files?' + query, auth(accessToken))).data
  },

  async getFile(accessToken: string, fileId: string) {
    return (await apiRequest<StoredFileDetail>(
      `/api/v1/files/${encodeURIComponent(fileId)}`,
      auth(accessToken),
    )).data
  },

  async updateFile(accessToken: string, fileId: string, data: UpdateStoredFileRequest) {
    return (await apiRequest<StoredFile>(
      `/api/v1/files/${encodeURIComponent(fileId)}`,
      { ...auth(accessToken), method: 'PATCH', body: data },
    )).data
  },

  async deleteFile(accessToken: string, fileId: string) {
    return (await apiRequest<null>(
      `/api/v1/files/${encodeURIComponent(fileId)}`,
      { ...auth(accessToken), method: 'DELETE' },
    )).data
  },

  async uploadFileVersion(accessToken: string, fileId: string, file: File, changeNote?: string) {
    const body = uploadForm(file, { change_note: changeNote })
    return (await apiRequest<unknown>(
      `/api/v1/files/${encodeURIComponent(fileId)}/versions`,
      { ...auth(accessToken), method: 'POST', body },
    )).data
  },

  async downloadFile(accessToken: string, fileId: string, version?: number) {
    const query = version === undefined ? '' : `?version=${encodeURIComponent(String(version))}`
    return apiDownload(`/api/v1/files/${encodeURIComponent(fileId)}/download${query}`, auth(accessToken))
  },

  async uploadPublicAsset(accessToken: string, file: File) {
    return (await apiRequest<StorageAsset>('/api/v1/assets/public', {
      ...auth(accessToken), method: 'POST', body: uploadForm(file),
    })).data
  },

  async uploadPrivateAsset(accessToken: string, file: File) {
    return (await apiRequest<StorageAsset>('/api/v1/assets/private', {
      ...auth(accessToken), method: 'POST', body: uploadForm(file),
    })).data
  },

  async getAsset(accessToken: string, assetId: string) {
    return (await apiRequest<StorageAsset>(
      `/api/v1/assets/${encodeURIComponent(assetId)}`,
      auth(accessToken),
    )).data
  },

  async getAssetDownloadUrl(accessToken: string, assetId: string) {
    return (await apiRequest<AssetDownloadUrl>(
      `/api/v1/assets/${encodeURIComponent(assetId)}/download-url`,
      auth(accessToken),
    )).data
  },

  async downloadAsset(assetId: string, accessToken?: string) {
    return apiDownload(
      `/api/v1/assets/${encodeURIComponent(assetId)}/content`,
      accessToken ? auth(accessToken) : {},
    )
  },

  async listAssetAccess(accessToken: string, assetId: string) {
    return (await apiRequest<AssetAccessEntry[]>(
      `/api/v1/assets/${encodeURIComponent(assetId)}/access`,
      auth(accessToken),
    )).data
  },

  async grantAssetAccess(
    accessToken: string,
    assetId: string,
    userId: string,
    permission: 'READ' | 'READ_WRITE' = 'READ',
  ) {
    return (await apiRequest<AssetAccessGrant>(
      `/api/v1/assets/${encodeURIComponent(assetId)}/access`,
      { ...auth(accessToken), method: 'POST', body: { user_id: userId, permission } },
    )).data
  },

  async revokeAssetAccess(accessToken: string, assetId: string, userId: string) {
    return (await apiRequest<null>(
      `/api/v1/assets/${encodeURIComponent(assetId)}/access/${encodeURIComponent(userId)}`,
      { ...auth(accessToken), method: 'DELETE' },
    )).data
  },

  async deleteAsset(accessToken: string, assetId: string) {
    return (await apiRequest<null>(
      `/api/v1/assets/${encodeURIComponent(assetId)}`,
      { ...auth(accessToken), method: 'DELETE' },
    )).data
  },
}
