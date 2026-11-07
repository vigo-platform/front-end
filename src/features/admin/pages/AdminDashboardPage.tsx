import { useEffect, useMemo, useState } from 'react'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { adminService } from '../services/admin.service'
import { makePreviewPage, previewAdminUsers, previewCoachApplications } from '../data/admin.mock'
import type { AdminCoachApplication, AdminPage, AdminUser, CoachApplicationStatus } from '../types/admin.types'
import type { UserRole, UserStatus } from '../../user/types/user.types'

type Tab = 'users' | 'coaches'
const field = 'mt-2 h-11 w-full rounded-xl border border-[#e2e3dc] bg-[#fbfbf9] px-3.5 text-[11px] text-[#24251f] outline-none focus:border-[#a8c76d] focus:bg-white'
const eyebrow = 'text-[9px] font-bold uppercase tracking-[1px] text-[#85867d]'
function dateLabel(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
function initials(value?: string) { return (value || 'Vigo').split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') }
function Status({ value }: { value: string }) {
  const style = value === 'ACTIVE' || value === 'APPROVED' ? 'bg-[#eff6e5] text-[#597333]' : value === 'SUSPENDED' || value === 'REJECTED' ? 'bg-[#fff0ec] text-[#a55343]' : 'bg-[#fff6df] text-[#92702c]'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.8px] ${style}`}>{value}</span>
}

function AdminDashboardPage() {
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
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const filteredPreviewUsers = useMemo(() => previewUsers.filter((item) => {
    const search = q.trim().toLowerCase()
    return (!search || item.display_name?.toLowerCase().includes(search) || item.email.toLowerCase().includes(search))
      && (!role || item.role === role) && (!status || item.status === status)
  }), [previewUsers, q, role, status])
  const filteredPreviewCoaches = previewCoaches.filter((item) => !coachStatus || item.status === coachStatus)

  useEffect(() => {
    if (preview || !accessToken || tab !== 'users') return
    let active = true
    setLoading(true); setError('')
    adminService.listUsers(accessToken, { page: userPage, size: 10, role, status, q })
      .then((data) => { if (active) setUsers(data) })
      .catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : 'Could not load users.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, preview, tab, userPage, role, status, q])

  useEffect(() => {
    if (preview || !accessToken || tab !== 'coaches') return
    let active = true
    setLoading(true); setError('')
    adminService.listCoachApplications(accessToken, { page: coachPage, size: 10, status: coachStatus })
      .then((data) => { if (active) setCoaches(data) })
      .catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : 'Could not load applications.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, preview, tab, coachPage, coachStatus])

  async function showUser(item: AdminUser) {
    setSelectedCoach(null); setError('')
    if (preview || !accessToken) { setSelectedUser(item); return }
    try { setLoading(true); setSelectedUser(await adminService.getUser(accessToken, item.user_id)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load user details.') }
    finally { setLoading(false) }
  }
  async function showCoach(item: AdminCoachApplication) {
    setSelectedUser(null); setError('')
    if (preview || !accessToken) { setSelectedCoach(item); return }
    try { setLoading(true); setSelectedCoach(await adminService.getCoachApplication(accessToken, item.coach_id)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load application details.') }
    finally { setLoading(false) }
  }
  async function toggleUser(item: AdminUser) {
    const next: UserStatus = item.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    if (item.role === 'ADMIN' || item.user_id === user?.user_id) return
    const reason = next === 'SUSPENDED' ? window.prompt('Reason for suspension (optional):') : undefined
    if (reason === null || !window.confirm(`Change this account status to ${next}?`)) return
    setBusy(true); setError(''); setNotice('')
    try {
      const updated = preview ? { ...item, status: next } : await adminService.setUserStatus(accessToken!, item.user_id, { status: next, ...(reason?.trim() ? { reason: reason.trim() } : {}) })
      setPreviewUsers((current) => current.map((entry) => entry.user_id === updated.user_id ? updated : entry))
      setUsers((current) => ({ ...current, content: current.content.map((entry) => entry.user_id === updated.user_id ? updated : entry) }))
      setSelectedUser(updated); setNotice(`Account status changed to ${next}.`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update account.') }
    finally { setBusy(false) }
  }
  async function reviewCoach(item: AdminCoachApplication, action: 'approve' | 'reject') {
    let reason = ''
    if (action === 'reject') {
      const answer = window.prompt('Rejection reason (5–500 characters):')
      if (answer === null) return
      reason = answer.trim()
      if (reason.length < 5 || reason.length > 500) { setError('The reason must contain 5–500 characters.'); return }
    }
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return
    setBusy(true); setError(''); setNotice('')
    try {
      const updated = preview
        ? { ...item, status: action === 'approve' ? 'APPROVED' as const : 'REJECTED' as const, rejection_reason: action === 'reject' ? reason : null }
        : action === 'approve' ? await adminService.approveCoach(accessToken!, item.coach_id) : await adminService.rejectCoach(accessToken!, item.coach_id, reason)
      setPreviewCoaches((current) => current.map((entry) => entry.coach_id === updated.coach_id ? updated : entry))
      setCoaches((current) => ({ ...current, content: current.content.map((entry) => entry.coach_id === updated.coach_id ? updated : entry) }))
      setSelectedCoach(updated); setNotice(`Application ${action === 'approve' ? 'approved' : 'rejected'}.`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not review application.') }
    finally { setBusy(false) }
  }

  const totalUsers = preview ? previewUsers.length : users.total_elements
  const pending = preview ? previewCoaches.filter((item) => item.status === 'PENDING').length : coaches.content.filter((item) => item.status === 'PENDING').length
  const userRows = preview ? makePreviewPage(filteredPreviewUsers, userPage).content : users.content
  const coachRows = preview ? filteredPreviewCoaches : coaches.content
  const closeDetails = () => { setSelectedUser(null); setSelectedCoach(null) }

  return (
    <AppShell title="Admin overview">
      <div className="mx-auto w-full max-w-[1320px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">Administration</p><h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-1.5px] text-[#171815] sm:text-[42px]">Good to see you, {(user?.display_name || 'Admin').split(/\s+/)[0]}.</h1><p className="mt-2 text-[12px] leading-6 text-[#77786f]">Manage platform accounts and review coach applications.</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dce8c8] bg-[#f2f8e8] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-[#526a2e]"><span className="h-1.5 w-1.5 rounded-full bg-[#9bcf43]" />Administrator</span>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5"><p className={eyebrow}>Platform users</p><p className="mt-4 text-[30px] font-bold text-[#20211d]">{totalUsers}</p><p className="mt-1 text-[10px] text-[#898a81]">Accounts in the platform</p></article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5"><p className={eyebrow}>Pending applications</p><p className="mt-4 text-[30px] font-bold text-[#20211d]">{pending}</p><p className="mt-1 text-[10px] text-[#898a81]">Waiting for your review</p></article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5"><p className={eyebrow}>Your account</p><p className="mt-4 text-[22px] font-bold text-[#20211d]">{user?.status ?? 'ACTIVE'}</p><p className="mt-1 text-[10px] text-[#898a81]">Administrator access</p></article>
        </section>

        <section className="rounded-[20px] border border-[#e1e1da] bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edede8] pb-4">
            <div><p className={eyebrow}>Workspace</p><h2 className="mt-1 text-[19px] font-bold text-[#20211d]">Platform management</h2></div>
            <div className="flex rounded-full bg-[#f1f1ec] p-1">
              <button onClick={() => { setTab('users'); closeDetails(); setNotice(''); setError('') }} className={`rounded-full px-4 py-2 text-[10px] font-bold ${tab === 'users' ? 'bg-[#c7f36b] text-[#171914]' : 'text-[#77786f]'}`}>Users</button>
              <button onClick={() => { setTab('coaches'); closeDetails(); setNotice(''); setError('') }} className={`rounded-full px-4 py-2 text-[10px] font-bold ${tab === 'coaches' ? 'bg-[#c7f36b] text-[#171914]' : 'text-[#77786f]'}`}>Coach applications</button>
            </div>
          </div>

          {tab === 'users' ? <>
            <div className="grid gap-3 py-5 md:grid-cols-[minmax(220px,1fr)_170px_170px]">
              <label><span className={eyebrow}>Search users</span><input className={field} value={q} onChange={(e) => { setQ(e.target.value); setUserPage(0) }} placeholder="Search by name or email" /></label>
              <label><span className={eyebrow}>Role</span><select className={field} value={role} onChange={(e) => { setRole(e.target.value as UserRole | ''); setUserPage(0) }}><option value="">All roles</option><option value="ATHLETE">Athlete</option><option value="COACH">Coach</option><option value="ADMIN">Admin</option></select></label>
              <label><span className={eyebrow}>Account status</span><select className={field} value={status} onChange={(e) => { setStatus(e.target.value as UserStatus | ''); setUserPage(0) }}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option></select></label>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left">
              <thead><tr className="border-y border-[#edede8] text-[8px] font-bold uppercase tracking-[1px] text-[#92938a]"><th className="py-3 pr-4">User</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Joined</th><th className="py-3 text-right">Action</th></tr></thead>
              <tbody>{userRows.map((item) => <tr key={item.user_id} className="border-b border-[#f0f0eb] last:border-0">
                <td className="py-4 pr-4"><button onClick={() => void showUser(item)} className="flex items-center gap-3 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf1e6] text-[10px] font-bold text-[#526a2e]">{initials(item.display_name || item.email)}</span><span><span className="block max-w-[220px] truncate text-[11px] font-bold text-[#292a25]">{item.display_name || 'Unnamed user'}</span><span className="mt-1 block max-w-[220px] truncate text-[9px] text-[#92938a]">{item.email}</span></span></button></td>
                <td className="py-4 pr-4 text-[10px] font-semibold text-[#55564f]">{item.role}</td><td className="py-4 pr-4"><Status value={item.status} /></td><td className="py-4 pr-4 text-[10px] text-[#77786f]">{dateLabel(item.created_at)}</td>
                <td className="py-4 text-right"><button disabled={busy || item.role === 'ADMIN' || item.user_id === user?.user_id} onClick={() => void toggleUser(item)} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[9px] font-bold text-[#55564f] hover:bg-[#f5f8ef] disabled:opacity-30">{item.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</button></td>
              </tr>)}</tbody></table>
              {!loading && userRows.length === 0 && <p className="py-10 text-center text-[11px] text-[#92938a]">No users match these filters.</p>}
            </div>
            <div className="flex items-center justify-between pt-4"><p className="text-[9px] text-[#92938a]">{preview ? filteredPreviewUsers.length : users.total_elements} users found</p><div className="flex gap-2"><button disabled={userPage <= 0} onClick={() => setUserPage((v) => Math.max(0, v - 1))} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[9px] disabled:opacity-30">Previous</button><span className="px-2 py-2 text-[9px] text-[#77786f]">{userPage + 1} / {Math.max(1, preview ? Math.ceil(filteredPreviewUsers.length / 10) : users.total_pages)}</span><button disabled={userPage + 1 >= (preview ? Math.ceil(filteredPreviewUsers.length / 10) : users.total_pages)} onClick={() => setUserPage((v) => v + 1)} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[9px] disabled:opacity-30">Next</button></div></div>
          </> : <>
            <div className="flex flex-wrap items-end justify-between gap-3 py-5"><div><p className={eyebrow}>Review queue</p><p className="mt-1 text-[11px] text-[#77786f]">Inspect applications and approve or reject pending coaches.</p></div><label className="w-full max-w-[190px]"><span className={eyebrow}>Application status</span><select className={field} value={coachStatus} onChange={(e) => { setCoachStatus(e.target.value as CoachApplicationStatus | ''); setCoachPage(0) }}><option value="">All applications</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label></div>
            <div className="grid gap-3 lg:grid-cols-2">{coachRows.map((item) => <article key={item.coach_id} className="rounded-[16px] border border-[#e8e8e1] bg-[#fcfcfa] p-5">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf0df] text-[11px] font-bold text-[#526a2e]">{initials(item.display_name)}</span><div><h3 className="text-[13px] font-bold text-[#292a25]">{item.display_name}</h3><p className="mt-1 text-[10px] text-[#85867d]">{item.headline || 'Coach applicant'}</p></div></div><Status value={item.status || 'PENDING'} /></div>
              <p className="mt-4 line-clamp-2 text-[10px] leading-5 text-[#77786f]">{item.bio}</p><div className="mt-3 flex flex-wrap gap-1.5">{item.specialties.map((s) => <span key={s} className="rounded-full bg-[#f0f1eb] px-2.5 py-1 text-[8px] font-semibold text-[#65665e]">{s}</span>)}</div>
              <div className="mt-4 flex items-center justify-between border-t border-[#edede8] pt-4"><span className="text-[9px] text-[#92938a]">{item.experience_years} years · {dateLabel(item.created_at)}</span><button onClick={() => void showCoach(item)} className="text-[9px] font-bold text-[#526a2e] hover:underline">View application →</button></div>
              {item.status === 'PENDING' && <div className="mt-4 flex gap-2"><button disabled={busy} onClick={() => void reviewCoach(item, 'approve')} className="h-9 flex-1 rounded-full bg-[#c7f36b] text-[9px] font-bold text-[#171914] disabled:opacity-50">Approve</button><button disabled={busy} onClick={() => void reviewCoach(item, 'reject')} className="h-9 flex-1 rounded-full border border-[#e5d3cd] bg-white text-[9px] font-bold text-[#a55343] disabled:opacity-50">Reject</button></div>}
            </article>)}</div>
            {!loading && coachRows.length === 0 && <p className="py-10 text-center text-[11px] text-[#92938a]">No coach applications in this queue.</p>}
            {!preview && <div className="flex items-center justify-between pt-4"><p className="text-[9px] text-[#92938a]">{coaches.total_elements} applications</p><div className="flex gap-2"><button disabled={coachPage <= 0} onClick={() => setCoachPage((v) => Math.max(0, v - 1))} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[9px] disabled:opacity-30">Previous</button><span className="px-2 py-2 text-[9px] text-[#77786f]">{coachPage + 1} / {Math.max(1, coaches.total_pages)}</span><button disabled={coachPage + 1 >= coaches.total_pages} onClick={() => setCoachPage((v) => v + 1)} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[9px] disabled:opacity-30">Next</button></div></div>}
          </>}
          {loading && <p className="mt-4 text-[10px] text-[#85867d]">Loading data…</p>}
          {error && <p role="alert" className="mt-4 rounded-xl border border-[#f0d2cb] bg-[#fff6f3] px-4 py-3 text-[10px] text-[#a34d3d]">{error}</p>}
          {notice && <p role="status" className="mt-4 rounded-xl border border-[#dce8c8] bg-[#f2f8e8] px-4 py-3 text-[10px] text-[#526a2e]">{notice}</p>}
        </section>

        {(selectedUser || selectedCoach) && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#111210]/45 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) closeDetails() }}>
          <section role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-[620px] overflow-y-auto rounded-[22px] border border-[#e1e1da] bg-[#fbfbf9] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className={eyebrow}>{selectedUser ? 'Account details' : 'Coach application'}</p><h2 className="mt-2 text-[22px] font-bold text-[#20211d]">{selectedUser?.display_name || selectedCoach?.display_name}</h2></div><button onClick={closeDetails} className="rounded-full border border-[#e2e3dc] px-3 py-2 text-[10px] font-bold text-[#77786f]">Close</button></div>
            {selectedUser && <div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Email', selectedUser.email], ['Phone', selectedUser.phone || 'Not provided'], ['Role', selectedUser.role], ['Status', selectedUser.status], ['User ID', selectedUser.user_id], ['Joined', dateLabel(selectedUser.created_at)]].map(([k, v]) => <div key={k} className="rounded-xl border border-[#e8e8e1] bg-white p-4"><p className={eyebrow}>{k}</p><p className="mt-2 break-all text-[11px] font-semibold text-[#34352f]">{v}</p></div>)}</div>}
            {selectedCoach && <div className="mt-6 space-y-4"><div className="flex items-center gap-2"><Status value={selectedCoach.status || 'PENDING'} /><span className="text-[10px] text-[#85867d]">{selectedCoach.experience_years} years experience</span></div><div className="rounded-xl border border-[#e8e8e1] bg-white p-4"><p className={eyebrow}>Professional headline</p><p className="mt-2 text-[12px] font-semibold text-[#34352f]">{selectedCoach.headline || '—'}</p><p className={eyebrow + ' mt-5'}>Biography</p><p className="mt-2 whitespace-pre-wrap text-[11px] leading-6 text-[#66675f]">{selectedCoach.bio}</p><p className={eyebrow + ' mt-5'}>Specialties</p><div className="mt-2 flex flex-wrap gap-2">{selectedCoach.specialties.map((s) => <span key={s} className="rounded-full bg-[#f0f1eb] px-3 py-1.5 text-[9px] text-[#65665e]">{s}</span>)}</div><p className={eyebrow + ' mt-5'}>Certifications</p>{(selectedCoach.certifications || []).map((c) => <p key={c.title} className="mt-2 text-[10px] text-[#55564f]">{c.title}{c.issuer ? ' · ' + c.issuer : ''}{c.year ? ' · ' + c.year : ''}</p>)}{selectedCoach.rejection_reason && <p className="mt-4 rounded-lg bg-[#fff0ec] p-3 text-[10px] text-[#a55343]">Rejection reason: {selectedCoach.rejection_reason}</p>}</div>
              {selectedCoach.status === 'PENDING' && <div className="flex gap-2"><button disabled={busy} onClick={() => void reviewCoach(selectedCoach, 'approve')} className="h-10 flex-1 rounded-full bg-[#c7f36b] text-[10px] font-bold text-[#171914]">Approve</button><button disabled={busy} onClick={() => void reviewCoach(selectedCoach, 'reject')} className="h-10 flex-1 rounded-full border border-[#e5d3cd] text-[10px] font-bold text-[#a55343]">Reject</button></div>}</div>}
          </section>
        </div>}
      </div>
    </AppShell>
  )
}
export default AdminDashboardPage
