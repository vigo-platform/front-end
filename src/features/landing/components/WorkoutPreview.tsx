import ArrowIcon from './ArrowIcon'

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

export default WorkoutPreview
