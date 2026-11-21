const paths = {
  plus: 'M12 5v14M5 12h14', close: 'm6 6 12 12M18 6 6 18',
  stack: 'm12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
  edit: 'm14 6 4 4M4 20l4.5-1 12-12a2.8 2.8 0 0 0-4-4l-12 12L4 20Z',
  archive: 'M3 4h18v5H3zM5 9v11h14V9M10 13h4',
  restore: 'M4 10a8 8 0 1 1 .8 6M4 4v6h6',
  layout: 'M3 4h6v16H3zM13 4h8v6h-8zM13 14h8v6h-8z',
  up: 'm6 14 6-6 6 6', down: 'm6 10 6 6 6-6', check: 'm4 12 5 5L20 6',
  external: 'M14 4h6v6M20 4l-9 9M10 5H5v14h14v-5',
  more: 'M5 12h.01M12 12h.01M19 12h.01', grip: 'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
  details: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h8m-8 4h5',
  sliders: 'M4 7h5m4 0h7M4 17h9m4 0h3M9 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm4 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v5m0-8h.01',
}
export default function PlanIcon({ name, size = 18 }: {name: keyof typeof paths; size?: number}) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'more' || name === 'grip' ? 3.5 : 1.7} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d={paths[name]} /></svg>
}
