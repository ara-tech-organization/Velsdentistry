// Copy from the client brief: "Dr Vel's Dentistry - Clear Aligner Landing Page" (page URL /clear-aligners/).
export const clinic = {
  name: "Dr Vel's Dentistry",
  phones: ['+91 98849 19289', '+91 96553 22266', '+91 98598 55533'],
  email: 'drvelsdentistry@gmail.com',
  whatsapp: 'https://wa.me/919655322266',
  address: 'No.225/3A, Sekarams Grandium, Perumbakkam Main Road, Nookampalayam, Chennai - 600100',
  map: 'https://maps.google.com/maps?q=Dr%20Vel%27s%20Dentistry%2C%20Perumbakkam%20Main%20Rd%2C%20Chennai&t=m&z=14&output=embed',
  social: {
    facebook: 'https://www.facebook.com/drvelsdentistry/',
    instagram: 'https://www.instagram.com/dr.vels_dentistry/',
  },
}

// Optional: set to a form endpoint (Formspree, Google Apps Script, CRM webhook) to POST leads as JSON.
// While empty, a valid enquiry opens WhatsApp with the details pre-filled so no lead is lost.
export const formEndpoint = ''

// Top menu: [label, section id]. 'home' is the hero and lead form.
export const nav = [
  ['Options', 'options'], ['Compare', 'compare'], ['Why Us', 'why'],
  ['Journey', 'journey'], ['Gallery', 'gallery'], ['FAQs', 'faq'], ['Contact', 'contact'],
]
// Page order, used by the scroll spy.
export const sectionIds = ['home', ...nav.map(([, id]) => id)]

export const hero = {
  h1: 'Clear Aligners in Chennai',
  headline: 'Straighten Your Teeth with a More Discreet Smile Solution.',
  text: "Explore Invisalign and other clear aligner treatment options at Dr Vel's Dentistry. Discover a personalised approach to teeth alignment based on your dental needs.",
  trust: [
    ['BadgeCheck', 'Invisalign Provider'],
    ['Clock', '20+ Years of Experience'],
    ['HeartHandshake', 'Personalised Dental Care'],
  ],
}

export const form = {
  heading: 'Book Your Clear Aligner Consultation',
  concernLabel: 'What is your dental concern?',
  concerns: [
    'Gaps Between Teeth',
    'Crowded or Overlapping Teeth',
    'Crooked Teeth',
    'Teeth Alignment Correction',
    'Not Sure – Need Guidance',
  ],
  submit: 'BOOK MY CONSULTATION',
  success: 'Thank you for your enquiry! Our team will contact you shortly.',
}

export const options = {
  heading: 'Explore Your Clear Aligner Options',
  text: [
    'Discover modern clear aligner solutions designed to gradually align your teeth with a discreet and removable treatment approach.',
    "At Dr Vel's Dentistry, we offer Invisalign and other suitable clear aligner systems based on your dental condition and treatment requirements.",
  ],
  points: [
    ['Sparkles', 'Invisalign Treatment'],
    ['Layers', 'Other Clear Aligner Systems'],
    ['ClipboardList', 'Personalised Treatment Planning'],
  ],
  cta: 'EXPLORE YOUR OPTIONS',
}

export const compare = {
  heading: 'Metal Braces or Clear Aligners?',
  text: 'Both options help address teeth alignment concerns. Understand their differences before choosing your treatment.',
  braces: {
    title: 'Metal Braces',
    points: [
      'Fixed brackets and wires',
      'More visible during treatment',
      'Remain attached to teeth',
      'Require additional cleaning around brackets',
      'Can address many complex cases',
    ],
  },
  aligners: {
    title: 'Clear Aligners',
    points: [
      'Transparent removable trays',
      'More discreet appearance',
      'Removable during meals',
      'Easier routine brushing and flossing',
      'Suitable for selected cases',
    ],
  },
  closing: 'Not sure which treatment is suitable for you? Our dental team can help you understand your options following a clinical assessment.',
  cta: 'BOOK A CONSULTATION',
}

export const why = {
  heading: 'Your Smile. Our Personalised Care.',
  text: "Experience personalised dental care with modern technology and treatment planning at Dr Vel's Dentistry.",
  stats: [
    ['CalendarClock', 20, '+', 'Years of Dental Experience'],
    ['Stethoscope', 1, ' Lakh+', 'Successful Procedures'],
    ['Users', 15, 'K+', 'Happy Families'],
  ],
  award: { year: '2025', label: 'Famdent Clinic of the Year Award' },
}

export const journey = {
  heading: 'Your Smile Journey in 4 Steps',
  steps: [
    ['MessageCircle', 'Consultation', 'Discuss your teeth alignment concerns.'],
    ['ScanLine', 'Digital Scan & Assessment', 'Understand your dental condition and treatment suitability.'],
    ['ClipboardList', 'Personalised Treatment Plan', 'Explore the aligner system and treatment plan suitable for you.'],
    ['CalendarCheck', 'Treatment & Monitoring', 'Begin your treatment with regular dental follow-ups.'],
  ],
}

// Add genuine, consented patient cases here: { title, before: 'img/case1-before.jpg', after: 'img/case1-after.jpg' }.
// Until the clinic supplies photos, the carousel shows labelled placeholders.
export const gallery = {
  heading: 'Smile Transformations',
  text: 'Explore actual patient cases and their clear aligner treatment journeys.',
  cases: [],
  slots: 3,
}

export const faqs = [
  ['What are clear aligners?', 'Clear aligners are transparent, removable trays designed to gradually move teeth into planned positions.'],
  ['Is Invisalign the only clear aligner option?', 'No. Invisalign is one clear aligner system. Other aligner options may also be available depending on individual treatment requirements.'],
  ['Are clear aligners better than metal braces?', 'Both have advantages. The suitable option depends on your dental condition, alignment complexity and clinical assessment.'],
  ['Who can get clear aligner treatment?', 'Clear aligners may be suitable for certain alignment concerns. A dental assessment is required to determine eligibility.'],
  ['How long does clear aligner treatment take?', 'Treatment duration varies depending on the complexity of the case and individual treatment plan.'],
  ['How much does clear aligner treatment cost?', 'The cost depends on the treatment complexity and aligner system. Contact our clinic for a consultation and cost discussion.'],
]

export const final = {
  headline: 'Ready to Explore Your Smile Options?',
  text: "Take the first step towards understanding your teeth alignment options with personalised dental care at Dr Vel's Dentistry.",
}
