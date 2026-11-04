import { useEffect, useState } from 'react'
import {
  Phone, Mail, MapPin, Menu, X, ArrowRight, ArrowUpRight, Award, Star,
  ShieldCheck, Stethoscope, HeartHandshake, ScanFace, ScanLine, Scan, Truck, Circle,
  CalendarCheck, User, Trophy, Medal, Quote, BadgeCheck, ExternalLink, Send, CheckCircle2, ZoomIn,
} from 'lucide-react'
import { clinic, nav, sectionIds, awards, stats, pillars, treatments, features, reviews } from './data/content'
import { Reveal, Counter } from './components/Reveal'
import { BrandIcon } from './components/BrandIcon'
import { useScrollSpy } from './hooks/useScrollSpy'
import logo from './assets/Logo.png'
import './App.css'

const iconMap = { ShieldCheck, Stethoscope, HeartHandshake, ScanFace, ScanLine, Scan, Truck }

const Icon = ({ name, size = 24 }) => {
  const C = iconMap[name] || Circle
  return <C size={size} strokeWidth={1.75} aria-hidden="true" />
}

const tel = (p) => `tel:${p.replace(/\s/g, '')}`

function Navbar({ active }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const current = active === 'book' ? 'contact' : active
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#home" className="brand"><img src={logo} alt="Dr Vel's Dentistry" /></a>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {nav.map(([l, h]) => (
            <a key={l} href={h} className={current === h.slice(1) ? 'active' : ''} aria-current={current === h.slice(1) ? 'true' : undefined} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <a href="#book" className="btn btn-primary nav-cta-m" onClick={() => setOpen(false)}>Book Appointment</a>
        </nav>
        <div className="nav-actions">
          <a href={clinic.whatsapp} className="icon-btn" aria-label="WhatsApp" target="_blank" rel="noreferrer"><BrandIcon name="whatsapp" size={20} /></a>
          <a href="#book" className="btn btn-primary nav-cta"><CalendarCheck size={18} />Book Appointment</a>
          <button className="icon-btn menu" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <span className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  )
}

