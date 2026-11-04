import { useEffect, useRef, useState } from 'react'
import {
  Phone, ArrowRight, BadgeCheck, Clock, HeartHandshake, Sparkles, Layers, ClipboardList, CalendarClock,
  Stethoscope, Users, Trophy, MessageCircle, ScanLine, CalendarCheck, Check, ChevronLeft, ChevronRight,
  ChevronDown, CheckCircle2, ImageIcon, Send, MapPin, Mail, ShieldCheck, Smile, Menu, X,
} from 'lucide-react'
import {
  clinic, formEndpoint, nav, sectionIds, hero, form, options, compare, why, journey, gallery, faqs, final,
} from './data/content'
import { Reveal, Counter } from './components/Reveal'
import { BrandIcon } from './components/BrandIcon'
import { useScrollSpy, sectionPath } from './hooks/useScrollSpy'
import logo from './assets/Logo.png'
import './App.css'

const iconMap = {
  BadgeCheck, Clock, HeartHandshake, Sparkles, Layers, ClipboardList, CalendarClock, Stethoscope, Users,
  Trophy, MessageCircle, ScanLine, CalendarCheck,
}

const Icon = ({ name, size = 24 }) => {
  const C = iconMap[name] || Smile
  return <C size={size} strokeWidth={1.75} aria-hidden="true" />
}

// Prefix public files with the deploy base so images load on GitHub Pages.
const asset = (p) => `${import.meta.env.BASE_URL}${p}`
const tel = (p) => `tel:${p.replace(/\s/g, '')}`
const callNumber = clinic.phones[0]

