import { useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL

// Clean section URL, e.g. /Velsdentistry/treatments. Home is the bare base path.
export const sectionPath = (id) => (id === 'home' ? BASE : `${BASE}${id}`)

const bottomReached = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

const idFromPath = (ids) => {
  const rest = window.location.pathname.slice(BASE.length).replace(/\/+$/, '')
  return ids.includes(rest) ? rest : ''
}

const scrollToId = (id, behavior = 'smooth') => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior, block: 'start' })
}

// Tracks the section under the reading line, keeps the URL path in sync while scrolling,
// scrolls to the section named in the URL on load, and handles in-page link clicks.
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let raf = 0
    let lock = 0 // pause URL syncing while a click-triggered smooth scroll runs

    const compute = () => {
      raf = 0
      const line = window.innerHeight * 0.35
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      if (bottomReached()) current = ids[ids.length - 1]
      setActive(current)
      if (Date.now() < lock) return
      const path = sectionPath(current)
      if (window.location.pathname !== path) history.replaceState(null, '', path + window.location.search)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute) }

    const onClick = (e) => {
      const a = e.target.closest('a')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      if (a.target === '_blank' || a.origin !== window.location.origin) return
      const rest = a.pathname.slice(BASE.length).replace(/\/+$/, '')
      const id = a.pathname === BASE ? ids[0] : rest
      if (!ids.includes(id) || !a.pathname.startsWith(BASE)) return
      e.preventDefault()
      lock = Date.now() + 1200
      history.pushState(null, '', sectionPath(id))
      scrollToId(id)
    }

    const onPop = () => scrollToId(idFromPath(ids) || ids[0])

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)

    // Deep link: opening /Velsdentistry/reviews in a new tab lands on that section.
    const target = idFromPath(ids)
    const jump = () => target && scrollToId(target, 'auto')
    const timers = target ? [setTimeout(jump, 60), setTimeout(jump, 600)] : []
    window.addEventListener('load', jump)
    if (!target) compute()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('load', jump)
      document.removeEventListener('click', onClick)
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [ids])

  return active
}
