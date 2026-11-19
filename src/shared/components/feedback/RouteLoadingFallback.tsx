import Skeleton from './Skeleton'

/**
 * Shared fallback shown while a route's JavaScript chunk is downloaded.
 * Keep this lightweight so the fallback itself does not pull in page features.
 */
function RouteLoadingFallback() {
  return (
    <main
      aria-label="Loading page"
      aria-busy="true"
      className="min-h-screen bg-canvas px-5 py-8 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1320px] space-y-8">
        <header className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </header>

        <section className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-5 h-8 w-1/3" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          ))}
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </section>
      </div>
    </main>
  )
}

export default RouteLoadingFallback
