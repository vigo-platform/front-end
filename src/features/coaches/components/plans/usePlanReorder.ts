import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'

interface Gesture {
  id: number
  pointer: number
  handle: HTMLButtonElement
  startY: number
  pointerY: number
  offset: number
  height: number
}

export function usePlanReorder(order: number[], onMove: (id: number, index: number) => void) {
  const scroller = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const ghost = useRef<HTMLDivElement>(null)
  const rows = useRef(new Map<number, HTMLLIElement>())
  const animations = useRef(new Map<number, Animation>())
  const positions = useRef<Map<number, number> | null>(null)
  const gesture = useRef<Gesture | null>(null)
  const frame = useRef(0)
  const target = useRef<number | null>(null)
  const [dragged, setDragged] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  useLayoutEffect(() => {
    const before = positions.current
    positions.current = null
    if (!before) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    for (const [id, row] of rows.current) {
      animations.current.get(id)?.cancel()
      animations.current.delete(id)
      const previous = before.get(id)
      if (reduced || previous === undefined) continue
      const offset = previous - row.getBoundingClientRect().top
      if (Math.abs(offset) < 1) continue
      const animation = row.animate(
        [{ translate: '0 ' + offset + 'px' }, { translate: '0 0' }],
        { duration: 340, easing: 'cubic-bezier(.22, 1, .36, 1)' },
      )
      animations.current.set(id, animation)
    }
  }, [order])

  function move(id: number, index: number, startingTop?: number) {
    if (index < 0 || index >= order.length || order[index] === id) return
    positions.current = new Map(Array.from(rows.current, ([id, row]) => [id, row.getBoundingClientRect().top]))
    if (startingTop !== undefined) positions.current.set(id, startingTop)
    onMove(id, index)
  }

  function updatePosition(autoScroll: boolean) {
    const drag = gesture.current
    if (!drag || !scroller.current || !list.current) return
    const viewport = scroller.current.getBoundingClientRect()
    const edge = Math.min(58, viewport.height / 4)
    const above = viewport.top + edge - drag.pointerY
    const below = drag.pointerY - (viewport.bottom - edge)
    if (autoScroll && (above > 0 || below > 0)) {
      scroller.current.scrollTop += (above > 0 ? -1 : 1) * Math.min(18, Math.max(above, below) / 3)
    }
    const listBox = list.current.getBoundingClientRect()
    const top = Math.max(0, Math.min(listBox.height - drag.height, drag.pointerY - drag.offset - listBox.top))
    if (ghost.current) ghost.current.style.transform = 'translateY(' + top + 'px)'
    const center = top + listBox.top + drag.height / 2
    let nearest = drag.id
    let distance = Infinity
    for (const [id, row] of rows.current) {
      const rect = row.getBoundingClientRect()
      const nextDistance = Math.abs(center - (rect.top + rect.height / 2))
      if (nextDistance < distance) {
        nearest = id
        distance = nextDistance
      }
    }
    if (target.current !== nearest) {
      target.current = nearest
      setOver(nearest)
    }
    return top + listBox.top
  }

  function track() {
    updatePosition(true)
    frame.current = requestAnimationFrame(track)
  }

  function start(event: PointerEvent<HTMLButtonElement>, id: number) {
    if (!event.isPrimary || event.button !== 0 || order.length < 2 || gesture.current) return
    const bounds = rows.current.get(id)?.getBoundingClientRect()
    if (!bounds) return
    for (const animation of animations.current.values()) animation.cancel()
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    gesture.current = {
      id, handle, pointer: event.pointerId, startY: event.clientY, pointerY: event.clientY,
      offset: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)), height: bounds.height,
    }
  }

  function update(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current
    if (!drag || drag.pointer !== event.pointerId) return
    drag.pointerY = event.clientY
    if (frame.current || Math.abs(drag.pointerY - drag.startY) < 5) return
    setDragged(drag.id)
    frame.current = requestAnimationFrame(track)
  }

  function finish(commit: boolean) {
    const drag = gesture.current
    if (!drag) return
    if (commit && frame.current) {
      const startingTop = updatePosition(false)
      if (target.current !== null) move(drag.id, order.indexOf(target.current), startingTop)
    }
    gesture.current = null
    if (drag.handle.hasPointerCapture(drag.pointer)) drag.handle.releasePointerCapture(drag.pointer)
    cancelAnimationFrame(frame.current)
    frame.current = 0
    target.current = null
    setDragged(null)
    setOver(null)
  }

  function drop(event: PointerEvent<HTMLButtonElement>) {
    if (gesture.current?.pointer !== event.pointerId) return
    gesture.current.pointerY = event.clientY
    finish(true)
  }

  function registerRow(id: number, element: HTMLLIElement | null) {
    if (element) rows.current.set(id, element)
    else rows.current.delete(id)
  }

  return { scrollerRef: scroller, listRef: list, ghostRef: ghost, registerRow, dragged, over, move, start, update, drop, finish }
}
