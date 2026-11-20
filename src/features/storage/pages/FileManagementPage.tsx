import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import Spinner from '../../../shared/components/feedback/Spinner'
import { storageService } from '../services/storage.service'
import type { FileCategory, StoredFile, StoredFileDetail, StoredFileVersion } from '../types/storage.types'

const PAGE_SIZE = 20
const MAX_FILE_SIZE = 20 * 1024 * 1024
const categories: FileCategory[] = ['WORKOUT', 'DIET', 'SUPPLEMENT', 'OTHER']

function formatBytes(bytes: number, locale: string) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024)) + ' MB'
}

function formatDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename || 'vigo-file'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function FileManagementPage() {
  const { t, i18n } = useTranslation()
  const { accessToken, user } = useAuth()
  const isCoach = user?.role === 'COACH'
  const [files, setFiles] = useState<StoredFile[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [category, setCategory] = useState<FileCategory | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedFile, setSelectedFile] = useState<StoredFileDetail | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingVersion, setIsAddingVersion] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [athleteId, setAthleteId] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadCategory, setUploadCategory] = useState<FileCategory>('WORKOUT')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [versionFile, setVersionFile] = useState<File | null>(null)
  const [changeNote, setChangeNote] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState<FileCategory>('WORKOUT')
  const [isEditing, setIsEditing] = useState(false)

  const loadFiles = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setLoadError('')
    try {
      const result = await storageService.listFiles(accessToken, { category: category || undefined, page, size: PAGE_SIZE })
      setFiles(result.content ?? [])
      setTotalPages(result.total_pages ?? 0)
    } catch (error) {
      setFiles([])
      setTotalPages(0)
      setLoadError(getUserErrorMessage(error, t, 'storage.loadError'))
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, category, page, t])

  useEffect(() => {
    void loadFiles()
  }, [loadFiles])

  async function openDetails(file: StoredFile) {
    if (!accessToken) return
    setSelectedFile(null)
    setIsEditing(false)
    setActionError('')
    setIsLoadingDetails(true)
    try {
      const detail = await storageService.getFile(accessToken, file.file_id)
      setSelectedFile(detail)
      setEditTitle(detail.title)
      setEditDescription(detail.description ?? '')
      setEditCategory(detail.category)
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'errors.loadDetails'))
    } finally {
      setIsLoadingDetails(false)
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !uploadFile || !athleteId.trim() || !uploadTitle.trim()) return
    if (uploadFile.size > MAX_FILE_SIZE) {
      setActionError(t('storage.fileTooLarge'))
      return
    }
    setActionError('')
    setActionMessage('')
    setIsUploading(true)
    try {
      await storageService.uploadProgramFile(accessToken, uploadFile, {
        athlete_id: athleteId.trim(),
        category: uploadCategory,
        title: uploadTitle.trim(),
        description: uploadDescription.trim() || undefined,
      })
      setActionMessage(t('storage.uploadSuccess'))
      setAthleteId('')
      setUploadTitle('')
      setUploadDescription('')
      setUploadFile(null)
      const input = document.getElementById('storage-upload-file') as HTMLInputElement | null
      if (input) input.value = ''
      if (page === 0) await loadFiles()
      else setPage(0)
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'storage.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  async function handleAddVersion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !selectedFile || !versionFile) return
    if (versionFile.size > MAX_FILE_SIZE) {
      setActionError(t('storage.fileTooLarge'))
      return
    }
    setActionError('')
    setActionMessage('')
    setIsAddingVersion(true)
    try {
      await storageService.uploadFileVersion(accessToken, selectedFile.file_id, versionFile, changeNote.trim() || undefined)
      setActionMessage(t('storage.versionSuccess'))
      setVersionFile(null)
      setChangeNote('')
      const input = document.getElementById('storage-version-file') as HTMLInputElement | null
      if (input) input.value = ''
      const detail = await storageService.getFile(accessToken, selectedFile.file_id)
      setSelectedFile(detail)
      await loadFiles()
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'storage.versionError'))
    } finally {
      setIsAddingVersion(false)
    }
  }

  async function handleSaveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accessToken || !selectedFile) return
    const updates: { title?: string; description?: string | null; category?: FileCategory } = {}
    if (editTitle.trim() !== selectedFile.title) updates.title = editTitle.trim()
    if (editDescription.trim() !== (selectedFile.description ?? '')) updates.description = editDescription.trim() || null
    if (editCategory !== selectedFile.category) updates.category = editCategory
    if (Object.keys(updates).length === 0) {
      setIsEditing(false)
      return
    }
    setActionError('')
    setActionMessage('')
    setIsSaving(true)
    try {
      const updated = await storageService.updateFile(accessToken, selectedFile.file_id, updates)
      setSelectedFile({ ...selectedFile, ...updated })
      setIsEditing(false)
      setActionMessage(t('storage.updateSuccess'))
      await loadFiles()
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'storage.updateError'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!accessToken || !selectedFile || !window.confirm(t('storage.deleteConfirm'))) return
    setActionError('')
    setActionMessage('')
    setIsDeleting(true)
    try {
      await storageService.deleteFile(accessToken, selectedFile.file_id)
      setSelectedFile(null)
      setActionMessage(t('storage.deleteSuccess'))
      await loadFiles()
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'storage.deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleDownload(file: StoredFileDetail, version?: number) {
    if (!accessToken) return
    setActionError('')
    try {
      const blob = await storageService.downloadFile(accessToken, file.file_id, version)
      const versionInfo = version === undefined
        ? file.versions.find((item) => item.version === file.latest_version)
        : file.versions.find((item) => item.version === version)
      saveBlob(blob, versionInfo?.original_name || file.title)
    } catch (error) {
      setActionError(getUserErrorMessage(error, t, 'errors.action'))
    }
  }

  const title = isCoach ? t('storage.title') : t('storage.athleteTitle')

  return (
    <AppShell title={title}>
      <div className="mx-auto w-full max-w-[1240px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[1.7px] text-success-fg">VIGO / STORAGE</p>
            <h1 className="mt-2 text-[30px] font-bold tracking-[-1px] text-fg">{title}</h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-fg-secondary">{t(isCoach ? 'storage.subtitle' : 'storage.athleteSubtitle')}</p>
          </div>
          <button type="button" onClick={() => void loadFiles()} disabled={isLoading} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-default bg-surface px-4 text-[10px] font-bold text-fg transition hover:bg-surface-muted disabled:opacity-50">
            {isLoading && <Spinner size="sm" />}
            {t('storage.refresh')}
          </button>
        </header>

        {actionMessage && <p role="status" className="rounded-xl border border-success-border bg-success-surface px-4 py-3 text-[11px] font-semibold text-success-fg">{actionMessage}</p>}
        {actionError && <p role="alert" className="rounded-xl border border-danger-border bg-danger-surface px-4 py-3 text-[11px] font-semibold text-danger-fg">{actionError}</p>}

        {isCoach && (
          <section className="rounded-[20px] border border-border-default bg-surface p-5 sm:p-7">
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[1.4px] text-success-fg">COACH WORKSPACE</p>
              <h2 className="mt-2 text-[18px] font-bold text-fg">{t('storage.uploadTitle')}</h2>
            </div>
            <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-[10px] font-semibold text-fg-secondary">
                {t('storage.athleteId')}
                <input required value={athleteId} onChange={(event) => setAthleteId(event.target.value)} placeholder="UUID" className="h-11 rounded-xl border border-border-default bg-surface-subtle px-3 text-[12px] text-fg outline-none focus:border-brand" />
                <span className="text-[9px] font-normal leading-5 text-fg-muted">{t('storage.athleteIdHelp')}</span>
              </label>
              <label className="grid gap-2 text-[10px] font-semibold text-fg-secondary">
                {t('storage.category')}
                <select value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value as FileCategory)} className="h-11 rounded-xl border border-border-default bg-surface-subtle px-3 text-[12px] text-fg outline-none focus:border-brand">
                  {categories.map((item) => <option key={item} value={item}>{t('storage.' + item)}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-[10px] font-semibold text-fg-secondary">
                {t('storage.fileTitle')}
                <input required value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} className="h-11 rounded-xl border border-border-default bg-surface-subtle px-3 text-[12px] text-fg outline-none focus:border-brand" />
              </label>
              <label className="grid gap-2 text-[10px] font-semibold text-fg-secondary">
                {t('storage.description')}
                <input value={uploadDescription} onChange={(event) => setUploadDescription(event.target.value)} placeholder={t('storage.optionalDescription')} className="h-11 rounded-xl border border-border-default bg-surface-subtle px-3 text-[12px] text-fg outline-none focus:border-brand" />
              </label>
              <label className="grid gap-2 text-[10px] font-semibold text-fg-secondary md:col-span-2">
                {t('storage.chooseFile')}
                <input id="storage-upload-file" required type="file" onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)} className="block w-full rounded-xl border border-border-default bg-surface-subtle px-3 py-3 text-[11px] text-fg file:me-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-[10px] file:font-bold file:text-success-fg" />
                <span className="text-[9px] font-normal text-fg-muted">20 MiB maximum</span>
              </label>
              <div className="md:col-span-2">
                <button type="submit" disabled={isUploading || !uploadFile} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-[10px] font-bold text-on-brand transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50">
                  {isUploading && <Spinner size="sm" className="text-on-brand" />}
                  {isUploading ? t('storage.uploading') : t('storage.upload')}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)]">
          <div className="min-w-0 rounded-[20px] border border-border-default bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-bold text-fg">{t('storage.files')}</h2>
                <p className="mt-1 text-[10px] text-fg-muted">{files.length} / {PAGE_SIZE}</p>
              </div>
              <select value={category} onChange={(event) => { setCategory(event.target.value as FileCategory | ''); setPage(0) }} className="h-9 rounded-full border border-border-default bg-surface-subtle px-3 text-[10px] text-fg outline-none focus:border-brand">
                <option value="">{t('storage.allCategories')}</option>
                {categories.map((item) => <option key={item} value={item}>{t('storage.' + item)}</option>)}
              </select>
            </div>

            {isLoading ? (
              <div className="flex min-h-48 items-center justify-center"><Spinner size="lg" className="text-brand-hover" /></div>
            ) : loadError ? (
              <div role="alert" className="mt-5 rounded-xl border border-danger-border bg-danger-surface px-4 py-6 text-center text-[11px] text-danger-fg">{loadError}</div>
            ) : files.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-12 text-center">
                <p className="text-[12px] font-semibold text-fg">{t('storage.noFiles')}</p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-border-default">
                {files.map((file) => (
                  <button key={file.file_id} type="button" onClick={() => void openDetails(file)} className={'flex w-full flex-col gap-2 py-4 text-start transition hover:bg-surface-subtle sm:flex-row sm:items-center sm:justify-between sm:px-3 ' + (selectedFile?.file_id === file.file_id ? 'rounded-xl bg-surface-subtle' : '')}>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-bold text-fg">{file.title}</span>
                      <span className="mt-1 block truncate text-[9px] text-fg-muted">{t('storage.' + file.category)} · {file.file_id}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3 text-[9px] text-fg-secondary">
                      <span>{t('storage.version')} {file.latest_version}</span>
                      {file.size_bytes !== undefined && <span>{formatBytes(file.size_bytes, i18n.language)}</span>}
                      <span aria-hidden="true">→</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-border-default pt-4">
              <span className="text-[9px] text-fg-muted">{t('storage.page')} {page + 1} {t('storage.of')} {Math.max(totalPages, 1)}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 0 || isLoading} onClick={() => setPage((value) => Math.max(0, value - 1))} className="rounded-full border border-border-default px-3 py-2 text-[9px] font-semibold text-fg disabled:opacity-40">{t('storage.previous')}</button>
                <button type="button" disabled={page + 1 >= totalPages || isLoading} onClick={() => setPage((value) => value + 1)} className="rounded-full border border-border-default px-3 py-2 text-[9px] font-semibold text-fg disabled:opacity-40">{t('storage.next')}</button>
              </div>
            </div>
          </div>

          <aside className="min-w-0 rounded-[20px] border border-border-default bg-surface p-5 sm:p-6">
            <h2 className="text-[17px] font-bold text-fg">{t('storage.details')}</h2>
            {isLoadingDetails ? (
              <div className="flex min-h-48 items-center justify-center"><Spinner size="lg" className="text-brand-hover" /></div>
            ) : !selectedFile ? (
              <div className="mt-5 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 text-center text-[11px] text-fg-muted">{t('storage.emptyVersions')}</div>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-[14px] font-bold text-fg">{selectedFile.title}</h3>
                    <p className="mt-1 break-all text-[9px] text-fg-muted">{selectedFile.file_id}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-success-surface px-2.5 py-1 text-[8px] font-bold text-success-fg">{t('storage.' + selectedFile.category)}</span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveDetails} className="space-y-3 rounded-xl bg-surface-subtle p-4">
                    <label className="grid gap-1.5 text-[9px] font-semibold text-fg-secondary">{t('storage.fileTitle')}<input required value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="h-10 rounded-lg border border-border-default bg-surface px-3 text-[11px] text-fg" /></label>
                    <label className="grid gap-1.5 text-[9px] font-semibold text-fg-secondary">{t('storage.description')}<textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} rows={3} className="rounded-lg border border-border-default bg-surface px-3 py-2 text-[11px] text-fg" /></label>
                    <label className="grid gap-1.5 text-[9px] font-semibold text-fg-secondary">{t('storage.category')}<select value={editCategory} onChange={(event) => setEditCategory(event.target.value as FileCategory)} className="h-10 rounded-lg border border-border-default bg-surface px-3 text-[11px] text-fg">{categories.map((item) => <option key={item} value={item}>{t('storage.' + item)}</option>)}</select></label>
                    <div className="flex gap-2"><button type="submit" disabled={isSaving} className="rounded-full bg-brand px-4 py-2 text-[9px] font-bold text-on-brand disabled:opacity-50">{isSaving ? t('storage.saving') : t('storage.save')}</button><button type="button" onClick={() => setIsEditing(false)} className="rounded-full border border-border-default px-4 py-2 text-[9px] font-semibold text-fg">{t('storage.cancel')}</button></div>
                  </form>
                ) : (
                  <>
                    <p className="text-[10px] leading-5 text-fg-secondary">{selectedFile.description || t('storage.noDescription')}</p>
                    <dl className="grid grid-cols-2 gap-3 rounded-xl bg-surface-subtle p-4 text-[9px]">
                      <div><dt className="text-fg-muted">{t('storage.version')}</dt><dd className="mt-1 font-bold text-fg">{selectedFile.latest_version}</dd></div>
                      <div><dt className="text-fg-muted">{t('storage.size')}</dt><dd className="mt-1 font-bold text-fg">{selectedFile.size_bytes !== undefined ? formatBytes(selectedFile.size_bytes, i18n.language) : '—'}</dd></div>
                      <div className="col-span-2"><dt className="text-fg-muted">{t('storage.contentType')}</dt><dd className="mt-1 break-all font-bold text-fg">{selectedFile.content_type || '—'}</dd></div>
                    </dl>
                  </>
                )}

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void handleDownload(selectedFile)} className="rounded-full bg-brand px-4 py-2.5 text-[9px] font-bold text-on-brand">{t('storage.download')}</button>
                  {isCoach && !isEditing && <button type="button" onClick={() => setIsEditing(true)} className="rounded-full border border-border-default px-4 py-2.5 text-[9px] font-semibold text-fg">{t('storage.edit')}</button>}
                  {isCoach && <button type="button" disabled={isDeleting} onClick={() => void handleDelete()} className="rounded-full border border-danger-border px-4 py-2.5 text-[9px] font-semibold text-danger-fg disabled:opacity-50">{isDeleting ? t('ui.Loading...') : t('storage.delete')}</button>}
                </div>

                {isCoach && (
                  <form onSubmit={handleAddVersion} className="space-y-3 rounded-xl border border-border-default p-4">
                    <h4 className="text-[11px] font-bold text-fg">{t('storage.addVersion')}</h4>
                    <label className="grid gap-1.5 text-[9px] font-semibold text-fg-secondary">{t('storage.chooseFile')}<input id="storage-version-file" required type="file" onChange={(event) => setVersionFile(event.target.files?.[0] ?? null)} className="block w-full text-[10px] text-fg file:me-2 file:rounded-lg file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:text-[9px] file:font-bold" /></label>
                    <label className="grid gap-1.5 text-[9px] font-semibold text-fg-secondary">{t('storage.changeNote')}<input value={changeNote} onChange={(event) => setChangeNote(event.target.value)} placeholder={t('storage.changeNotePlaceholder')} className="h-10 rounded-lg border border-border-default bg-surface-subtle px-3 text-[10px] text-fg" /></label>
                    <button type="submit" disabled={isAddingVersion || !versionFile} className="rounded-full bg-brand px-4 py-2.5 text-[9px] font-bold text-on-brand disabled:opacity-50">{isAddingVersion ? t('storage.addingVersion') : t('storage.addVersion')}</button>
                  </form>
                )}

                <div>
                  <h4 className="text-[11px] font-bold text-fg">{t('storage.versions')}</h4>
                  <div className="mt-3 space-y-2">
                    {[...(selectedFile.versions ?? [])].sort((a: StoredFileVersion, b: StoredFileVersion) => b.version - a.version).map((version) => (
                      <div key={version.version} className="flex items-center justify-between gap-3 rounded-xl bg-surface-subtle p-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-fg">{t('storage.version')} {version.version} {version.version === selectedFile.latest_version ? <span className="ms-1 text-success-fg">· {t('storage.latest')}</span> : null}</p>
                          <p className="mt-1 truncate text-[9px] text-fg-muted">{version.original_name}</p>
                          <p className="mt-1 text-[8px] text-fg-muted">{formatDate(version.uploaded_at, i18n.language)}</p>
                          {version.change_note && <p className="mt-1 text-[9px] text-fg-secondary">{version.change_note}</p>}
                        </div>
                        <button type="button" onClick={() => void handleDownload(selectedFile, version.version)} className="shrink-0 rounded-full border border-border-default px-3 py-2 text-[8px] font-bold text-fg">{t('storage.downloadVersion')}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </AppShell>
  )
}

export default FileManagementPage
