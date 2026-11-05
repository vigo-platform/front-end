import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Workouts', href: '/workouts' },
  { label: 'Discover Coaches', href: '/coaches' },
]

function Sidebar() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white px-5 py-6">
      <div className="mb-12">
        <span className="text-2xl font-bold tracking-tight">Vigo</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <Link key={item.label} to={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-soft-gray hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-5">
        {user && <p className="mb-3 truncate text-xs text-muted">{user.display_name || user.email}</p>}
        <button type="button" onClick={handleLogout} className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-ink hover:bg-soft-gray">
          Log out
        </button>
        <p className="mt-4 text-xs text-muted">Vigo MVP</p>
      </div>
    </aside>
  )
}
export default Sidebar
