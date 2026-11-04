import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1]
      // Also reveal anything already scrolled past, so fast scrolling or a resize never leaves a blank gap.
      if (e.isIntersecting || e.boundingClientRect.top < 0) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold, rootMargin: '0px 0px -4% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}
