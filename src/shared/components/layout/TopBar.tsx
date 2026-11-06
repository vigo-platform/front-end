import { useAuth } from '../../../features/auth/context/auth-context'

interface TopBarProps {
  title: string
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function TopBar({ title }: TopBarProps) {
  const { user } = useAuth()
  const displayName = user?.display_name || user?.email || 'Vigo member'
  const initials = getInitials(user?.display_name || user?.email || 'V')

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#e8e8e1] bg-[#fbfbf9] px-5 sm:px-8 lg:px-10">
      <div className="min-w-0">
        <p className="text-[9px] font-medium uppercase tracking-[1.5px] text-[#96968e]">
          Workspace <span className="px-1.5 text-[#c5c5bc]">/</span> {title}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-[10px] font-semibold text-[#292a25]">{displayName}</p>
          <p className="mt-0.5 text-[9px] text-[#92928a]">{user?.role === 'COACH' ? 'Coach account' : 'Athlete account'}</p>
        </div>
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full border border-[#e6e6df] object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9e9e2] text-[9px] font-bold text-[#44453e]">
            {initials || 'V'}
          </span>
        )}
      </div>
    </header>
  )
}

export default TopBar
