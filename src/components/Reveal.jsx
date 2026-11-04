import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView()
  return (
    <Tag
      ref={ref}
      style={{ '--d': `${delay}ms` }}
      className={`reveal reveal-${variant} ${seen ? 'is-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Counter({ value, suffix }) {
  const [ref, seen] = useInView(0.4)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    let t0
    const tick = (t) => {
      t0 ??= t
      const p = Math.min((t - t0) / 1600, 1)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, value])
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return <span ref={ref}>{reduced && seen ? value : n}{suffix}</span>
}
