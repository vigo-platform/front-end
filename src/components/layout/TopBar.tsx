interface TopBarProps {
  title: string
}

function TopBar({ title }: TopBarProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted">English</span>
      </div>
    </header>
  )
}

export default TopBar