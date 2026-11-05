import { useState } from 'react'
import { Link } from 'react-router-dom'

const navigation = [
  { label: 'Product', href: '#product' },
  { label: 'For athletes', href: '#athletes' },
  { label: 'For coaches', href: '#coaches' },
  { label: 'How it works', href: '#how-it-works' },
]

const features = [
  {
    number: '01',
    title: 'Find the right coach',
    description:
      'Explore coach profiles, compare their specialties, and start a coaching relationship that fits your goals.',
    tag: 'Coach discovery',
  },
  {
    number: '02',
    title: 'Build structured workouts',
    description:
      'Coaches can organize training with sections, rounds, exercises, and sets in one clear workout builder.',
    tag: 'Workout builder',
  },
  {
    number: '03',
    title: 'Keep training connected',
    description:
      'Athletes follow their assigned workouts and record what they actually completed.',
    tag: 'Workout execution',
  },
  {
    number: '04',
    title: 'Review and give feedback',
    description:
      'Bring planned exercises and completed results into the same coaching workflow.',
    tag: 'Training feedback',
  },
]

const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Athletes explore coach profiles and find a training partner who matches their needs.',
  },
  {
    number: '02',
    title: 'Plan',
    description:
      'Coaches create structured workouts and share them with the athletes they work with.',
  },
  {
    number: '03',
    title: 'Train',
    description:
      'Athletes follow the plan, record their results, and keep the training process organized.',
  },
]

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      {diagonal ? (
        <path
          d="M5 15 15 5M6 5h9v9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3.5 10h12m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function BrandMark() {
  return (
    <Link to="/" aria-label="Vigo home" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-accent">
        <svg aria-hidden="true" viewBox="0 0 28 28" className="h-6 w-6" fill="none">
          <path
            d="m5 7 6.2 14h2.1L19.5 7h-3.3l-4 9.2L8.3 7H5Z"
            fill="currentColor"
          />
          <path
            d="M18.5 18.8 22 11h-3.2l-3.4 7.8h3.1Z"
            fill="currentColor"
            opacity=".65"
          />
        </svg>
      </span>
      <span className="text-[19px] font-extrabold tracking-[-1px] text-ink">
        vigo<span className="text-[#9bcf3f]">.</span>
      </span>
    </Link>
  )
}

function WorkoutPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -right-7 -top-7 h-36 w-36 rounded-full bg-accent/50 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#d9e8c1] blur-3xl" />

      <div className="relative rounded-[28px] border border-white/80 bg-white p-4 shadow-[0_28px_90px_rgba(24,32,15,0.13)] sm:p-6">
        <div className="flex items-center justify-between border-b border-[#eeeee9] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff5e5] text-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[12px] font-bold text-ink">Training overview</p>
              <p className="mt-0.5 text-[10px] text-muted">Your week, in one place</p>
            </div>
          </div>
          <span className="rounded-full bg-[#f4f5f0] px-3 py-1.5 text-[10px] font-semibold text-[#66685f]">
            WEEKLY PLAN
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 py-5">
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-[10px] text-muted">Sessions</p>
            <p className="mt-1 text-[23px] font-bold tracking-tight text-ink">04</p>
          </div>
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-[10px] text-muted">Completed</p>
            <p className="mt-1 text-[23px] font-bold tracking-tight text-ink">02</p>
          </div>
          <div className="rounded-2xl bg-canvas p-3">
            <p className="text-[10px] text-muted">Up next</p>
            <p className="mt-1 text-[17px] font-bold tracking-tight text-ink">Today</p>
          </div>
        </div>

        <div className="flex items-center justify-between pb-3">
          <p className="text-[12px] font-bold text-ink">Your workouts</p>
          <span className="text-[10px] font-medium text-muted">THIS WEEK</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e9ebdf] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2dc] text-[11px] font-bold text-[#566b35]">
              MON
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-ink">Upper body</p>
              <p className="mt-1 text-[10px] text-muted">5 exercises · Strength</p>
            </div>
            <span className="rounded-full bg-[#edf5e2] px-2.5 py-1 text-[9px] font-semibold text-[#607b38]">
              DONE
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e9ebdf] bg-[#fbfcf8] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-[11px] font-bold text-ink">
              WED
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-ink">Lower body</p>
              <p className="mt-1 text-[10px] text-muted">6 exercises · Strength</p>
            </div>
            <span className="rounded-full bg-[#f3f3ef] px-2.5 py-1 text-[9px] font-semibold text-[#77776e]">
              NEXT
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#e9ebdf] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f0eb] text-[11px] font-bold text-[#77776e]">
              FRI
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-ink">Full body</p>
              <p className="mt-1 text-[10px] text-muted">4 exercises · Strength</p>
            </div>
            <span className="text-[9px] font-medium text-muted">UPCOMING</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink p-3.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold">A connected training routine</p>
            <p className="mt-1 text-[9px] text-white/55">Plan · Execute · Review</p>
          </div>
          <span className="text-accent"><ArrowIcon diagonal /></span>
        </div>
      </div>

      <div className="absolute -bottom-7 -right-3 hidden items-center gap-2 rounded-2xl border border-[#e8eadf] bg-white px-4 py-3 shadow-xl sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-ink">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[10px] font-bold text-ink">Stay on track</p>
          <p className="text-[9px] text-muted">One shared training space</p>
        </div>
      </div>
    </div>
  )
}

function PublicLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="overflow-hidden bg-canvas text-ink">
      <header className="relative z-20 border-b border-[#e9e9e3] bg-canvas/95">
        <div className="mx-auto flex min-h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandMark />

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[12px] font-medium text-[#66665f] transition hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link to="/login" className="text-[12px] font-semibold text-ink transition hover:text-[#6d8c36]">
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-white transition hover:bg-[#30352a]"
            >
              Get started <ArrowIcon />
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink md:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav aria-label="Mobile navigation" className="border-t border-[#e9e9e3] bg-canvas px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu} className="text-sm font-medium text-[#55554f]">
                  {item.label}
                </a>
              ))}
              <div className="flex gap-4 border-t border-border pt-4">
                <Link to="/login" onClick={closeMenu} className="text-sm font-semibold">Log in</Link>
                <Link to="/register" onClick={closeMenu} className="text-sm font-semibold text-[#6b8c31]">Get started</Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute -right-36 top-10 h-[500px] w-[500px] rounded-full bg-[#e7efda] blur-[100px]" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-10 lg:pb-32 lg:pt-28">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dfe5d3] bg-white/75 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-[#9bcf3f]" />
              <span className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#626b52]">
                A better way to train together
              </span>
            </div>

            <h1 className="max-w-[650px] text-[clamp(42px,5.7vw,72px)] leading-[1.04] font-extrabold tracking-[-3.8px] text-ink">
              Better coaching.
              <br />
              <span className="relative inline-block">
                Smarter training.
                <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-full bg-accent/80" />
              </span>
              <br />
              Stronger progress.
            </h1>

            <p className="mt-7 max-w-[490px] text-[15px] leading-[1.9] text-[#696961] sm:text-[16px]">
              Vigo brings coaches and athletes into one connected space — from
              finding the right coach to planning, completing, and reviewing
              every workout.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-accent px-7 text-[13px] font-bold text-ink shadow-[0_8px_24px_rgba(167,211,81,0.22)] transition hover:-translate-y-0.5 hover:bg-accent-deep"
              >
                Start your journey <ArrowIcon />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full border border-[#d7d8cf] bg-white/70 px-7 text-[13px] font-semibold text-ink transition hover:border-ink"
              >
                Explore how it works <ArrowIcon diagonal />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#e3e4dc] pt-6">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#68685f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f0dc] text-[#647e3b]">✓</span>
                Built for coaches
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#68685f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f0dc] text-[#647e3b]">✓</span>
                Designed for athletes
              </div>
            </div>
          </div>

          <div className="relative z-10 lg:pl-2">
            <WorkoutPreview />
          </div>
        </div>
      </section>

      <section id="product" className="bg-ink py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-accent">One platform, two perspectives</p>
              <h2 className="mt-5 max-w-[430px] text-[36px] leading-[1.13] font-bold tracking-[-1.8px] sm:text-[48px]">
                Your training, connected.
              </h2>
              <p className="mt-5 max-w-[390px] text-[13px] leading-[1.9] text-white/60">
                Less time managing scattered information. More clarity around
                the work that happens between coach and athlete.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article id="athletes" className="rounded-[24px] border border-white/10 bg-white/[0.06] p-7 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-ink">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                    <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M5 20c.5-3.5 2.8-5.5 7-5.5s6.5 2 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[1.7px] text-accent">For athletes</p>
                <h3 className="mt-3 text-[22px] font-bold tracking-[-0.7px]">Own your routine.</h3>
                <p className="mt-3 text-[12px] leading-[1.9] text-white/60">
                  Discover coaches, connect with the right one, follow your
                  assigned workouts, and record your training results.
                </p>
                <Link to="/register" className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold text-accent hover:gap-3">
                  Join as an athlete <ArrowIcon />
                </Link>
              </article>

              <article id="coaches" className="rounded-[24px] border border-white/10 bg-white/[0.06] p-7 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                    <path d="M4 19h16M6 16V8m6 8V5m6 11v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path d="M4 8h4m2-3h4m2 6h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[1.7px] text-accent">For coaches</p>
                <h3 className="mt-3 text-[22px] font-bold tracking-[-0.7px]">Coach with clarity.</h3>
                <p className="mt-3 text-[12px] leading-[1.9] text-white/60">
                  Present your coaching profile, organize exercises into
                  structured workouts, and review what your athletes complete.
                </p>
                <Link to="/register" className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold text-accent hover:gap-3">
                  Join as a coach <ArrowIcon />
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#718d43]">A simple training cycle</p>
            <h2 className="mt-4 text-[36px] leading-tight font-bold tracking-[-1.8px] sm:text-[48px]">
              From first connection to every rep.
            </h2>
            <p className="mt-5 text-[13px] leading-[1.9] text-[#74746c]">
              Keep the coaching journey in sequence, with a shared place for
              the plan and the work completed along the way.
            </p>
          </div>

          <div className="relative mt-16 grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16.5%] right-[16.5%] top-8 hidden border-t border-dashed border-[#cfd4c3] md:block" />
            {steps.map((step) => (
              <article key={step.number} className="relative rounded-[24px] border border-[#e5e6de] bg-white p-7 sm:p-8">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-[6px] border-canvas bg-accent text-[14px] font-extrabold text-ink">
                  {step.number}
                </div>
                <h3 className="mt-7 text-[20px] font-bold tracking-[-0.6px]">{step.title}</h3>
                <p className="mt-3 text-[12px] leading-[1.9] text-[#74746c]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eff1e9] py-20 sm:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-[600px]">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#718d43]">The essentials, together</p>
              <h2 className="mt-4 text-[36px] leading-tight font-bold tracking-[-1.8px] sm:text-[48px]">
                Everything around the workout.
              </h2>
            </div>
            <p className="max-w-[350px] text-[12px] leading-[1.9] text-[#74746c]">
              Purpose-built tools for the everyday workflow of bodybuilding
              coaches and athletes.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.number} className="group flex min-h-[250px] flex-col rounded-[22px] border border-[#e0e3d8] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(35,42,23,0.07)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[1px] text-[#8b8e80]">{feature.number}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f4e9] text-[#6f8e3c] transition group-hover:bg-accent group-hover:text-ink">
                    <ArrowIcon diagonal />
                  </span>
                </div>
                <div className="mt-auto pt-10">
                  <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#82975e]">{feature.tag}</p>
                  <h3 className="mt-2 text-[17px] font-bold tracking-[-0.4px]">{feature.title}</h3>
                  <p className="mt-3 text-[11px] leading-[1.85] text-[#77776f]">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[30px] bg-ink px-7 py-14 text-center text-white sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-36 h-80 w-80 rounded-full bg-[#a6d943]/15 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-[#a6d943]/10 blur-[80px]" />
          <div className="relative mx-auto max-w-[680px]">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-accent">Make your next move</p>
            <h2 className="mt-5 text-[36px] leading-[1.12] font-bold tracking-[-1.8px] sm:text-[52px]">
              Your training. Your coach. One connected experience.
            </h2>
            <p className="mx-auto mt-5 max-w-[480px] text-[12px] leading-[1.9] text-white/60">
              Bring more structure to the way you coach and the way you train.
              Start building your Vigo experience.
            </p>
            <Link to="/register" className="mt-8 inline-flex h-[52px] items-center gap-3 rounded-full bg-accent px-7 text-[12px] font-bold text-ink transition hover:-translate-y-0.5 hover:bg-accent-deep">
              Get started with Vigo <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5e6de] bg-canvas">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <BrandMark />
            <p className="mt-3 max-w-[270px] text-[10px] leading-[1.8] text-[#818178]">
              A connected training space for bodybuilding coaches and athletes.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="#product" className="text-[10px] font-medium text-[#6f6f67] hover:text-ink">Product</a>
            <a href="#athletes" className="text-[10px] font-medium text-[#6f6f67] hover:text-ink">Athletes</a>
            <a href="#coaches" className="text-[10px] font-medium text-[#6f6f67] hover:text-ink">Coaches</a>
            <a href="#how-it-works" className="text-[10px] font-medium text-[#6f6f67] hover:text-ink">How it works</a>
            <Link to="/login" className="text-[10px] font-medium text-[#6f6f67] hover:text-ink">Log in</Link>
          </nav>
          <p className="text-[10px] text-[#92928a]">© {new Date().getFullYear()} Vigo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

export default PublicLandingPage
