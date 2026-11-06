import { useEffect, useId, useRef, useState } from 'react'
import {
  Phone, ArrowRight, BadgeCheck, Clock, HeartHandshake, Sparkles, Layers, ClipboardList, CalendarClock,
  Stethoscope, Users, Trophy, MessageCircle, ScanLine, CalendarCheck, Check, ChevronLeft, ChevronRight,
  ChevronDown, CheckCircle2, ArrowUpRight, User, ZoomIn, MapPin, Mail, ShieldCheck, Smile, Menu, X,
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
          <a href={sectionPath('enquire')} className="btn btn-primary nav-cta-m" onClick={() => setOpen(false)}>Book Consultation</a>
        </nav>
        <div className="nav-actions">
          <a href={tel(callNumber)} className="nav-call" aria-label={`Call ${callNumber}`}><Phone size={18} /><span>{callNumber}</span></a>
          <a href={sectionPath('enquire')} className="btn btn-primary nav-cta"><CalendarCheck size={18} />Book Consultation</a>
          <button className="menu" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <span className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  )
}

// Styled replacement for the native <select>: click or keyboard (arrows, Home/End, Enter, Space, Esc, Tab).
function Dropdown({ labelledBy, placeholder, options, value, onChange, invalid }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrap = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  const show = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true) }
  const pick = (o) => { onChange(o); setOpen(false) }

  const onKeyDown = (e) => {
    if (e.key === 'Tab') { setOpen(false); return }
    if (e.key === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false) } return }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { show(); return }
      setActive((n) => (n + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
    } else if (e.key === 'Home' || e.key === 'End') {
      if (!open) return
      e.preventDefault()
      setActive(e.key === 'Home' ? 0 : options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open) pick(options[active])
      else show()
    }
  }

  return (
    <div className={`dd ${open ? 'open' : ''}`} ref={wrap}>
      <button
        type="button" className={`field dd-btn ${invalid ? 'err' : ''}`} role="combobox"
        aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-labelledby={labelledBy}
        aria-activedescendant={open ? `${listId}-${active}` : undefined} aria-invalid={invalid}
        onClick={() => (open ? setOpen(false) : show())} onKeyDown={onKeyDown}
      >
        <Smile size={18} aria-hidden="true" />
        <span className={value ? 'dd-value' : 'dd-placeholder'}>{value || placeholder}</span>
        <ChevronDown size={18} aria-hidden="true" className="chev" />
      </button>
      {open && (
        <ul id={listId} className="dd-list" role="listbox" aria-labelledby={labelledBy}>
          {options.map((o, n) => (
            <li
              key={o} id={`${listId}-${n}`} role="option" aria-selected={o === value}
              className={`${n === active ? 'active' : ''} ${o === value ? 'selected' : ''}`}
              onMouseEnter={() => setActive(n)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}
            >
              <span>{o}</span>{o === value && <Check size={18} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LeadForm() {
  const [values, setValues] = useState({ name: '', phone: '', area: '', concern: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (values.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.'
    if (values.area.trim().length < 2) e.area = 'Please enter your area.'
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
      const msg = `Clear aligner consultation enquiry\nName: ${values.name.trim()}\nMobile: ${values.phone.trim()}\nArea: ${values.area.trim()}\nConcern: ${values.concern}`
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
      <h3 className="fc-title">Request a consultation</h3>
      <div className="fc-row">
        <label>Name
          <span className={`field ${errors.name ? 'err' : ''}`}>
            <User size={18} aria-hidden="true" />
            <input value={values.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} />
          </span>
          {errors.name && <em>{errors.name}</em>}
        </label>
        <label>Mobile Number
          <span className={`field ${errors.phone ? 'err' : ''}`}>
            <Phone size={18} aria-hidden="true" />
            <b>+91</b>
            <input value={values.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="Mobile number" aria-invalid={!!errors.phone} />
          </span>
          {errors.phone && <em>{errors.phone}</em>}
        </label>
      </div>
      <label>Area
        <span className={`field ${errors.area ? 'err' : ''}`}>
          <MapPin size={18} aria-hidden="true" />
          <input value={values.area} onChange={set('area')} autoComplete="address-level2" placeholder="e.g. Perumbakkam, Medavakkam" aria-invalid={!!errors.area} />
        </span>
        {errors.area && <em>{errors.area}</em>}
      </label>
      <div className="dd-group">
        <span id="concern-label" className="dd-label">{form.concernLabel}</span>
        <Dropdown
          labelledBy="concern-label"
          placeholder="Select your concern"
          options={form.concerns}
          value={values.concern}
          onChange={(c) => setValues((v) => ({ ...v, concern: c }))}
          invalid={!!errors.concern}
        />
        {errors.concern && <em>{errors.concern}</em>}
      </div>
      <button className="btn btn-primary btn-lg" type="submit" disabled={sending}>
        {sending ? 'SENDING...' : form.submit}<ArrowRight size={18} />
      </button>
      {failed && <em className="form-fail">Could not send right now. Please call or WhatsApp us instead.</em>}
    </form>
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
            <a href={sectionPath('enquire')} className="btn btn-primary btn-lg">{options.cta}<ArrowRight size={18} /></a>
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
          <img src={asset('img/compare.jpg')} alt="Clear aligners on the left and metal braces on the right" loading="lazy" />
        </Reveal>
        <div className="cmp-grid">
          <CompareCard data={compare.braces} tone="braces" delay={0} />
          <CompareCard data={compare.aligners} tone="aligners" delay={120} />
        </div>
        <Reveal as="p" className="cmp-close">{compare.closing}</Reveal>
        <Reveal className="center"><a href={sectionPath('enquire')} className="btn btn-dark btn-lg">{compare.cta}<ArrowRight size={18} /></a></Reveal>
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

// Shared pop-up behaviour: focus the close button, close on Esc, and lock page scroll while open.
function usePopup(onClose) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  return closeRef
}

function CasePopup({ item, onClose }) {
  const closeRef = usePopup(onClose)
  const msg = encodeURIComponent("Hi Dr Vel's Dentistry, I saw the smile transformations and would like a clear aligner consultation.")
  return (
    <div className="popup" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="popup-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div className="popup-img"><img src={item.image} alt={item.alt} /></div>
        <div className="popup-body">
          <h3>{item.title}</h3>
          <p>Want a result like this? Talk to our team about your own clear aligner options.</p>
          <div className="popup-btns">
            <a href={tel(callNumber)} className="btn btn-dark"><Phone size={18} />CALL NOW</a>
            <a href={`${clinic.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer" className="btn btn-wa"><BrandIcon name="whatsapp" size={18} />WHATSAPP US</a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Welcome pop-up with call and WhatsApp buttons. Opens on the first visit and on every refresh.
function WelcomePopup() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(t)
  }, [])
  const close = () => setOpen(false)
  if (!open) return null
  return <WelcomeCard onClose={close} />
}

function WelcomeCard({ onClose }) {
  const closeRef = usePopup(onClose)
  const msg = encodeURIComponent("Hi Dr Vel's Dentistry, I would like to book a clear aligner consultation.")
  return (
    <div className="popup" role="dialog" aria-modal="true" aria-labelledby="welcome-title" onClick={onClose}>
      <div className="popup-card compact" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="popup-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div className="wp-head">
          <span className="eyebrow light">{hero.h1}</span>
          <h3 id="welcome-title">{form.heading}</h3>
        </div>
        <div className="wp-body">
          <p>{final.text}</p>
          <div className="wp-actions">
            <a href={tel(callNumber)} className="btn btn-dark"><Phone size={18} />CALL NOW</a>
            <a href={`${clinic.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer" className="btn btn-wa"><BrandIcon name="whatsapp" size={18} />WHATSAPP</a>
          </div>
          <a href={sectionPath('enquire')} className="btn btn-primary btn-lg wp-book" onClick={onClose}><CalendarCheck size={18} />BOOK A CONSULTATION</a>
        </div>
      </div>
    </div>
  )
}

// Framed before/after showcase for the hero. Cycles through the patient cases; a click opens the pop-up with call and WhatsApp buttons.
function HeroShowcase() {
  const cases = gallery.cases
  const [i, setI] = useState(0)
  const [openCase, setOpenCase] = useState(null)
  const hold = useRef(false)
  const go = (d) => setI((n) => (n + d + cases.length) % cases.length)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => { if (!hold.current) setI((n) => (n + 1) % cases.length) }, 3800)
    return () => clearInterval(id)
  }, [cases.length])
  const open = (c) => { hold.current = true; setOpenCase(c) }
  const close = () => { hold.current = false; setOpenCase(null) }
  return (
    <div className="hx-visual hero-in" style={{ '--i': 2 }} onMouseEnter={() => { hold.current = true }} onMouseLeave={() => { hold.current = !!openCase }}>
      <div className="hx-card">
        <div className="hx-stage">
          <button className="hx-img" onClick={() => open(cases[i])} aria-label={`View ${cases[i].title} larger`}>
            {cases.map((c, n) => (
              <span key={c.title} className={`hx-slide ${n === i ? 'on' : ''}`} aria-hidden={n !== i}>
                <img src={c.image} alt="" className="bg" loading={n === 0 ? 'eager' : 'lazy'} />
                <img src={c.image} alt={n === i ? c.alt : ''} className="fg" loading={n === 0 ? 'eager' : 'lazy'} />
              </span>
            ))}
          </button>
          <span className="hx-pill">BEFORE / AFTER</span>
          <span className="hx-count">{String(i + 1).padStart(2, '0')}<small> / {String(cases.length).padStart(2, '0')}</small></span>
        </div>
        <div className="hx-bar">
          <div className="hx-meta">
            <b>{cases[i].title}</b>
            <button className="hx-zoom" onClick={() => open(cases[i])}><ZoomIn size={15} />View larger</button>
          </div>
          <div className="hx-ctrl">
            <div className="hx-dots">
              {cases.map((c, n) => <button key={c.title} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Show ${c.title}`} />)}
            </div>
            <button onClick={() => go(-1)} aria-label="Previous case"><ChevronLeft size={18} /></button>
            <button onClick={() => go(1)} aria-label="Next case"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      {openCase && <CasePopup item={openCase} onClose={close} />}
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="hx">
      <div className="container hx-grid">
        <div className="hx-copy">
          <span className="hx-eyebrow hero-in" style={{ '--i': 0 }}>{hero.h1}</span>
          <h1 className="hero-in" style={{ '--i': 1 }}>
            {hero.headlineLines.map((l, n) => <span key={l} className={n === 1 ? 'hx-accent' : ''}>{l}</span>)}
          </h1>
          <ul className="hx-chips hero-in" style={{ '--i': 2 }}>
            {hero.trust.map(([, t]) => <li key={t}><i />{t}</li>)}
          </ul>
          <p className="hx-text hero-in" style={{ '--i': 3 }}>{hero.text}</p>
          <div className="hx-btns hero-in" style={{ '--i': 4 }}>
            <a href={tel(callNumber)} className="btn btn-primary btn-lg"><Phone size={18} />CALL NOW</a>
            <a href={sectionPath('enquire')} className="btn btn-outline-light btn-lg">BOOK A CONSULTATION<ArrowUpRight size={18} /></a>
          </div>
        </div>
        <HeroShowcase />
      </div>
    </section>
  )
}

function Appointments() {
  return (
    <section id="enquire" className="section alt ap">
      <div className="container ap-grid">
        <div className="ap-copy">
          <Reveal as="span" className="eyebrow ap-eye"><CalendarCheck size={14} />Consultation</Reveal>
          <Reveal as="h2" delay={80}>Book Your Clear <span className="mark">Aligner</span> Consultation</Reveal>
          <Reveal as="p" delay={140}>{options.text[1]}</Reveal>
          <ul className="ap-list">
            {options.points.map(([ic, t], n) => (
              <Reveal as="li" key={t} delay={200 + n * 80}><span className="ap-ico"><Icon name={ic} size={20} /></span>{t}</Reveal>
            ))}
          </ul>
          <Reveal delay={460} className="ap-talk">
            <small>Prefer to talk right away?</small>
            <div className="ap-btns">
              <a href={tel(callNumber)} className="btn btn-outline"><Phone size={18} />CALL NOW</a>
              <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="btn btn-wa"><BrandIcon name="whatsapp" size={18} />WHATSAPP US</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}><LeadForm /></Reveal>
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
          <a href={sectionPath('enquire')} className="btn btn-primary btn-lg"><CalendarCheck size={18} />BOOK A CONSULTATION</a>
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
      <a href={sectionPath('enquire')} className="sb book"><CalendarCheck size={18} />Book</a>
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
        <Appointments />
        <Options />
        <Compare />
        <Why />
        <Journey />
        <Faq />
        <Final />
      </main>
      <Footer />
      <StickyBar />
      <WhatsAppFloat />
      <WelcomePopup />
    </>
  )
}
