// @ts-nocheck — ported from Glaura; case data kept exact under this project's stricter TS.
// @ts-nocheck — ported from Glaura; case data kept exact under this project's stricter TS.
export type CaseMetric = {
  label: string
  value: string
}

export type CasePage = {
  id: string
  title: string
  subtitle: string
  category: string
  accent: string
  image: string
  video?: string
  cta: string
  headlineStyle?: 'serif' | 'sans'
  pageNumber: string
  domain: string
  description: string
  metrics: CaseMetric[]
  isMobile?: boolean
  cropTop?: number
  cropBottom?: number
}

export type Spread = {
  id: string
  left: 'contents' | CasePage
  right: CasePage
}

export const CASES: CasePage[] = [
  {
    id: 'marketplace',
    title: 'See the look.\nBook the look.',
    subtitle: 'Marketplace',
    category: 'CONSUMER APP',
    accent: '#D8285C',
    image: '/images/page2.png',
    cta: 'Explore marketplace',
    headlineStyle: 'sans',
    pageNumber: '02',
    domain: 'glaura.ai',
    description:
      'Video-first beauty discovery platform connecting viral looks directly to instant salon bookings with verified stylists.',
    metrics: [
      { label: 'Video Catalog', value: '10,000+' },
      { label: 'Booking Speed', value: '3 Taps' },
    ],
  },
  {
    id: 'laura',
    title: 'From messages to\nbooked appointments.',
    subtitle: 'Laura AI',
    category: 'AI ASSISTANT',
    accent: '#D8285C',
    image: '/images/page3.png',
    cta: 'Explore Laura AI',
    headlineStyle: 'sans',
    pageNumber: '04',
    domain: 'laura.glaura.ai',
    description:
      'Laura AI turns Instagram and WhatsApp enquiries into salon bookings.',
    metrics: [
      { label: 'Auto-Booking', value: '84%' },
      { label: 'Response Time', value: '< 30s' },
    ],
  },
  {
    id: 'sp_agenda',
    title: 'See through complexity.\nRun every chair.',
    subtitle: 'Team Agenda',
    category: 'SP DASHBOARD · AGENDA',
    accent: '#D8285C',
    image: '/images/page4.png',
    cta: 'Open Team Agenda',
    headlineStyle: 'sans',
    pageNumber: '06',
    domain: 'pro.glaura.ai/agenda',
    description:
      'Real-time multi-staff scheduling console with instant slot reservation, stylist color-coding, and live appointment tracking across the salon.',
    metrics: [
      { label: 'Stylist Roster', value: '6 Team' },
      { label: 'Rebooking Speed', value: '1-Tap' },
    ],
    cropBottom: 48,
  },
  {
    id: 'sp_booking',
    title: 'Precision checkout.\nZero no-shows.',
    subtitle: 'Reservation File',
    category: 'SP PANEL · RESERVATIONS',
    accent: '#D8285C',
    image: '/images/page5.png',
    cta: 'View Booking File',
    headlineStyle: 'sans',
    pageNumber: '08',
    domain: 'pro.glaura.ai/reservations',
    description:
      'Comprehensive appointment file detailing client contact card, multi-service breakdowns, automated Stripe deposits, and direct in-salon cashier.',
    metrics: [
      { label: 'Stripe Deposit', value: '10%' },
      { label: 'Direct Cashier', value: '189€' },
    ],
    cropBottom: 48,
  },
  {
    id: 'sp_catalog',
    title: 'Curate menus.\nSell in seconds.',
    subtitle: 'Service Catalog',
    category: 'SP PANEL · CATALOGUE',
    accent: '#D8285C',
    image: '/images/page6.png',
    cta: 'Manage Prestations',
    headlineStyle: 'sans',
    pageNumber: '10',
    domain: 'pro.glaura.ai/categories',
    description:
      'Granular beauty service matrix managing prices, sub-categories, duration, multi-tier add-ons, and instant online booking toggling.',
    metrics: [
      { label: 'Prestations', value: '5 Live' },
      { label: 'Dynamic Pricing', value: 'Tiered' },
    ],
    cropTop: 36,
    cropBottom: 48,
  },
  {
    id: 'sp_channels',
    title: 'Connect messages.\nFill every slot.',
    subtitle: 'Laura AI Channels',
    category: 'AI HUB · OMNICHANNEL',
    accent: '#D8285C',
    image: '/images/page7.png',
    cta: 'Connect Social Accounts',
    headlineStyle: 'sans',
    pageNumber: '12',
    domain: 'pro.glaura.ai/laura/reglages',
    description:
      'Centralized Instagram Business & WhatsApp Business integration empowering Laura AI to answer inquiries and dispatch direct booking links 24/7.',
    metrics: [
      { label: 'Channels', value: 'IG & WhatsApp' },
      { label: 'Conversion', value: 'Direct Link' },
    ],
    cropBottom: 48,
  },
  {
    id: 'sp_white_label',
    title: 'Your salon. Your style.\nYour booking experience.',
    subtitle: 'White Label Booking',
    category: 'WHITE LABEL BOOKING',
    accent: '#D8285C',
    image: '/images/page8.png',
    cta: 'Explore online booking',
    headlineStyle: 'sans',
    pageNumber: '14',
    domain: 'pro.glaura.ai/parametres/marque-blanche',
    description:
      'A branded booking experience, seamlessly inside your website.',
    metrics: [
      { label: 'Compatibility', value: 'WP · Shopify · Wix' },
      { label: 'Live Theme', value: 'Custom Hex' },
    ],
    cropBottom: 48,
  },
  {
    id: 'sp_occupancy',
    title: 'Track capacity.\nMaximize revenue.',
    subtitle: 'Occupancy Reports',
    category: 'INTELLIGENCE · RAPPORTS',
    accent: '#D8285C',
    image: '/images/page9.png',
    cta: 'Inspect Salon Reports',
    headlineStyle: 'sans',
    pageNumber: '16',
    domain: 'pro.glaura.ai/admin/reports',
    description:
      'Granular team utilization metrics tracking hours worked vs reserved, capacity bottlenecks, and hourly occupancy heatmaps for the salon.',
    metrics: [
      { label: 'Team Workload', value: 'Hourly Heatmap' },
      { label: 'Salon Roster', value: '38h Total' },
    ],
    cropTop: 36,
    cropBottom: 48,
  },
  {
    id: 'sp_payouts',
    title: 'Instant payouts.\nClear accounts.',
    subtitle: 'Stripe Connect',
    category: 'FINANCE · VIREMENTS',
    accent: '#D8285C',
    image: '/images/page10.png',
    cta: 'Open Stripe Dashboard',
    headlineStyle: 'sans',
    pageNumber: '18',
    domain: 'pro.glaura.ai/parametres/virements',
    description:
      'Integrated Stripe Connect financial dashboard managing salon IBAN details, automated daily transfers, and real-time transaction balance.',
    metrics: [
      { label: 'Stripe Connect', value: 'Active' },
      { label: 'Bank Transfers', value: 'Daily IBAN' },
    ],
    cropBottom: 48,
  },
  {
    id: 'retention',
    title: 'Clients who\ncome back.',
    subtitle: 'Marketing & Relance',
    category: 'GROWTH ENGINE · MARKETING',
    accent: '#D8285C',
    image: '/images/page11.png',
    cta: 'Launch Campaigns',
    headlineStyle: 'sans',
    pageNumber: '20',
    domain: 'pro.glaura.ai/marketing',
    description:
      'Predictive re-engagement engine analyzing individual client cadences to send timely reminders before appointment expiration.',
    metrics: [
      { label: 'Rebooking Cadence', value: '-18 Days' },
      { label: 'Retention Lift', value: '+38%' },
    ],
    cropBottom: 48,
  },
  {
    id: 'mix',
    title: 'Every layer\ntells a story.',
    subtitle: 'Mix Beauty',
    category: 'FLAGSHIP SALON',
    accent: '#D8285C',
    image: '/images/page12.png',
    cta: 'Visit Mix Beauty',
    headlineStyle: 'sans',
    pageNumber: '22',
    domain: 'mixbeauty.com',
    description:
      'Comprehensive digital salon experience designed for textured hair care, bespoke cosmetic treatments, and flagship boutique bookings.',
    metrics: [
      { label: 'Online Bookings', value: '+54%' },
      { label: 'Bounce Rate', value: '-27%' },
    ],
  },
  {
    id: 'sacree',
    title: 'Beauty, booked\nin Paris.',
    subtitle: 'Sacrée Paris',
    category: 'LUXURY SALON',
    accent: '#D8285C',
    image: '/images/page13.png',
    cta: 'Explore Sacrée Paris',
    headlineStyle: 'sans',
    pageNumber: '24',
    domain: 'sacree-paris.fr',
    description:
      'Haute-couture digital presence blending Paris editorial aesthetics with signature treatment cards and exclusive membership privileges.',
    metrics: [
      { label: 'Member Growth', value: '2.4x' },
      { label: 'Average Basket', value: '+32%' },
    ],
  },
  {
    id: 'shine',
    title: 'From reel\nto reservation.',
    subtitle: 'Shine Salon',
    category: 'BOUTIQUE STUDIO',
    accent: '#D8285C',
    image: '/images/page14.png',
    cta: 'Visit Shine Salon',
    headlineStyle: 'sans',
    pageNumber: '26',
    domain: 'shine-beaute.fr',
    description:
      'Dynamic social-first portfolio for boutique textured hair specialists with real-time stylist availability and immediate checkout.',
    metrics: [
      { label: 'Social Bookings', value: '3.2x' },
      { label: 'Client Rating', value: '4.9 ★' },
    ],
  },
]