function AwardsStrip() {
  const items = [...awards, ...awards]
  return (
    <div className="strip" aria-label="Awards">
      <div className="strip-track">
        {items.map((a, i) => <span key={i}><Award size={16} />{a}</span>)}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="blob b1" /><div className="blob b2" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-in" style={{ '--i': 0 }}>Family and kids dentistry, Chennai</span>
          <h1 className="hero-in" style={{ '--i': 1 }}>Ready for your <span className="grad">perfect smile?</span></h1>
          <p className="lead hero-in" style={{ '--i': 2 }}>
            Doctor-owned, personalised dental care with Expertise, Experience and Ethics. One clinic, no branches, and a team that remembers your name.
          </p>
          <div className="hero-btns hero-in" style={{ '--i': 3 }}>
            <a href="#book" className="btn btn-primary btn-lg">Book Appointment <ArrowRight size={18} /></a>
            <a href={tel(clinic.phones[0])} className="btn btn-ghost btn-lg"><Phone size={18} />Call Now</a>
          </div>
          <div className="stats hero-in" style={{ '--i': 4 }}>
            {stats.map((s) => (
              <div key={s.label}><strong><Counter value={s.value} suffix={s.suffix} /></strong><span>{s.label}</span></div>
            ))}
          </div>
        </div>
        <div className="hero-media hero-in" style={{ '--i': 2 }}>
          <div className="frame"><img src="/img/director.png" alt="Dr Sakthivel Rajendran beside the Dr Vel's Dentistry crest" /></div>
          <div className="float-card fc1"><Star size={18} fill="currentColor" /><div><b>121 reviews</b><small>Rated Excellent on Google</small></div></div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <Reveal variant="wipe" className="about-img"><img src="/img/team.jpeg" alt="Team Dr Vel's Dentistry" loading="lazy" /></Reveal>
        <div>
          <Reveal as="span" className="eyebrow">From the desk of the Clinical Director</Reveal>
          <Reveal as="h2" delay={80}>Dr Sakthivel Rajendran</Reveal>
          <Reveal as="p" delay={140}>Welcome to Dr Vel's Dentistry, with its unique formula of Expertise, Experience and Ethics. After more than 20 years leading corporate dental clinics, we returned to the concept of personalised family dentistry: doctor-owned, doctor-governed, with no branches.</Reveal>
          <Reveal as="p" delay={200}>We have grown to a team of 20 with specialists, clinical heads and chairside assistants, and have crossed 100,000 appointments. Come and experience affordable, advanced dental care with a personal touch.</Reveal>
          <div className="pillars">
            {pillars.map(([ic, t, d], i) => (
              <Reveal key={t} delay={260 + i * 90} className="pillar">
                <span className="ico"><Icon name={ic} /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Treatments() {
  return (
    <section id="treatments" className="section alt">
      <div className="container">
        <div className="head">
          <Reveal as="span" className="eyebrow">Our treatments</Reveal>
          <Reveal as="h2" delay={80}>Complete dental care for every age</Reveal>
        </div>
        <div className="grid-t">
          {treatments.map(([t, img, d], i) => (
            <Reveal key={t} as="a" href="#book" delay={(i % 4) * 80} className="t-card">
              <div className="t-img"><img src={`/img/${img}`} alt={t} loading="lazy" /></div>
              <div className="t-body">
                <h3>{t}</h3>
                <p>{d}</p>
                <span className="more">View more <ArrowUpRight size={16} /></span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="why" className="section dark">
      <div className="container">
        <div className="head">
          <Reveal as="span" className="eyebrow light">Why Dr Vel's Dentistry</Reveal>
          <Reveal as="h2" delay={80}>Advanced technology, personal care</Reveal>
        </div>
        <div className="grid-f">
          {features.map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 90} className="f-card">
              <span className="ico on-dark"><Icon name={ic} /></span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const honours = [
  ['2025', 'Clinic of the Year', 'Famdent Special Jury Award, Zone 2, Mumbai', 'Trophy'],
  ['2024', 'Service Excellence Award', 'Kids & Family Dental Care', 'Medal'],
  ['2025', 'Nominated in 6 categories', 'Best Aligner Dentist, Best Dental Team, Best Pediatric Dentist and more', 'BadgeCheck'],
]
const honourIcons = { Trophy, Medal, BadgeCheck }

function Gallery() {
  const [zoom, setZoom] = useState(false)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  return (
    <section id="gallery" className="section who">
      <div className="container">
        <div className="head">
          <Reveal as="span" className="eyebrow">Who are we</Reveal>
          <Reveal as="h2" delay={80}>Recognised for excellence in family dentistry</Reveal>
          <Reveal as="p" delay={140}>Doctor-owned, with no branches, and honoured by the dental community for personalised care.</Reveal>
        </div>
        <div className="who-grid">
          <Reveal variant="scale" className="leaflet">
            <button onClick={() => setZoom(true)} aria-label="Enlarge awards leaflet">
              <img src="/img/leaflet.jpg" alt="Awards and excellence leaflet" loading="lazy" />
              <span className="zoom"><ZoomIn size={20} /></span>
            </button>
          </Reveal>
          <div className="honours">
            {honours.map(([yr, t, d, ic], i) => {
              const C = honourIcons[ic]
              return (
                <Reveal key={t} delay={i * 110} className="honour">
                  <span className="honour-ico"><C size={28} strokeWidth={1.75} aria-hidden="true" /></span>
                  <div>
                    <span className="honour-yr">{yr}</span>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </Reveal>
              )
            })}
            <Reveal delay={340} className="who-foot">
              <Award size={20} /><span>Most Awarded Dental Clinic</span>
            </Reveal>
          </div>
        </div>
      </div>
      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setZoom(false)}>
          <button className="icon-btn lb-x" aria-label="Close"><X size={22} /></button>
          <img src="/img/leaflet.jpg" alt="Awards and excellence leaflet" />
        </div>
      )}
    </section>
  )
}

const Stars = ({ size = 18 }) => (
  <span className="stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill="currentColor" />)}</span>
)

function Reviews() {
  const loop = [...reviews, ...reviews]
  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <div className="head">
          <Reveal as="span" className="eyebrow light">Google reviews</Reveal>
          <Reveal as="h2" delay={80}>Loved by families across Chennai</Reveal>
          <Reveal delay={140} className="rev-top">
            <strong>Excellent</strong><Stars size={20} /><span>Based on 121 Google reviews</span>
          </Reveal>
        </div>
      </div>
      <Reveal delay={200} className="mq-wrap">
        <div className="mq">
          <div className="mq-track">
            {loop.map((text, idx) => (
              <figure className="mq-card" key={idx} aria-hidden={idx >= reviews.length}>
                <div className="mq-head">
                  <span className="avatar"><User size={22} strokeWidth={1.75} aria-hidden="true" /></span>
                  <span className="who-by"><b>Patient review</b><small><BadgeCheck size={14} />Verified on Google</small></span>
                  <Quote size={26} strokeWidth={1.5} className="mq-q" aria-hidden="true" />
                </div>
                <Stars size={14} />
                <blockquote>{text}</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="rev-more">
        <a className="btn btn-primary btn-lg" href="https://www.google.com/search?q=Dr+Vel%27s+Dentistry+Perumbakkam+reviews" target="_blank" rel="noreferrer">
          Read more on Google <ExternalLink size={18} />
        </a>
      </div>
    </section>
  )
}

function Book() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.target))
    const er = {}
    if (!f.first.trim()) er.first = 'Please enter your first name'
    if (!/^[+\d][\d\s-]{7,}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone number'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    setErrors(er)
    if (!Object.keys(er).length) setSent(true)
  }
  return (
    <section id="book" className="section book">
      <div className="container book-grid">
        <div>
          <Reveal as="span" className="eyebrow light">Book appointment</Reveal>
          <Reveal as="h2" delay={80}>Ready for your perfect smile?</Reveal>
          <Reveal as="p" delay={140}>Leave your details and we will call you back to confirm a convenient time.</Reveal>
          <Reveal delay={200} className="book-contact">
            <a href={tel(clinic.phones[0])} className="contact-card">
              <span className="contact-ico"><Phone size={22} strokeWidth={1.75} /></span>
              <span className="contact-txt"><small>Call us</small><b>{clinic.phones[0]}</b></span>
              <ArrowUpRight size={18} className="contact-go" />
            </a>
            <a href={clinic.whatsapp} target="_blank" rel="noreferrer" className="contact-card">
              <span className="contact-ico wa"><BrandIcon name="whatsapp" size={22} /></span>
              <span className="contact-txt"><small>WhatsApp</small><b>Chat with us</b></span>
              <ArrowUpRight size={18} className="contact-go" />
            </a>
            <a href={`mailto:${clinic.email}`} className="contact-card">
              <span className="contact-ico"><Mail size={22} strokeWidth={1.75} /></span>
              <span className="contact-txt"><small>Email</small><b>{clinic.email}</b></span>
              <ArrowUpRight size={18} className="contact-go" />
            </a>
          </Reveal>
        </div>
        <Reveal variant="scale" className="form-card">
          {sent ? (
            <div className="sent"><CheckCircle2 size={48} /><h3>Thank you</h3><p>We have received your request and will call you shortly.</p></div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="row">
                <label>First name<input name="first" autoComplete="given-name" aria-invalid={!!errors.first} />{errors.first && <em>{errors.first}</em>}</label>
                <label>Last name<input name="last" autoComplete="family-name" /></label>
              </div>
              <label>Phone<input name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />{errors.phone && <em>{errors.phone}</em>}</label>
              <label>Email<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />{errors.email && <em>{errors.email}</em>}</label>
              <label>Message<textarea name="message" rows="3" /></label>
              <button className="btn btn-accent btn-lg" type="submit">Request callback <Send size={18} /></button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container foot-grid">
        <div>
          <img src={logo} alt="Dr Vel's Dentistry" className="foot-logo" />
          <p>Kids & Family Dentistry. Expertise, Experience and Ethics.</p>
          <div className="social">
            <a href={clinic.social.facebook} aria-label="Facebook" target="_blank" rel="noreferrer"><BrandIcon name="facebook" /></a>
            <a href={clinic.social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer"><BrandIcon name="instagram" /></a>
            <a href={clinic.whatsapp} aria-label="WhatsApp" target="_blank" rel="noreferrer"><BrandIcon name="whatsapp" /></a>
          </div>
        </div>
        <div className="foot-info">
          <h3>Contact</h3>
          <p><MapPin size={18} />{clinic.address}</p>
          {clinic.phones.map((p) => <a key={p} href={tel(p)}><Phone size={18} />{p}</a>)}
          <a href={`mailto:${clinic.email}`}><Mail size={18} />{clinic.email}</a>
        </div>
        <iframe className="map" title="Clinic location" src={clinic.map} loading="lazy" />
      </div>
      <div className="container copy">&copy; {new Date().getFullYear()} Dr Vel's Dentistry. All rights reserved.</div>
    </footer>
  )
}

export default function App() {
  const active = useScrollSpy(sectionIds)
  return (
    <>
      <AwardsStrip />
      <Navbar active={active} />
      <main>
        <Hero /><About /><Treatments /><Why /><Gallery /><Reviews /><Book />
      </main>
      <Footer />
    </>
  )
}
