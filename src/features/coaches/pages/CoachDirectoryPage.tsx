import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { useAuth } from '../../auth/context/auth-context'
import { getAvatarUrl } from '../utils/avatar'
import { coachService } from '../services/coach.service'
import type { CoachPage, CoachSearchParams, CoachSort } from '../types/coach.types'

const pageSize = 12

function formatToman(value: number) {
  return new Intl.NumberFormat('en-US').format(value) + ' Toman'
}


function CoachDirectoryPage() {
  const { isPreview } = useAuth()
  const coachesPath = isPreview ? '/_preview/athlete/coaches' : '/coaches'
  const [page, setPage] = useState<CoachPage | null>(null)
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<CoachSort>('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    coachService.search({ page: 0, size: pageSize, sort: 'newest' })
      .then((result) => {
        if (isActive) setPage(result)
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load coaches.')
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function loadPage(params: CoachSearchParams) {
    setIsLoading(true)
    setError('')

    try {
      const result = await coachService.search(params)
      setPage(result)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load coaches.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params: CoachSearchParams = {
      page: 0,
      size: pageSize,
      sort,
    }

    if (search.trim()) params.q = search.trim()
    if (specialty.trim()) params.specialty = specialty.trim()
    if (minPrice !== '') params.min_price = Number(minPrice)
    if (maxPrice !== '') params.max_price = Number(maxPrice)

    void loadPage(params)
  }

  function changePage(nextPage: number) {
    const params: CoachSearchParams = {
      page: nextPage,
      size: pageSize,
      sort,
    }

    if (search.trim()) params.q = search.trim()
    if (specialty.trim()) params.specialty = specialty.trim()
    if (minPrice !== '') params.min_price = Number(minPrice)
    if (maxPrice !== '') params.max_price = Number(maxPrice)

    void loadPage(params)
  }

  return (
    <CoachPublicLayout title="Discover coaches">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[1.7px] text-[#718d43]">Find your coach</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Discover coaches</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Explore approved coach profiles, compare their specialties, and find a coaching style that fits your goals.
          </p>
        </section>

        <form onSubmit={handleSearch} className="grid gap-3 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className="sm:col-span-2 lg:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-muted">Name or keyword</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              maxLength={100}
              placeholder="Search coaches"
              className="h-11 w-full rounded-xl border border-border bg-canvas px-3 text-sm outline-none focus:border-[#8da85d]"
            />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-muted">Specialty</span>
            <input
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              maxLength={40}
              placeholder="e.g. Strength"
              className="h-11 w-full rounded-xl border border-border bg-canvas px-3 text-sm outline-none focus:border-[#8da85d]"
            />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-muted">Min. price (Toman)</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-canvas px-3 text-sm outline-none focus:border-[#8da85d]"
            />
          </label>
          <label>
            <span className="mb-2 block text-xs font-semibold text-muted">Max. price (Toman)</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-canvas px-3 text-sm outline-none focus:border-[#8da85d]"
            />
          </label>
          <div className="flex items-end">
            <button type="submit" className="h-11 w-full rounded-xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-[#30352a]">
              Search
            </button>
          </div>
          <label className="sm:col-span-2 lg:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-muted">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as CoachSort)}
              className="h-11 w-full rounded-xl border border-border bg-canvas px-3 text-sm outline-none focus:border-[#8da85d]"
            >
              <option value="newest">Newest</option>
              <option value="experience">Experience</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </label>
        </form>

        {error && (
          <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">Could not load coaches</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => changePage(page?.page ?? 0)}
              className="mt-3 text-sm font-semibold text-red-800 underline"
            >
              Try again
            </button>
          </section>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center text-sm text-muted" aria-live="polite">
            Loading coaches...
          </div>
        ) : !error && page?.content.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <h2 className="font-semibold">No coaches found</h2>
            <p className="mt-2 text-sm text-muted">Try changing your search terms or filters.</p>
          </div>
        ) : !error && page ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted">
                {new Intl.NumberFormat('en-US').format(page.total_elements)} coaches found
              </p>
              <p className="text-xs text-muted">Only approved and active coaches are listed.</p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {page.content.map((coach) => {
                const avatarUrl = getAvatarUrl(coach.avatar_url)

                return (
                  <article key={coach.coach_id} className="flex min-h-64 flex-col rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                      ) : (
                        <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eff5e5] text-xl font-bold text-[#607b38]">
                          {coach.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-semibold">{coach.display_name}</h2>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                          {coach.headline || coach.specialties.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted">{coach.bio}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {coach.specialties.slice(0, 3).map((item) => (
                        <span key={item} className="rounded-full bg-[#f0f5e8] px-3 py-1 text-[11px] font-semibold text-[#607b38]">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4">
                      <div>
                        <p className="text-[11px] text-muted">Experience</p>
                        <p className="mt-1 text-sm font-semibold">{coach.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted">Starting from</p>
                        <p className="mt-1 text-sm font-semibold">
                          {coach.min_plan_price == null ? 'Not listed' : formatToman(coach.min_plan_price)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={coachesPath + '/' + coach.coach_id}
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-ink px-4 text-xs font-semibold text-white transition hover:bg-[#30352a]"
                    >
                      View profile
                    </Link>
                  </article>
                )
              })}
            </section>

            {page.total_pages > 1 && (
              <nav aria-label="Coach directory pages" className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  disabled={page.page <= 0 || isLoading}
                  onClick={() => changePage(page.page - 1)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page.page + 1} of {page.total_pages}
                </span>
                <button
                  type="button"
                  disabled={page.page + 1 >= page.total_pages || isLoading}
                  onClick={() => changePage(page.page + 1)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        ) : null}
      </div>
    </CoachPublicLayout>
  )
}

export default CoachDirectoryPage
