import { useEffect, useMemo, useState } from 'react'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { adminService } from '../services/admin.service'
import { makePreviewPage, previewAdminUsers, previewCoachApplications } from '../data/admin.mock'
import type { AdminCoachApplication, AdminPage, AdminUser, CoachApplicationStatus } from '../types/admin.types'
import type { UserRole, UserStatus } from '../../user/types/user.types'
import { useTranslation } from 'react-i18next'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { AdminApplicationGridSkeleton, AdminDetailsSkeleton, TableRowsSkeleton } from '../../../shared/components/feedback/LoadingStates'
import Spinner from '../../../shared/components/feedback/Spinner'

type Tab = 'users' | 'coaches'
const field = 'mt-2 h-11 w-full rounded-xl border border-border-default bg-surface-subtle px-3.5 text-[11px] text-fg outline-none focus:border-brand-hover focus:bg-surface'
const eyebrow = 'text-[9px] font-bold uppercase tracking-[1px] text-fg-muted'
function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}
function dateLabel(value?: string, locale = 'en') {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
function initials(value?: string) { return (value || 'Vigo').split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') }
function Status({ value }: { value: string }) {
  const { t } = useTranslation()
  const style = value === 'ACTIVE' || value === 'APPROVED' ? 'bg-success-surface text-success-fg' : value === 'SUSPENDED' || value === 'REJECTED' ? 'bg-danger-surface text-danger-fg' : 'bg-warning-surface text-warning-fg'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.8px] ${style}`}>{t('ui.' + value)}</span>
}

function AdminDashboardPage() {
  const { t, i18n } = useTranslation()
  const { accessToken, user, isPreview } = useAuth()
  const preview = Boolean(isPreview)
  const [tab, setTab] = useState<Tab>('users')
  const [previewUsers, setPreviewUsers] = useState(previewAdminUsers)
  const [previewCoaches, setPreviewCoaches] = useState(previewCoachApplications)
  const [users, setUsers] = useState<AdminPage<AdminUser>>(() => makePreviewPage([]))
  const [coaches, setCoaches] = useState<AdminPage<AdminCoachApplication>>(() => makePreviewPage([]))
  const [q, setQ] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const [coachStatus, setCoachStatus] = useState<CoachApplicationStatus | ''>('PENDING')
  const [userPage, setUserPage] = useState(0)
  const [coachPage, setCoachPage] = useState(0)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedCoach, setSelectedCoach] = useState<AdminCoachApplication | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const displayedPendingCount = preview ? previewCoachApplications.filter((item) => item.status === 'PENDING').length : pendingCount

  const filteredPreviewUsers = useMemo(() => previewUsers.filter((item) => {
    const search = q.trim().toLowerCase()
    return (!search || item.display_name?.toLowerCase().includes(search) || item.email.toLowerCase().includes(search))
      && (!role || item.role === role) && (!status || item.status === status)
  }), [previewUsers, q, role, status])
  const filteredPreviewCoaches = previewCoaches.filter((item) => !coachStatus || item.status === coachStatus)

  useEffect(() => {
    if (preview || !accessToken) return
    let active = true
    adminService.listCoachApplications(accessToken, { page: 0, size: 1, status: 'PENDING' })
      .then((data) => { if (active) setPendingCount(data.total_elements) })
      .catch((e: unknown) => { if (active) setError(getUserErrorMessage(e, t, 'errors.loadApplications')) })
    return () => { active = false }
  }, [accessToken, preview, t])

  useEffect(() => {
    if (preview || !accessToken || tab !== 'users') return
    let active = true
    const loadUsers = async () => {
      await Promise.resolve()
      if (!active) return
      setLoading(true)
      setError('')
      try {
        const data = await adminService.listUsers(accessToken, { page: userPage, size: 10, role, status, q })
        if (active) setUsers(data)
      } catch (e) {
        if (active) setError(getUserErrorMessage(e, t, 'errors.loadUsers'))
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadUsers()
    return () => { active = false }
  }, [accessToken, preview, tab, userPage, role, status, q, t])

  useEffect(() => {
    if (preview || !accessToken || tab !== 'coaches') return
    let active = true
    const loadCoaches = async () => {
      await Promise.resolve()
      if (!active) return
      setLoading(true)
      setError('')
      try {
        const data = await adminService.listCoachApplications(accessToken, { page: coachPage, size: 10, status: coachStatus })
        if (active) setCoaches(data)
      } catch (e) {
        if (active) setError(getUserErrorMessage(e, t, 'errors.loadApplications'))
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadCoaches()
    return () => { active = false }
  }, [accessToken, preview, tab, coachPage, coachStatus, t])

  async function showUser(item: AdminUser) {
    setSelectedCoach(null); setSelectedUser(null); setError('')
    if (preview || !accessToken) { setSelectedUser(item); return }
    setIsDetailsLoading(true)
    try { setSelectedUser(await adminService.getUser(accessToken, item.user_id)) }
    catch (e) { setError(getUserErrorMessage(e, t, 'errors.loadDetails')) }
    finally { setIsDetailsLoading(false) }
  }
  async function showCoach(item: AdminCoachApplication) {
    setSelectedUser(null); setSelectedCoach(null); setError('')
    if (preview || !accessToken) { setSelectedCoach(item); return }
    setIsDetailsLoading(true)
    try { setSelectedCoach(await adminService.getCoachApplication(accessToken, item.coach_id)) }
    catch (e) { setError(getUserErrorMessage(e, t, 'errors.loadDetails')) }
    finally { setIsDetailsLoading(false) }
  }
  async function toggleUser(item: AdminUser) {
    const next: UserStatus = item.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    if (item.role === 'ADMIN' || item.user_id === user?.user_id) return
    const reason = next === 'SUSPENDED' ? window.prompt(t('ui.Reason for suspension (optional):')) : undefined
    if (reason === null || !window.confirm(t('ui.Change this account status to {{status}}?', { status: t('ui.' + next) }))) return
    setBusyAction(item.user_id); setError(''); setNotice('')
    try {
      const updated = preview ? { ...item, status: next } : await adminService.setUserStatus(accessToken!, item.user_id, { status: next, ...(reason?.trim() ? { reason: reason.trim() } : {}) })
      setPreviewUsers((current) => current.map((entry) => entry.user_id === updated.user_id ? updated : entry))
      setUsers((current) => ({ ...current, content: current.content.map((entry) => entry.user_id === updated.user_id ? updated : entry) }))
      setSelectedUser(updated); setNotice(t('ui.Account status changed to {{status}}.', { status: t('ui.' + next) }))
    } catch (e) { setError(getUserErrorMessage(e, t, 'errors.updateAccount')) }
    finally { setBusyAction(null) }
  }
  async function reviewCoach(item: AdminCoachApplication, action: 'approve' | 'reject') {
    let reason = ''
    if (action === 'reject') {
      const answer = window.prompt(t('ui.Rejection reason (5–500 characters):'))
      if (answer === null) return
      reason = answer.trim()
      if (reason.length < 5 || reason.length > 500) { setError(t("ui.The reason must contain 5–500 characters.")); return }
    }
    if (!window.confirm(t('ui.Are you sure you want to {{action}} this application?', { action: t(action === 'approve' ? 'ui.Approve' : 'ui.Reject') }))) return
    setBusyAction(item.coach_id); setError(''); setNotice('')
    try {
      const updated = preview
        ? { ...item, status: action === 'approve' ? 'APPROVED' as const : 'REJECTED' as const, rejection_reason: action === 'reject' ? reason : null }
        : action === 'approve' ? await adminService.approveCoach(accessToken!, item.coach_id) : await adminService.rejectCoach(accessToken!, item.coach_id, reason)
      setPreviewCoaches((current) => current.map((entry) => entry.coach_id === updated.coach_id ? updated : entry))
      setCoaches((current) => ({ ...current, content: current.content.map((entry) => entry.coach_id === updated.coach_id ? updated : entry) }))
      setSelectedCoach(updated); setNotice(t('ui.Application {{action}}.', { action: t(action === 'approve' ? 'ui.Approved' : 'ui.Rejected') }))
    } catch (e) { setError(getUserErrorMessage(e, t, 'errors.reviewApplication')) }
    finally { setBusyAction(null) }
  }

  const totalUsers = preview ? previewUsers.length : users.total_elements
  const userRows = preview ? makePreviewPage(filteredPreviewUsers, userPage).content : users.content
  const coachRows = preview ? filteredPreviewCoaches : coaches.content
  const closeDetails = () => { setSelectedUser(null); setSelectedCoach(null); setIsDetailsLoading(false) }

  return (
    <AppShell title={t('ui.Admin overview')}>
      <div className="mx-auto w-full max-w-[1320px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[9px] font-bold uppercase tracking-[2px] text-success-fg">{t("ui.Administration")}</p><h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-1.5px] text-fg sm:text-[42px]">{t('ui.Good to see you, {{name}}.', { name: (user?.display_name || 'Admin').split(/\s+/)[0] })}</h1><p className="mt-2 text-[12px] leading-6 text-fg-secondary">{t("ui.Manage platform accounts and review coach applications.")}</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-success-border bg-success-surface px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-success-fg"><span className="h-1.5 w-1.5 rounded-full bg-brand-hover" />{t("ui.Administrator")}</span>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-[18px] border border-border-default bg-surface p-5"><p className={eyebrow}>{t("ui.Platform users")}</p><p className="mt-4 text-[30px] font-bold text-fg">{formatNumber(totalUsers, i18n.language)}</p><p className="mt-1 text-[10px] text-fg-muted">{t("ui.Accounts in the platform")}</p></article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5"><p className={eyebrow}>{t("ui.Pending applications")}</p><p className="mt-4 text-[30px] font-bold text-fg">{displayedPendingCount}</p><p className="mt-1 text-[10px] text-fg-muted">{t("ui.Waiting for your review")}</p></article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5"><p className={eyebrow}>{t("ui.Your account")}</p><p className="mt-4 text-[22px] font-bold text-fg" >{t('ui.' + (user?.status ?? 'ACTIVE'))}</p><p className="mt-1 text-[10px] text-fg-muted">{t("ui.Administrator access")}</p></article>
        </section>

        <section className="rounded-[20px] border border-border-default bg-surface p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-4">
            <div><p className={eyebrow}>{t("ui.Workspace")}</p><h2 className="mt-1 text-[19px] font-bold text-fg">{t("ui.Platform management")}</h2></div>
            <div className="flex rounded-full bg-surface-muted p-1">
              <button onClick={() => { setTab('users'); closeDetails(); setNotice(''); setError('') }} className={`rounded-full px-4 py-2 text-[10px] font-bold ${tab === 'users' ? 'bg-brand text-on-brand' : 'text-fg-secondary'}`}>{t("ui.Users")}</button>
              <button onClick={() => { setTab('coaches'); closeDetails(); setNotice(''); setError('') }} className={`rounded-full px-4 py-2 text-[10px] font-bold ${tab === 'coaches' ? 'bg-brand text-on-brand' : 'text-fg-secondary'}`}>{t("ui.Coach applications")}</button>
            </div>
          </div>

          {tab === 'users' ? <>
            <div className="grid gap-3 py-5 md:grid-cols-[minmax(220px,1fr)_170px_170px]">
              <label><span className={eyebrow}>{t("ui.Search users")}</span><input className={field} value={q} onChange={(e) => { setQ(e.target.value); setUserPage(0) }} placeholder={t("ui.Search by name or email")} /></label>
              <label><span className={eyebrow}>{t("ui.Role")}</span><select className={field} value={role} onChange={(e) => { setRole(e.target.value as UserRole | ''); setUserPage(0) }}><option value="">{t("ui.All roles")}</option><option value="ATHLETE">{t("ui.Athlete")}</option><option value="COACH">{t("ui.Coach")}</option><option value="ADMIN">{t("ui.Admin")}</option></select></label>
              <label><span className={eyebrow}>{t("ui.Account status")}</span><select className={field} value={status} onChange={(e) => { setStatus(e.target.value as UserStatus | ''); setUserPage(0) }}><option value="">{t("ui.All statuses")}</option><option value="ACTIVE">{t("ui.Active")}</option><option value="SUSPENDED">{t("ui.Suspended")}</option></select></label>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left">
              <thead><tr className="border-y border-border-default text-[8px] font-bold uppercase tracking-[1px] text-fg-muted"><th className="py-3 pr-4">{t("ui.User")}</th><th className="py-3 pr-4">{t("ui.Role")}</th><th className="py-3 pr-4">{t("ui.Status")}</th><th className="py-3 pr-4">{t("ui.Joined")}</th><th className="py-3 text-right">{t("ui.Action")}</th></tr></thead>
              <tbody>{loading && userRows.length === 0 ? <tr><td colSpan={5}><TableRowsSkeleton rows={5} columns={5} /></td></tr> : userRows.map((item) => <tr key={item.user_id} className="border-b border-border-default last:border-0">
                <td className="py-4 pr-4"><button onClick={() => void showUser(item)} className="flex items-center gap-3 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-success-fg">{initials(item.display_name || item.email)}</span><span><span className="block max-w-[220px] truncate text-[11px] font-bold text-fg">{item.display_name || 'Unnamed user'}</span><span className="mt-1 block max-w-[220px] truncate text-[9px] text-fg-muted">{item.email}</span></span></button></td>
                <td className="py-4 pr-4 text-[10px] font-semibold text-fg-secondary">{t('ui.' + item.role)}</td><td className="py-4 pr-4"><Status value={item.status} /></td><td className="py-4 pr-4 text-[10px] text-fg-secondary">{dateLabel(item.created_at, i18n.language)}</td>
                <td className="py-4 text-right"><button disabled={busyAction !== null || item.role === 'ADMIN' || item.user_id === user?.user_id} onClick={() => void toggleUser(item)} className="rounded-full border border-border-default px-3 py-2 text-[9px] font-bold text-fg-secondary hover:bg-surface-muted disabled:opacity-30">{busyAction === item.user_id && <Spinner size="sm" />}{item.status === 'ACTIVE' ? t('ui.Suspend') : t('ui.Activate')}</button></td>
              </tr>)}</tbody></table>
              {!loading && userRows.length === 0 && <p className="py-10 text-center text-[11px] text-fg-muted">{t("ui.No users match these filters.")}</p>}
            </div>
            <div className="flex items-center justify-between pt-4"><p className="text-[9px] text-fg-muted">{t('ui.{{count}} users found', { count: formatNumber(preview ? filteredPreviewUsers.length : users.total_elements, i18n.language) })}</p><div className="flex gap-2"><button disabled={userPage <= 0} onClick={() => setUserPage((v) => Math.max(0, v - 1))} className="rounded-full border border-border-default px-3 py-2 text-[9px] disabled:opacity-30">{t("ui.Previous")}</button><span className="px-2 py-2 text-[9px] text-fg-secondary">{formatNumber(userPage + 1, i18n.language)} / {formatNumber(Math.max(1, preview ? Math.ceil(filteredPreviewUsers.length / 10) : users.total_pages), i18n.language)}</span><button disabled={userPage + 1 >= (preview ? Math.ceil(filteredPreviewUsers.length / 10) : users.total_pages)} onClick={() => setUserPage((v) => v + 1)} className="rounded-full border border-border-default px-3 py-2 text-[9px] disabled:opacity-30">{t("ui.Next")}</button></div></div>
          </> : <>
            <div className="flex flex-wrap items-end justify-between gap-3 py-5"><div><p className={eyebrow}>{t("ui.Review queue")}</p><p className="mt-1 text-[11px] text-fg-secondary">{t("ui.Inspect applications and approve or reject pending coaches.")}</p></div><label className="w-full max-w-[190px]"><span className={eyebrow}>{t("ui.Application status")}</span><select className={field} value={coachStatus} onChange={(e) => { setCoachStatus(e.target.value as CoachApplicationStatus | ''); setCoachPage(0) }}><option value="">{t("ui.All applications")}</option><option value="PENDING">{t("ui.Pending")}</option><option value="APPROVED">{t("ui.Approved")}</option><option value="REJECTED">{t("ui.Rejected")}</option></select></label></div>
            {loading && coachRows.length === 0 ? <AdminApplicationGridSkeleton /> : <div className="grid gap-3 lg:grid-cols-2">{coachRows.map((item) => <article key={item.coach_id} className="rounded-[16px] border border-border-default bg-surface-subtle p-5">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-[11px] font-bold text-success-fg">{initials(item.display_name)}</span><div><h3 className="text-[13px] font-bold text-fg">{item.display_name}</h3><p className="mt-1 text-[10px] text-fg-muted">{item.headline || t('ui.Coach applicant')}</p></div></div><Status value={item.status || 'PENDING'} /></div>
              <p className="mt-4 line-clamp-2 text-[10px] leading-5 text-fg-secondary">{item.bio}</p><div className="mt-3 flex flex-wrap gap-1.5">{item.specialties.map((s) => <span key={s} className="rounded-full bg-surface-muted px-2.5 py-1 text-[8px] font-semibold text-fg-secondary">{s}</span>)}</div>
              <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4"><span className="text-[9px] text-fg-muted">{t('ui.{{count}} years experience', { count: formatNumber(item.experience_years, i18n.language) })} · {dateLabel(item.created_at, i18n.language)}</span><button onClick={() => void showCoach(item)} className="text-[9px] font-bold text-success-fg hover:underline">{t("ui.View application →")}</button></div>
              {item.status === 'PENDING' && <div className="mt-4 flex gap-2"><button disabled={busyAction !== null} onClick={() => void reviewCoach(item, 'approve')} className="h-9 flex-1 rounded-full bg-brand text-[9px] font-bold text-on-brand disabled:opacity-50">{busyAction === item.coach_id && <Spinner size="sm" />}{t('ui.Approve')}</button><button disabled={busyAction !== null} onClick={() => void reviewCoach(item, 'reject')} className="h-9 flex-1 rounded-full border border-danger-border bg-surface text-[9px] font-bold text-danger-fg disabled:opacity-50">{busyAction === item.coach_id && <Spinner size="sm" />}{t('ui.Reject')}</button></div>}
            </article>)}</div>}
            {!loading && coachRows.length === 0 && <p className="py-10 text-center text-[11px] text-fg-muted">{t("ui.No coach applications in this queue.")}</p>}
            {!preview && <div className="flex items-center justify-between pt-4"><p className="text-[9px] text-fg-muted">{t('ui.{{count}} applications', { count: formatNumber(coaches.total_elements, i18n.language) })}</p><div className="flex gap-2"><button disabled={coachPage <= 0} onClick={() => setCoachPage((v) => Math.max(0, v - 1))} className="rounded-full border border-border-default px-3 py-2 text-[9px] disabled:opacity-30">{t("ui.Previous")}</button><span className="px-2 py-2 text-[9px] text-fg-secondary">{formatNumber(coachPage + 1, i18n.language)} / {formatNumber(Math.max(1, coaches.total_pages), i18n.language)}</span><button disabled={coachPage + 1 >= coaches.total_pages} onClick={() => setCoachPage((v) => v + 1)} className="rounded-full border border-border-default px-3 py-2 text-[9px] disabled:opacity-30">{t("ui.Next")}</button></div></div>}
          </>}
          {error && <p role="alert" className="mt-4 rounded-xl border border-danger-border bg-danger-surface px-4 py-3 text-[10px] text-danger-fg">{error}</p>}
          {notice && <p role="status" className="mt-4 rounded-xl border border-success-border bg-success-surface px-4 py-3 text-[10px] text-success-fg">{notice}</p>}
        </section>

        {(selectedUser || selectedCoach || isDetailsLoading) && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-sidebar/45 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) closeDetails() }}>
          <section role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-[620px] overflow-y-auto rounded-[22px] border border-border-default bg-surface-subtle p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className={eyebrow}>{t(selectedUser ? 'ui.Account details' : 'ui.Coach application')}</p><h2 className="mt-2 text-[22px] font-bold text-fg">{isDetailsLoading ? <Spinner size="sm" /> : selectedUser?.display_name || selectedCoach?.display_name}</h2></div><button onClick={closeDetails} className="rounded-full border border-border-default px-3 py-2 text-[10px] font-bold text-fg-secondary">{t('ui.Close')}</button></div>
            {isDetailsLoading && <AdminDetailsSkeleton />}
            {!isDetailsLoading && selectedUser && <div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Email', selectedUser.email], ['Phone', selectedUser.phone || t('ui.Not provided')], ['Role', selectedUser.role], ['Status', selectedUser.status], ['User ID', selectedUser.user_id], ['Joined', dateLabel(selectedUser.created_at, i18n.language)]].map(([k, v]) => <div key={k} className="rounded-xl border border-border-default bg-surface p-4"><p className={eyebrow}>{t('ui.' + k)}</p><p className="mt-2 break-all text-[11px] font-semibold text-fg">{k === 'Role' || k === 'Status' ? t('ui.' + v) : v}</p></div>)}</div>}
            {!isDetailsLoading && selectedCoach && <div className="mt-6 space-y-4"><div className="flex items-center gap-2"><Status value={selectedCoach.status || 'PENDING'} /><span className="text-[10px] text-fg-muted">{t('ui.{{count}} years experience', { count: formatNumber(selectedCoach.experience_years, i18n.language) })}</span></div>{(selectedCoach.email || selectedCoach.phone) && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border-default bg-surface p-4"><p className={eyebrow}>{t('ui.Email address')}</p><p className="mt-2 break-all text-[11px] font-semibold text-fg">{selectedCoach.email || '—'}</p></div><div className="rounded-xl border border-border-default bg-surface p-4"><p className={eyebrow}>{t('ui.Phone number')}</p><p className="mt-2 text-[11px] font-semibold text-fg">{selectedCoach.phone || '—'}</p></div></div>}<div className="rounded-xl border border-border-default bg-surface p-4"><p className={eyebrow}>{t("ui.Professional headline")}</p><p className="mt-2 text-[12px] font-semibold text-fg">{selectedCoach.headline || '—'}</p><p className={eyebrow + ' mt-5'}>{t("ui.Biography")}</p><p className="mt-2 whitespace-pre-wrap text-[11px] leading-6 text-fg-secondary">{selectedCoach.bio}</p><p className={eyebrow + ' mt-5'}>{t("ui.Specialties")}</p><div className="mt-2 flex flex-wrap gap-2">{selectedCoach.specialties.map((s) => <span key={s} className="rounded-full bg-surface-muted px-3 py-1.5 text-[9px] text-fg-secondary">{s}</span>)}</div><p className={eyebrow + ' mt-5'}>{t("ui.Certifications")}</p>{(selectedCoach.certificates?.length ? selectedCoach.certificates : selectedCoach.certifications || []).map((c, index) => <div key={c.title + index} className="mt-3 rounded-lg border border-border-default p-3"><p className="text-[10px] font-semibold text-fg">{c.title}{c.category ? ' · ' + c.category : ''}</p>{c.issuer && <p className="mt-1 text-[9px] text-fg-muted">{c.issuer}</p>}{c.field_of_study && <p className="mt-1 text-[9px] text-fg-muted">{c.field_of_study}{c.degree ? ' · ' + c.degree : ''}</p>}{c.file_id && <p className="mt-1 break-all text-[9px] text-fg-muted">File ID: {c.file_id}</p>}</div>)}{selectedCoach.experiences?.length ? <><p className={eyebrow + ' mt-5'}>{t('ui.Work experience')}</p>{selectedCoach.experiences.map((experience, index) => <div key={experience.experience_id ?? index} className="mt-2 rounded-lg border border-border-default p-3"><p className="text-[10px] font-semibold text-fg">{experience.title}</p>{experience.organization && <p className="mt-1 text-[9px] text-fg-muted">{experience.organization}</p>}{experience.description && <p className="mt-2 text-[10px] leading-5 text-fg-secondary">{experience.description}</p>}{experience.duration_months != null && <p className="mt-1 text-[9px] text-fg-muted">{formatNumber(experience.duration_months, i18n.language)} months</p>}</div>)}</> : null}{selectedCoach.invitation_expires_at && <p className="mt-4 text-[10px] text-fg-muted">Invitation expires: {dateLabel(selectedCoach.invitation_expires_at, i18n.language)}</p>}{selectedCoach.rejection_reason && <p className="mt-4 rounded-lg bg-danger-surface p-3 text-[10px] text-danger-fg">{t('ui.Rejection reason:')} {selectedCoach.rejection_reason}</p>}</div>
              {selectedCoach.status === 'PENDING' && <div className="flex gap-2"><button disabled={busyAction !== null} onClick={() => void reviewCoach(selectedCoach, 'approve')} className="h-10 flex-1 rounded-full bg-brand text-[10px] font-bold text-on-brand">{busyAction === selectedCoach.coach_id && <Spinner size="sm" />}{t('ui.Approve')}</button><button disabled={busyAction !== null} onClick={() => void reviewCoach(selectedCoach, 'reject')} className="h-10 flex-1 rounded-full border border-danger-border text-[10px] font-bold text-danger-fg">{busyAction === selectedCoach.coach_id && <Spinner size="sm" />}{t('ui.Reject')}</button></div>}</div>}
          </section>
        </div>}
      </div>
    </AppShell>
  )
}
export default AdminDashboardPage
