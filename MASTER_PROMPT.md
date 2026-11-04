# MASTER PROMPT: Dr Vel's Dentistry Landing Page

## 1. Role
You are a senior front-end engineer and UI designer. Build a clean, modern, single-page landing page for **Dr Vel's Dentistry** (family and kids' dental clinic, Perumbakkam, Chennai). Reuse the live site's imagery and colour identity (https://drvelsdentistry.com/), and use the copy from the client brief (section 9). The result should feel calmer, cleaner and more premium than the existing WordPress site.

## 2. Stack (existing project)
- Vite + React 19 in this folder (`src/App.jsx`, `src/App.css`, `src/index.css`).
- Icons: `lucide-react` (install it). No other icon sets.
- Font: **Poppins** only (Google Fonts: 300, 400, 500, 600, 700). No fallback to Segoe UI.
- Animation: CSS transitions plus IntersectionObserver reveal, or `framer-motion` if it keeps the code simpler. No heavy animation libraries beyond that.
- **No emojis anywhere**: not in copy, buttons, headings, alt text, or code comments. Use Lucide icons instead.

## 3. Colour theme (black and yellow, from the live site)
Only two hues: black and yellow, with white and warm-cream neutrals. Define as CSS variables in `:root`.

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#f1bf0a` | Buttons, highlights, icons on dark, stars |
| `--primary-dark` | `#cda405` | Hover, links on light, borders |
| `--ink` / `--dark` | `#111111` | Headings, text on yellow, dark bands, footer |
| `--text` | `#3f3f46` | Body text |
| `--surface` | `#faf7ee` | Alternate section backgrounds |
| `--border` | `#e5e0cf` | Dividers, card outlines |

Rules: yellow buttons always carry black text; never put yellow text on white. Use black sections (awards strip, features, booking, footer) for contrast. Soft shadows, 16-24px radii.

## 4. Images (fetch from the live site, do not invent)
Base: `https://drvelsdentistry.com/wp-content/uploads/`. Download them into `src/assets/img/` (or `public/img/`) so the page does not hotlink. Add proper `alt` text and `loading="lazy"` (not on the hero).

- Logo: `2025/08/cropped-LOGO-COREL-DRAW-2-scaled-1.png`; footer logo: `2025/08/logo-png.png`
- Director portrait: `2025/08/about-us-img.png`
- Treatments:
  - Geriatric: `2025/08/Geriatric-dentistry.png`
  - Pediatric: `2025/08/Pediatric-Dentistry.png`
  - Aligners and Braces: `2025/08/aligners-Braces.png`
  - Implant: `2024/03/img3.png`
  - Root Canal: `2024/03/img1.png`
  - Laser: `2024/03/img6.png`
  - Tooth Whitening: `2024/03/img7.png`
  - Crowns and Bridges: `2024/03/img4.png`
  - Wisdom Tooth Removal: `2024/03/img13.png`
  - Smile Design: `2024/03/img10.png`
  - Gum Treatment: `2024/03/img11.png`
  - Complete Denture: `2024/03/img12.png`
- Awards leaflet: `2025/08/leaflet-scaled.jpg`
- Team photo: `2025/08/1-1.jpeg`
- Phone icon: `2025/08/logo_phone-1.png` (replace with Lucide `Phone`)

Verify each URL returns 200 and check the visual crop before use. Use `object-fit: cover` with consistent aspect ratios (treatment cards 4:3, portrait 4:5, team 16:9). If an image is low resolution, give it a smaller frame rather than upscaling it.

