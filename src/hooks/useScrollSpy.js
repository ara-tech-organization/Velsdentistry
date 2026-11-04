import { useEffect, useState } from 'react'

const bottomReached = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

// Tracks which section is under the reading line, keeps the URL hash in sync,
// and scrolls to the hash when the page is opened from a shared link.
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let raf = 0
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
      const hash = current === ids[0] ? '' : `#${current}`
      if (window.location.hash !== hash) {
        history.replaceState(null, '', hash || window.location.pathname + window.location.search)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    // Deep link: open /#reviews in a new tab and land on that section.
    const target = window.location.hash.slice(1)
    const jump = () => {
      const el = target && document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
    const timers = target ? [setTimeout(jump, 60), setTimeout(jump, 600)] : []
    window.addEventListener('load', jump)
    if (!target) compute()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('load', jump)
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [ids])

  return active
}
