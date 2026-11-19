import Skeleton from './Skeleton'

export function CoachCardSkeleton() {
  return (
    <article className="min-h-64 rounded-2xl border border-border bg-white p-5" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-full" />
    </article>
  )
}

export function CoachDirectorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <section
      aria-label="Loading coach directory"
      aria-busy="true"
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => <CoachCardSkeleton key={index} />)}
    </section>
  )
}

export function CoachProfileSkeleton() {
  return (
    <div aria-label="Loading coach profile" aria-busy="true" className="space-y-6">
      <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 shrink-0 rounded-3xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <Skeleton className="h-5 w-24" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </section>
    </div>
  )
}

export function DashboardStatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-label="Loading dashboard statistics" aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-[18px] border border-border bg-white p-5 sm:p-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-5 h-9 w-20" />
          <Skeleton className="mt-2 h-3 w-36" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSectionSkeleton() {
  return (
    <div aria-label="Loading profile details" aria-busy="true" className="mt-6 grid gap-5">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function TableRowsSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div aria-label="Loading table rows" aria-busy="true" className="space-y-4 py-4">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4 border-b border-border pb-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} className={`h-4 ${column === 0 ? 'w-4/5' : 'w-3/5'}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function AuthOptionsSkeleton() {
  return (
    <div aria-label="Loading sign-in options" aria-busy="true" className="space-y-3">
      <Skeleton className="h-3 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  )
}