## 5. Page structure (in order)
1. **Sticky navbar**: logo, links (Home, About, Treatments, Reviews, Gallery, Contact), "Book Appointment" button, WhatsApp icon link. Becomes translucent with blur after scrolling. Mobile: slide-in drawer.
2. **Awards strip**: slim marquee of award lines (Service Excellence Award in Kids & Family Dental Care 2024, Clinic of the Year Famdent 2025, Most Awarded Dental Clinic). Lucide `Award`.
3. **Hero**: headline, sub-copy, two CTAs (Book Appointment, Call Now), three animated stat counters (20+ Years, 1L+ Procedures, 15K+ Happy Families).
4. **From the Clinical Director**: portrait plus message from Dr Sakthivel Rajendran, "Expertise, Experience & Ethics" as three icon pills.
5. **Treatments**: 12 cards in a responsive grid (4/3/2/1 columns). Image, title, one-line description, "View More" with arrow.
6. **Why Dr Vel's**: four feature cards (AI-assisted diagnosis, full-mouth digital X-ray, intraoral scanner, mobile dental van) with Lucide icons.
7. **Awards and Excellence**: leaflet image with a lightbox, award list.
8. **Team**: team photo with a short caption.
9. **Google Reviews**: rating summary (121 reviews) plus a horizontally scrolling review carousel. Do not fabricate reviews; use only the real ones from the site or the brief.
10. **Appointment CTA and form**: "Ready for your perfect smile?" with First Name, Last Name, Phone, Email, Message. Inline validation, success state.
11. **Contact and footer**: three phone numbers, email, Perumbakkam address, map link, social links (Facebook, Instagram, WhatsApp), copyright. Fix the site's "Kinds & Family" typo to "Kids & Family".

## 6. Typography
Poppins throughout. Scale: H1 `clamp(2.4rem, 5vw, 4rem)` weight 700; H2 `clamp(1.8rem, 3.5vw, 2.75rem)` weight 600; H3 1.25rem weight 600; body 1rem/1.7 weight 400; small caps labels 0.8rem weight 500 with letter-spacing 0.08em. Max line length about 65 characters.

## 7. Layout and UI rules
- 12-column grid, container max-width 1200px, 24px mobile gutter, 96px section vertical padding (64px mobile).
- Alternate white and `--surface` sections for rhythm; one dark `--dark` section at most.
- Cards: white, 20px radius, 1px `--border`, soft shadow, hover lifts 6px.
- Buttons: pill shape, primary filled blue, secondary outlined; 48px minimum height; visible focus ring.
- Lucide icons at 20-24px, stroke width 1.75, in `--primary`, inside soft circular tinted backgrounds.
- Fully responsive: test at 360, 768, 1024, 1440px. No horizontal scroll.

## 8. Animation (smooth, purposeful, varied)
- Page-load: hero text staggers up (opacity and translateY 24px, 700ms, `cubic-bezier(0.22, 1, 0.36, 1)`).
- Scroll reveal on every section using IntersectionObserver, with varied directions: headings fade-up, images clip-path wipe or scale-in from 1.08, cards stagger 80ms.
- Stat counters count up once when visible.
- Treatment card hover: image zoom 1.06, arrow slides right, border turns primary.
- Navbar: blur and shadow on scroll; underline slide on link hover.
- Awards marquee: continuous slow linear scroll, pauses on hover.
- Subtle floating motion on hero decorative shapes (blurred blue circles).
- Buttons: gentle press scale 0.97, shine sweep on primary.
- Respect `prefers-reduced-motion`: disable all of the above except opacity fades.
- Animate only `transform` and `opacity`. Keep it 60fps.

## 9. Content source (client brief)
Source: Google Doc `11FoTevb8KeGjdmvuuzDmR7RcQmtUdsfYgUCeoXhydr0` (private; could not be fetched).
**Paste the document text below before running this prompt.** The brief wins over the live site wherever they differ (headlines, descriptions, phone numbers, address, review text).

```
[PASTE GOOGLE DOC CONTENT HERE]
```

## 10. Quality bar and deliverables
- Semantic HTML, one `h1`, labelled form fields, alt text, keyboard-navigable, AA contrast.
- Components split by section under `src/components/`; content kept in `src/data/content.js`, not hard-coded in JSX.
- SEO: title, meta description, Open Graph tags, `LocalBusiness` / `Dentist` JSON-LD with address and phones.
- Lighthouse targets: Performance 90+, Accessibility 95+. Images compressed, WebP where possible.
- Run `npm run lint` and `npm run build` with no errors.
- Do not use emojis, other fonts, other icon libraries, or invented claims, awards, or reviews.

## 11. Working order
1. Install `lucide-react`; add Poppins and the CSS variables.
2. Download and verify images.
3. Build the layout and sections with content from section 9.
4. Add animations.
5. Responsive pass, accessibility pass, then lint and build.
