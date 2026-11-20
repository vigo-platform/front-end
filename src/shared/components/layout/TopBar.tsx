import { useAuth } from '../../../features/auth/context/auth-context'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const displayName = user?.display_name || user?.email || t('workspace.memberName')
  const initials = getInitials(user?.display_name || user?.email || 'V')
  const roleLabel = user?.role === 'ADMIN'
    ? t('workspace.administrator')
    : user?.role === 'COACH'
      ? t('workspace.coachAccount')
      : user?.role === 'ATHLETE'
        ? t('workspace.athleteAccount')
        : t('workspace.account')

  return (
    <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-4 border-b border-border-default bg-surface-subtle px-5 py-3 sm:px-8 lg:px-10">
      <div className="min-w-0">
        <p className="text-[9px] font-medium uppercase tracking-[1.5px] text-fg-muted">
          {t('workspace.title')} <span className="px-1.5 text-fg-muted">/</span> {t(title)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-[10px] font-semibold text-fg">{displayName}</p>
          <p className="mt-0.5 text-[9px] text-fg-muted">{roleLabel}</p>
        </div>
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full border border-border-default object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-[9px] font-bold text-fg-secondary">
            {initials || 'V'}
          </span>
        )}
      </div>
    </header>
  )
}

export default TopBar
