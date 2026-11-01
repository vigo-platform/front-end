const navigationItems = [
  { label: 'Dashboard', href: '/', active: true },
  { label: 'My Workouts', href: '/workouts', active: false },
  { label: 'Discover Coaches', href: '/coaches', active: false },
]

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-white px-5 py-6">
      <div className="mb-12">
        <span className="text-2xl font-bold tracking-tight">Vigo</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              item.active
                ? 'bg-accent text-ink'
                : 'text-muted hover:bg-soft-gray hover:text-ink'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-5">
        <p className="text-xs text-muted">Vigo MVP</p>
      </div>
    </aside>
  )
}

export default Sidebar