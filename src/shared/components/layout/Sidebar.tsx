import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../features/auth/context/auth-context'
import { getNavigationItems } from '../../../app/config/navigation'

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function Sidebar() {
  const { signOut, user, isPreview } = useAuth()
  const navigate = useNavigate()
  const navigationItems = getNavigationItems(user?.role, isPreview)
  const workspacePath = isPreview ? `/_preview/${user?.role === 'COACH' ? 'coach' : 'athlete'}` : '/dashboard'
  const displayName = user?.display_name || user?.email || 'Vigo member'
  const initials = getInitials(user?.display_name || user?.email || 'V')

  async function handleLogout() {
    if (isPreview) {
      navigate(workspacePath, { replace: true })
      return
    }
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden min-h-screen w-[252px] shrink-0 flex-col bg-[#111210] px-5 py-7 text-white md:sticky md:top-0 md:flex md:h-screen">
      <Link to={isPreview ? workspacePath : '/'} className="inline-flex w-fit items-center gap-2 px-1 text-[25px] font-bold tracking-[-1.2px]">
        Vigo
        <span className="mt-1 h-2 w-2 rounded-full bg-[#c7f36b]" />
      </Link>

      <div className="mt-8 border-b border-white/10 pb-6">
        <p className="px-1 text-[9px] font-semibold uppercase tracking-[1.8px] text-white/40">
          {user?.role === 'COACH' ? 'Coach workspace' : user?.role === 'ATHLETE' ? 'Athlete workspace' : 'Member workspace'}
        </p>
      </div>

      <nav aria-label="Main navigation" className="mt-5 flex flex-col gap-1.5">
        {navigationItems.map((item, index) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/athlete' || item.href === '/coach' || item.href === '/_preview/athlete' || item.href === '/_preview/coach' || item.href.endsWith('/workouts')}
            className={({ isActive }) =>
              [
                'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[12px] font-semibold transition-colors',
                isActive
                  ? 'bg-[#c7f36b] text-[#171914]'
                  : 'text-white/60 hover:bg-white/[0.07] hover:text-white',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-bold ${isActive ? 'bg-black/[0.08]' : 'bg-white/[0.09] text-white/55'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#171914]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <div className="flex min-w-0 items-center gap-3 px-1">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white">
              {initials || 'V'}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-white">{displayName}</p>
            <p className="mt-0.5 text-[10px] capitalize text-white/40">
              {user?.role?.toLowerCase() || 'Member'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[11px] font-medium text-white/45 transition hover:bg-white/[0.06] hover:text-white"
        >
          {isPreview ? 'Back to overview' : 'Sign out'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