export const SPREADS: Spread[] = [
  { id: 'toc', left: 'contents', right: CASES[0] },
  { id: 'core', left: CASES[1], right: CASES[2] },
  { id: 'booking', left: CASES[3], right: CASES[4] },
  { id: 'channels', left: CASES[5], right: CASES[6] },
  { id: 'finance', left: CASES[7], right: CASES[8] },
  { id: 'growth', left: CASES[9], right: CASES[10] },
  { id: 'studios', left: CASES[11], right: CASES[12] },
]

export const CONTENTS_ITEMS = [
  { name: 'Marketplace', category: 'CONSUMER APP', spread: 0, page: '02', desc: 'Video beauty discovery & instant booking' },
  { name: 'Laura AI', category: 'AI ASSISTANT', spread: 1, page: '04', desc: 'Instagram & WhatsApp enquiries to bookings' },
  { name: 'Team Agenda', category: 'SP OPERATIONS', spread: 1, page: '06', desc: 'Real-time multi-staff scheduling console' },
  { name: 'Smart Booking', category: 'SP CASHIER', spread: 2, page: '08', desc: 'Client card, Stripe deposit & direct checkout' },
  { name: 'Service Matrix', category: 'SP CATALOGUE', spread: 2, page: '10', desc: 'Prestations catalog & dynamic pricing' },
  { name: 'Omnichannel Hub', category: 'SP MESSAGING', spread: 3, page: '12', desc: 'Instagram & WhatsApp AI booking links' },
  { name: 'White Label Booking', category: 'SP EMBED', spread: 3, page: '14', desc: 'Branded booking experience for any website' },
  { name: 'Occupancy Reports', category: 'SP ANALYTICS', spread: 4, page: '16', desc: 'Hourly capacity heatmap & team utilization' },
  { name: 'Stripe Payouts', category: 'SP FINANCE', spread: 4, page: '18', desc: 'Stripe Connect, IBAN transfers & balances' },
  { name: 'Relance Auto', category: 'GROWTH ENGINE', spread: 5, page: '20', desc: 'Automated client cadence retention' },
  { name: 'Mix Beauty', category: 'FLAGSHIP SALON', spread: 5, page: '22', desc: 'Textured hair & beauty digital experience' },
  { name: 'Sacrée Paris', category: 'LUXURY SALON', spread: 6, page: '24', desc: 'Haute-couture aesthetics & private booking' },
  { name: 'Shine Salon', category: 'BOUTIQUE STUDIO', spread: 6, page: '26', desc: 'Social-first salon portfolio & reservations' },
]
