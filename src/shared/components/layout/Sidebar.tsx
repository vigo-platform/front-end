import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../features/auth/context/auth-context'
import { getNavigationItems } from '../../../app/config/navigation'

function Sidebar() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const navigationItems = getNavigationItems(user?.role)

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col md:flex border-r border-border bg-white px-5 py-6">
      <div className="mb-12">
        <Link to="/" className="text-2xl font-bold tracking-tight">Vigo</Link>
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