function Navbar({ active }) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href={sectionPath('home')} className="brand" onClick={() => setOpen(false)}><img src={logo} alt="Dr Vel's Dentistry" /></a>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {nav.map(([l, id]) => (
            <a key={id} href={sectionPath(id)} className={active === id ? 'active' : ''} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <a href={sectionPath('home')} className="btn btn-primary nav-cta-m" onClick={() => setOpen(false)}>Book Consultation</a>
        </nav>
        <div className="nav-actions">
          <a href={tel(callNumber)} className="nav-call" aria-label={`Call ${callNumber}`}><Phone size={18} /><span>{callNumber}</span></a>
          <a href={sectionPath('home')} className="btn btn-primary nav-cta"><CalendarCheck size={18} />Book Consultation</a>
          <button className="menu" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <span className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  )
}

function LeadForm() {
  const [values, setValues] = useState({ name: '', phone: '', concern: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (values.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.'
    if (!values.concern) e.concern = 'Please choose a concern.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setFailed(false)
    if (!formEndpoint) {
      const msg = `Clear aligner consultation enquiry\nName: ${values.name.trim()}\nMobile: ${values.phone.trim()}\nConcern: ${values.concern}`
      window.open(`${clinic.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
      setSent(true)
      return
    }
    setSending(true)
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, source: 'clear-aligners-landing' }),
      })
      if (!res.ok) throw new Error('bad status')
      setSent(true)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="form-card sent" role="status">
        <CheckCircle2 size={56} strokeWidth={1.5} />
        <h3>{form.success}</h3>
        <a href={tel(callNumber)} className="btn btn-dark"><Phone size={18} />Prefer to talk now? Call us</a>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <h2 className="form-title">{form.heading}</h2>
      <label>Name
        <input value={values.name} onChange={set('name')} autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} />
        {errors.name && <em>{errors.name}</em>}
      </label>
      <label>Mobile Number
        <input value={values.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" aria-invalid={!!errors.phone} />
        {errors.phone && <em>{errors.phone}</em>}
      </label>
      <label>{form.concernLabel}
        <span className="select">
          <select value={values.concern} onChange={set('concern')} aria-invalid={!!errors.concern}>
            <option value="" disabled>Select your concern</option>
            {form.concerns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={18} aria-hidden="true" />
        </span>
        {errors.concern && <em>{errors.concern}</em>}
      </label>
      <button className="btn btn-primary btn-lg" type="submit" disabled={sending}>
        {sending ? 'SENDING...' : form.submit}<Send size={18} />
      </button>
      {failed && <em className="form-fail">Could not send right now. Please call or WhatsApp us instead.</em>}
      <div className="form-alt">
        <a href={tel(callNumber)} className="btn btn-outline"><Phone size={17} />CALL NOW</a>
        <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="btn btn-wa"><BrandIcon name="whatsapp" size={17} />WHATSAPP US</a>
      </div>
    </form>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="blob b1" /><div className="blob b2" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow light hero-in" style={{ '--i': 0 }}>{hero.h1}</span>
          <h1 className="hero-in" style={{ '--i': 1 }}>{hero.headline}</h1>
          <p className="lead hero-in" style={{ '--i': 2 }}>{hero.text}</p>
          <ul className="trust hero-in" style={{ '--i': 3 }}>
            {hero.trust.map(([ic, t]) => <li key={t}><Icon name={ic} size={18} />{t}</li>)}
          </ul>
        </div>
        <div id="enquire" className="hero-form hero-in" style={{ '--i': 2 }}>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

function Options() {
  return (
    <section className="section" id="options">
      <div className="container">
        <Reveal className="opt-panel">
          <div className="opt-body">
            <h2>{options.heading}</h2>
            {options.text.map((t, i) => <p key={i}>{t}</p>)}
            <a href={sectionPath('home')} className="btn btn-primary btn-lg">{options.cta}<ArrowRight size={18} /></a>
          </div>
          <ul className="opt-cards">
            {options.points.map(([ic, t], i) => (
              <li key={t} className="opt-card">
                <span className="opt-ico"><Icon name={ic} size={26} /></span>
                <b>{t}</b>
                <span className="opt-n">0{i + 1}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

const CompareCard = ({ data, tone, delay }) => (
  <Reveal delay={delay} className={`cmp-card ${tone}`}>
    <h3>{data.title}</h3>
    <ul>
      {data.points.map((p) => (
        <li key={p}>{tone === 'aligners' ? <Check size={18} /> : <span className="dot" />}{p}</li>
      ))}
    </ul>
  </Reveal>
)

function Compare() {
  return (
    <section className="section alt" id="compare">
      <div className="container">
        <div className="head">
          <Reveal as="h2">{compare.heading}</Reveal>
          <Reveal as="p" delay={80}>{compare.text}</Reveal>
        </div>
        <Reveal variant="scale" className="cmp-img">
          <img src={asset('img/aligners.png')} alt="Clear aligners on the left and metal braces on the right" loading="lazy" />
          <span className="cmp-tag l">Clear Aligners</span><span className="cmp-tag r">Metal Braces</span>
        </Reveal>
        <div className="cmp-grid">
          <CompareCard data={compare.braces} tone="braces" delay={0} />
          <CompareCard data={compare.aligners} tone="aligners" delay={120} />
        </div>
        <Reveal as="p" className="cmp-close">{compare.closing}</Reveal>
        <Reveal className="center"><a href={sectionPath('home')} className="btn btn-dark btn-lg">{compare.cta}<ArrowRight size={18} /></a></Reveal>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section className="section dark" id="why">
      <div className="container why-split">
        <div className="why-left">
          <Reveal as="h2">{why.heading}</Reveal>
          <Reveal as="p" delay={80} className="why-lead">{why.text}</Reveal>
          <ul className="why-list">
            {why.stats.map(([ic, n, suf, l], i) => (
              <Reveal as="li" key={l} delay={140 + i * 90} className="why-row">
                <span className="why-ico"><Icon name={ic} size={24} /></span>
                <strong><Counter value={n} suffix={suf} /></strong>
                <span className="why-label">{l}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal variant="scale" delay={120} className="why-visual">
          <div className="why-frame">
            <img src={asset('img/leaflet.jpg')} alt="Dr Vel's Dentistry award credentials, including Famdent Clinic of the Year 2025" loading="lazy" />
          </div>
          <div className="why-badge">
            <span className="why-badge-ico"><Trophy size={22} strokeWidth={1.75} aria-hidden="true" /></span>
            <div><b>{why.award.year}</b><small>{why.award.label}</small></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section className="section" id="journey">
      <div className="container">
        <div className="head"><Reveal as="h2">{journey.heading}</Reveal></div>
        <ol className="steps">
          {journey.steps.map(([ic, t, d], i) => (
            <Reveal as="li" key={t} delay={i * 100} className="step">
              <span className="step-ico"><Icon name={ic} size={28} /><em>{i + 1}</em></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Gallery() {
  const rail = useRef(null)
  const slide = (dir) => {
    const el = rail.current
    if (el) el.scrollBy({ left: dir * (el.firstElementChild?.getBoundingClientRect().width ?? 320 + 20), behavior: 'smooth' })
  }
  const paused = useRef(false)
  // Auto-advance every few seconds, looping back to the first case; pauses while the visitor hovers, touches or focuses the rail.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => {
      const el = rail.current
      if (!el || paused.current) return
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: 'smooth' })
      else slide(1)
    }, 3500)
    return () => clearInterval(id)
  }, [])
    const cards = gallery.cases.length
    ? gallery.cases
    : Array.from({ length: gallery.slots }, (_, i) => ({ title: `Patient case ${i + 1}`, pending: true }))
  return (
    <section className="section alt" id="gallery">
      <div className="container">
        <div className="head">
          <Reveal as="h2">{gallery.heading}</Reveal>
          <Reveal as="p" delay={80}>{gallery.text}</Reveal>
        </div>
        <div className="rail-wrap">
          <button className="rail-btn l" onClick={() => slide(-1)} aria-label="Previous case"><ChevronLeft size={22} /></button>
          <div
            className="rail" ref={rail} tabIndex={0} aria-label="Smile transformation cases"
            onMouseEnter={() => { paused.current = true }} onMouseLeave={() => { paused.current = false }}
            onFocus={() => { paused.current = true }} onBlur={() => { paused.current = false }}
            onTouchStart={() => { paused.current = true }} onTouchEnd={() => setTimeout(() => { paused.current = false }, 4000)}
          >
            {cards.map((c) => (
              <figure key={c.title} className="case">
                <div className="ba">
                  {c.pending ? (
                    <>
                      <div className="ba-half"><ImageIcon size={28} strokeWidth={1.5} /><span>Before</span></div>
                      <div className="ba-half"><ImageIcon size={28} strokeWidth={1.5} /><span>After</span></div>
                    </>
                  ) : (
                    <>
                      <div className="ba-half"><img src={asset(c.before)} alt={`${c.title} before`} loading="lazy" /><span>Before</span></div>
                      <div className="ba-half"><img src={asset(c.after)} alt={`${c.title} after`} loading="lazy" /><span>After</span></div>
                    </>
                  )}
                </div>
                <figcaption>{c.title}{c.pending && <small>Photo to be supplied by the clinic</small>}</figcaption>
              </figure>
            ))}
          </div>
          <button className="rail-btn r" onClick={() => slide(1)} aria-label="Next case"><ChevronRight size={22} /></button>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" id="faq">
      <div className="container faq-wrap">
        <div className="faq-side">
          <Reveal as="h2">Frequently Asked Questions</Reveal>
          <Reveal delay={80} className="faq-cta">
            <a href={tel(callNumber)} className="btn btn-dark"><Phone size={18} />CALL NOW</a>
            <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="btn btn-wa"><BrandIcon name="whatsapp" size={18} />WHATSAPP US</a>
          </Reveal>
        </div>
        <div className="faq">
          {faqs.map(([q, a], i) => {
            const on = open === i
            return (
              <Reveal key={q} delay={i * 50} className={`faq-item ${on ? 'on' : ''}`}>
                <button id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                  <span>{i + 1}. {q}</span><ChevronDown size={20} aria-hidden="true" />
                </button>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-a"><div><p>{a}</p></div></div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Final() {
  return (
    <section className="section dark final" id="contact">
      <div className="container center">
        <Reveal as="h2">{final.headline}</Reveal>
        <Reveal as="p" delay={80} className="final-text">{final.text}</Reveal>
        <Reveal delay={160} className="final-btns">
          <a href={sectionPath('home')} className="btn btn-primary btn-lg"><CalendarCheck size={18} />BOOK A CONSULTATION</a>
          <a href={tel(callNumber)} className="btn btn-ghost btn-lg"><Phone size={18} />CALL NOW</a>
          <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="btn btn-wa btn-lg"><BrandIcon name="whatsapp" size={18} />WHATSAPP US</a>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container foot">
        <img src={asset('img/logo-footer.png')} alt="Dr Vel's Dentistry" className="foot-logo" />
        <div className="foot-info">
          <p><MapPin size={16} />{clinic.address}</p>
          <a href={tel(callNumber)}><Phone size={16} />{clinic.phones.join('  |  ')}</a>
          <a href={`mailto:${clinic.email}`}><Mail size={16} />{clinic.email}</a>
        </div>
        <div className="social">
          <a href={clinic.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><BrandIcon name="facebook" size={18} /></a>
          <a href={clinic.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><BrandIcon name="instagram" size={18} /></a>
          <a href={clinic.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><BrandIcon name="whatsapp" size={18} /></a>
        </div>
      </div>
      <p className="copy"><ShieldCheck size={14} /> Treatment suitability is confirmed after a clinical assessment. &copy; {new Date().getFullYear()} Dr Vel's Dentistry.</p>
    </footer>
  )
}

// Mobile-first conversion bar: always-visible call, WhatsApp and book actions.
function StickyBar() {
  return (
    <div className="sticky-bar">
      <a href={tel(callNumber)} className="sb call"><Phone size={18} />Call</a>
      <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="sb wa"><BrandIcon name="whatsapp" size={18} />WhatsApp</a>
      <a href={sectionPath('home')} className="sb book"><CalendarCheck size={18} />Book</a>
    </div>
  )
}

function WhatsAppFloat() {
  return (
    <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="wa-float" aria-label="Chat on WhatsApp">
      <span className="wa-pulse" aria-hidden="true" />
      <BrandIcon name="whatsapp" size={30} />
      <span className="wa-tip">Chat with us on WhatsApp</span>
    </a>
  )
}

export default function App() {
  const active = useScrollSpy(sectionIds)
  return (
    <>
      <Navbar active={active} />
      <main>
        <Hero />
        <Options />
        <Compare />
        <Why />
        <Journey />
        <Gallery />
        <Faq />
        <Final />
      </main>
      <Footer />
      <StickyBar />
      <WhatsAppFloat />
    </>
  )
}
