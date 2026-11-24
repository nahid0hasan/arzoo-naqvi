const img = (name: string) => `/images/${name}.jpg`;

export const IMAGES = {
  // Chicago
  chicagoRiver: img("chicago-river"),
  chicagoAerial: img("chicago-aerial"),
  chicagoNight: img("chicago-night"),
  chicagoTheatre: img("chicago-theatre"),
  chicagoLasalle: img("chicago-lasalle"),
  lincolnParkWalk: img("lincoln-park-walk"),
  brownstoneStreet: img("brownstone-street"),
  greystoneDusk: img("greystone-dusk"),

  // Interiors
  penthouseSkyline: img("penthouse-skyline"),
  livingArched: img("living-arched"),
  goldCoastSalon: img("gold-coast-salon"),
  ArzooNaqviSell: img("arzoo-naqvi-sell-page"),
  lincolnParkKitchen: img("lincoln-park-kitchen"),
  westLoopLoft: img("west-loop-loft"),
  livingOpen: img("living-open"),
  livingWarm: img("living-warm"),
  livingLight: img("living-light"),
  ArzooNaqviBuy: img("arzoo-naqvi-buy-page"),
  livingBright: img("living-bright"),
  livingWindows: img("living-windows"),
  livingGray: img("living-gray"),
  bedroom: img("bedroom"),
  bedroom2: img("bedroom-2"),
  dining: img("dining"),
  kitchen: img("kitchen"),
  brickLoft: img("brick-loft"),

  // Exteriors
  modernDusk: img("modern-dusk"),
  modernCedar: img("modern-cedar"),
  modernWood: img("modern-wood"),
  facadeNight: img("facade-night"),
  farmhouse: img("farmhouse"),
  brickHouse: img("brick-house"),
  brickHouse2: img("brick-house-2"),
  porch: img("porch"),

  // People
  coupleKitchen: img("couple-kitchen"),
  portrait: img("portrait"), // TODO: replace with Arzoo's real headshot
  ArzooNaqviAboutMe: img("arzoo-naqvi-about-me"), // TODO: replace with Arzoo's real headshot
  ArzooNaqviHome: img("arzoo-naqvi-home-hero"), // TODO: replace with Arzoo's real headshot
} as const;

/* -------------------------------------------------------------------------- */
/* Listings — sample data shown until the MRED / IDX feed is connected.       */
/* -------------------------------------------------------------------------- */

export type PropertyType = 'House' | 'Condo' | 'Townhome' | 'Loft';

export interface Listing {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: PropertyType;
  status: 'For Sale' | 'New' | 'Open House';
  images: string[];
  description: string;
  features: string[];
  hoa?: number;
}

export const LISTINGS: Listing[] = [
  {
    id: 'orchard-st',
    address: '2140 N Orchard St',
    neighborhood: 'Lincoln Park',
    price: 1895000,
    beds: 4,
    baths: 3.5,
    sqft: 3650,
    type: 'House',
    status: 'New',
    images: [IMAGES.brownstoneStreet, IMAGES.lincolnParkKitchen, IMAGES.livingArched, IMAGES.bedroom],
    description:
      'Brick single-family on a quiet Lincoln Park block, a short walk to the zoo and the Armitage shops. Marble kitchen, walnut millwork and a private back garden.',
    features: ['Private garden', 'Two-car garage', 'Lincoln Elementary attendance area', 'Finished lower level'],
  },
  {
    id: 'fulton-market',
    address: '912 W Fulton Market, PH',
    neighborhood: 'West Loop',
    price: 1275000,
    beds: 3,
    baths: 2.5,
    sqft: 2480,
    type: 'Loft',
    status: 'Open House',
    images: [IMAGES.westLoopLoft, IMAGES.brickLoft, IMAGES.kitchen, IMAGES.bedroom2],
    description:
      'Top-floor timber loft with exposed beams, steel windows and skyline views west. Restaurant Row and the Morgan Green/Pink stop are around the corner.',
    features: ['Exposed timber and brick', 'Private roof deck', 'Deeded parking', 'In-unit laundry'],
    hoa: 685,
  },
  {
    id: 'astor-st',
    address: '1320 N Astor St, Unit 5',
    neighborhood: 'Gold Coast',
    price: 2350000,
    beds: 3,
    baths: 3,
    sqft: 3120,
    type: 'Condo',
    status: 'For Sale',
    images: [IMAGES.goldCoastSalon, IMAGES.dining, IMAGES.livingWarm, IMAGES.bedroom],
    description:
      'Full-floor residence in a pre-war building on Astor Street. Herringbone floors, a wood-burning fireplace and arched windows, two blocks from Oak Street Beach.',
    features: ['Full-floor layout', 'Wood-burning fireplace', 'Doorman building', 'Storage included'],
    hoa: 1450,
  },
  {
    id: 'kedzie-blvd',
    address: '2618 N Kedzie Blvd',
    neighborhood: 'Logan Square',
    price: 1420000,
    beds: 4,
    baths: 3.5,
    sqft: 3340,
    type: 'House',
    status: 'For Sale',
    images: [IMAGES.greystoneDusk, IMAGES.livingBright, IMAGES.kitchen, IMAGES.bedroom2],
    description:
      'Renovated greystone on the boulevard with cedar detailing, a lit stone patio and an open main floor. Close to the Blue Line and the farmers market.',
    features: ['Boulevard frontage', 'New mechanicals', 'Landscaped patio', 'Primary suite with walk-in'],
  },
  {
    id: 'huron-st',
    address: '415 W Huron St, Unit 2804',
    neighborhood: 'River North',
    price: 985000,
    beds: 2,
    baths: 2,
    sqft: 1790,
    type: 'Condo',
    status: 'New',
    images: [IMAGES.penthouseSkyline, IMAGES.livingOpen, IMAGES.bedroom, IMAGES.dining],
    description:
      'Corner unit on the 28th floor with floor-to-ceiling glass on two sides and a travertine fireplace wall. Full-amenity building near the Riverwalk.',
    features: ['Corner exposure', 'Pool and fitness center', '24-hour door staff', 'Parking available'],
    hoa: 920,
  },
  {
    id: 'hawthorne-pl',
    address: '642 W Hawthorne Pl',
    neighborhood: 'Lakeview',
    price: 1150000,
    beds: 3,
    baths: 2.5,
    sqft: 2560,
    type: 'Townhome',
    status: 'Open House',
    images: [IMAGES.lincolnParkWalk, IMAGES.livingLight, IMAGES.kitchen, IMAGES.bedroom2],
    description:
      'Limestone townhome on a tree-lined East Lakeview street, steps from Belmont Harbor and the lakefront trail. Bay windows and a south-facing terrace.',
    features: ['South-facing terrace', 'Attached garage', 'Bay windows', 'Near Belmont Harbor'],
    hoa: 250,
  },
  {
    id: 'wolcott-ave',
    address: '1918 N Wolcott Ave',
    neighborhood: 'Bucktown',
    price: 1675000,
    beds: 5,
    baths: 4.5,
    sqft: 4100,
    type: 'House',
    status: 'For Sale',
    images: [IMAGES.modernCedar, IMAGES.livingOpen, IMAGES.dining, IMAGES.bedroom],
    description:
      'New-construction modern with cedar cladding and a glass rear wall opening to the yard. A block from The 606 trail.',
    features: ['New construction', 'Heated garage with roof deck', 'Smart-home wiring', 'Near The 606'],
  },
  {
    id: 'oak-park',
    address: '725 N Kenilworth Ave',
    neighborhood: 'Oak Park',
    price: 869000,
    beds: 4,
    baths: 2.5,
    sqft: 2850,
    type: 'House',
    status: 'For Sale',
    images: [IMAGES.farmhouse, IMAGES.porch, IMAGES.livingGray, IMAGES.bedroom2],
    description:
      'Classic Oak Park home with a deep front porch, original woodwork and a large backyard. Walk to the Green Line and the Frank Lloyd Wright Historic District.',
    features: ['Wraparound porch', 'Original woodwork', 'Large yard', 'Two-car garage'],
  },
];

export const LISTING_NEIGHBORHOODS = Array.from(new Set(LISTINGS.map((l) => l.neighborhood))).sort();

/** Extra facts shown on the single property page. */
export const LISTING_FACTS: Record<string, { yearBuilt: number; taxes: number; parking: string; heating: string; mls: string }> = {
  'orchard-st': { yearBuilt: 1892, taxes: 31840, parking: '2-car garage', heating: 'Forced air, central A/C', mls: '12100001' },
  'fulton-market': { yearBuilt: 1910, taxes: 19420, parking: '1 deeded garage space', heating: 'Forced air, central A/C', mls: '12100002' },
  'astor-st': { yearBuilt: 1926, taxes: 38110, parking: 'Valet, leased', heating: 'Radiant, central A/C', mls: '12100003' },
  'kedzie-blvd': { yearBuilt: 1898, taxes: 22650, parking: '2-car garage', heating: 'Forced air, zoned A/C', mls: '12100004' },
  'huron-st': { yearBuilt: 2008, taxes: 17280, parking: '1 space, available', heating: 'Fan coil, central A/C', mls: '12100005' },
  'hawthorne-pl': { yearBuilt: 1905, taxes: 18960, parking: 'Attached 1-car garage', heating: 'Forced air, central A/C', mls: '12100006' },
  'wolcott-ave': { yearBuilt: 2025, taxes: 26300, parking: '2-car heated garage', heating: 'Zoned forced air, central A/C', mls: '12100007' },
  'oak-park': { yearBuilt: 1912, taxes: 21480, parking: '2-car detached garage', heating: 'Hot water radiators, mini-split A/C', mls: '12100008' },
};

/* -------------------------------------------------------------------------- */
/* Blog                                                                       */
/* -------------------------------------------------------------------------- */

export type Block = { type: 'p'; text: string } | { type: 'h2'; text: string } | { type: 'ul'; items: string[] } | { type: 'quote'; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Buying' | 'Selling' | 'Neighborhoods' | 'Market';
  date: string;
  readTime: number;
  image: string;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: 'cost-of-buying-a-home-in-chicago',
    title: 'What it really costs to buy a home in Chicago',
    excerpt: 'Down payment is only the start. Here’s every cost to plan for, from attorney fees to transfer taxes.',
    category: 'Buying',
    date: '2026-11-12',
    readTime: 6,
    image: IMAGES.livingWarm,
    body: [
      { type: 'p', text: 'Most buyers budget carefully for the down payment, then get surprised by everything else. Knowing the full picture up front makes it easier to shop with confidence and negotiate well.' },
      { type: 'h2', text: 'Down payment' },
      { type: 'p', text: 'Conventional loans can start at 3–5% down and FHA loans at 3.5%. Many Chicago condo buildings and competitive sellers prefer to see 10–20%. Putting down less than 20% usually means paying private mortgage insurance until you build equity.' },
      { type: 'h2', text: 'Closing costs' },
      { type: 'p', text: 'Plan on roughly 2–4% of the purchase price. That typically covers:' },
      { type: 'ul', items: ['Lender fees and prepaid interest', 'Appraisal and home inspection', 'Title insurance and escrow fees', 'Your real estate attorney', 'Your share of Chicago’s city transfer tax, where the buyer pays the larger portion'] },
      { type: 'h2', text: 'Property taxes are paid in arrears' },
      { type: 'p', text: 'Cook County property taxes are billed a year behind. At closing the seller usually credits you for their share, so you’ll want to set that credit aside for the next bill rather than spend it.' },
      { type: 'quote', text: 'A good rule of thumb: have your down payment, closing costs and three months of payments saved before you make an offer.' },
      { type: 'h2', text: 'After you move in' },
      { type: 'p', text: 'Budget for movers, utility deposits, HOA move-in fees for condos and a small fund for the first repairs. We’ll run your exact numbers together before you start touring.' },
    ],
  },
  {
    slug: 'condo-vs-single-family-chicago',
    title: 'Condo or single-family? How to choose in Chicago',
    excerpt: 'HOA dues, special assessments and rental rules can make or break a condo purchase. What to check first.',
    category: 'Buying',
    date: '2026-10-28',
    readTime: 5,
    image: IMAGES.penthouseSkyline,
    body: [
      { type: 'p', text: 'Chicago gives you more choice than most cities: lakefront high-rises, vintage courtyard buildings, two-flats, greystones and new construction. The right fit comes down to lifestyle, budget and how long you plan to stay.' },
      { type: 'h2', text: 'Why buyers choose condos' },
      { type: 'ul', items: ['Lower purchase price in prime neighborhoods', 'Exterior maintenance handled by the association', 'Amenities like door staff, gyms and roof decks'] },
      { type: 'h2', text: 'What to check before you offer' },
      { type: 'p', text: 'In Illinois, sellers provide a 22.1 disclosure with the association’s finances, reserves, pending assessments and rules. Read it closely, and pay attention to:' },
      { type: 'ul', items: ['Reserve fund strength and recent special assessments', 'Rental caps and pet policies', 'Upcoming projects like roofs, masonry or elevators', 'How much of the monthly assessment covers heat and other utilities'] },
      { type: 'h2', text: 'Why buyers choose single-family' },
      { type: 'p', text: 'More space, a yard, no association rules and full control over renovations. The trade-off is maintenance and usually a higher price per neighborhood. Two-flats are a popular middle ground, with rental income from the second unit.' },
    ],
  },
  {
    slug: 'getting-your-home-ready-to-sell',
    title: 'Getting your home ready to sell: what’s worth doing',
    excerpt: 'Small, inexpensive updates often return more than big renovations. Here’s where to spend and where to save.',
    category: 'Selling',
    date: '2026-10-15',
    readTime: 5,
    image: IMAGES.livingArched,
    body: [
      { type: 'p', text: 'Buyers decide how they feel about a home within the first few photos. The goal of prep isn’t perfection. It’s helping buyers picture themselves living there.' },
      { type: 'h2', text: 'Worth doing' },
      { type: 'ul', items: ['Fresh, neutral paint in main rooms', 'Brighter bulbs and updated light fixtures', 'Decluttering closets, counters and shelves', 'Small repairs: caulk, grout, doors that stick', 'A deep clean, including windows'] },
      { type: 'h2', text: 'Usually not worth it' },
      { type: 'p', text: 'Full kitchen or bath remodels rarely pay back their cost right before a sale, and buyers often want to choose finishes themselves. A pre-listing inspection can be smarter: you’ll know about issues before a buyer’s inspector finds them.' },
      { type: 'quote', text: 'Spend on what shows in photos and what a buyer’s inspector will flag. Skip the rest.' },
      { type: 'p', text: 'When we walk through your home, I’ll give you a prioritized list and connect you with painters, cleaners and stagers I trust.' },
    ],
  },
  {
    slug: 'attorney-review-illinois-explained',
    title: 'Attorney review in Illinois, explained',
    excerpt: 'Your offer is accepted. Now what? A plain-English guide to the attorney review period.',
    category: 'Buying',
    date: '2026-09-30',
    readTime: 4,
    image: IMAGES.dining,
    body: [
      { type: 'p', text: 'In the Chicago area, buyers and sellers each typically hire a real estate attorney. Once an offer is accepted, the contract enters attorney review, a short window where either attorney can propose changes or cancel.' },
      { type: 'h2', text: 'How long does it last?' },
      { type: 'p', text: 'The standard Chicago-area contract gives the attorneys five business days, though it’s often extended by agreement. Inspection usually happens during this same window.' },
      { type: 'h2', text: 'What gets negotiated' },
      { type: 'ul', items: ['Repair requests or credits after inspection', 'Closing date and possession', 'Contract language and contingencies'] },
      { type: 'p', text: 'Once both attorneys sign off, the contract is firm. I’ll coordinate with your attorney throughout, so you always know where things stand.' },
    ],
  },
  {
    slug: 'lincoln-park-vs-lakeview',
    title: 'Lincoln Park vs. Lakeview: which fits you?',
    excerpt: 'Two of the North Side’s most popular neighborhoods, side by side: homes, prices, pace and parks.',
    category: 'Neighborhoods',
    date: '2026-09-14',
    readTime: 5,
    image: IMAGES.lincolnParkWalk,
    body: [
      { type: 'p', text: 'They sit right next to each other and both have the lake, the parks and the L. But they feel different block to block, and the housing stock is different too.' },
      { type: 'h2', text: 'Lincoln Park' },
      { type: 'p', text: 'Quieter residential streets, more single-family homes and Victorian rowhouses, the zoo and conservatory, and DePaul’s campus. Prices for houses tend to run higher, especially in the Lincoln Elementary area.' },
      { type: 'h2', text: 'Lakeview' },
      { type: 'p', text: 'A wider mix of courtyard condos, two-flats and townhomes, with a livelier feel near Wrigley Field and the Southport Corridor and calmer pockets in East Lakeview. Often more space for the money.' },
      { type: 'h2', text: 'How to decide' },
      { type: 'ul', items: ['Spend a Saturday morning and a weeknight evening in each', 'Time your commute from both', 'Compare school attendance boundaries if that matters to you'] },
      { type: 'p', text: 'Happy to give you a tour of both. It’s one of my favorite drives in the city.' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Neighborhoods                                                              */
/* -------------------------------------------------------------------------- */

export interface Neighborhood {
  id: string;
  name: string;
  short: string;
  description: string;
  homes: string;
  transit: string;
  highlights: string[];
  image: string;
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'lincoln-park',
    name: 'Lincoln Park',
    short: 'Zoo, lakefront and tree-lined side streets.',
    description:
      'One of the city’s most loved neighborhoods, built around the 1,200-acre park of the same name. Quiet residential blocks sit minutes from Armitage and Halsted shopping and the North Avenue beach.',
    homes: 'Victorian rowhouses, greystones, vintage condos',
    transit: 'Red, Brown and Purple Lines at Fullerton',
    highlights: ['Lincoln Park Zoo and Conservatory', 'Armitage and Halsted shops', 'DePaul University'],
    image: IMAGES.brownstoneStreet,
  },
  {
    id: 'lakeview',
    name: 'Lakeview',
    short: 'Lake access with a real neighborhood feel.',
    description:
      'From Wrigleyville to the quieter streets of East Lakeview, this is a neighborhood of courtyard buildings, family-friendly blocks and the boutiques of the Southport Corridor.',
    homes: 'Courtyard condos, townhomes, two-flats',
    transit: 'Red, Brown and Purple Lines at Belmont',
    highlights: ['Belmont Harbor', 'Southport Corridor', 'Wrigley Field'],
    image: IMAGES.lincolnParkWalk,
  },
  {
    id: 'west-loop',
    name: 'West Loop',
    short: 'Warehouse lofts and the city’s best dining.',
    description:
      'Former warehouses and meatpacking buildings turned into lofts, offices and some of Chicago’s best-known restaurants. Fulton Market and Randolph Street set the pace.',
    homes: 'Timber lofts, new high-rises, townhomes',
    transit: 'Green and Pink Lines at Morgan',
    highlights: ['Randolph Restaurant Row', 'Fulton Market', 'Mary Bartelme Park'],
    image: IMAGES.westLoopLoft,
  },
  {
    id: 'river-north',
    name: 'River North',
    short: 'High-rise living along the river.',
    description:
      'Galleries, design showrooms and nightlife, with full-amenity towers lining the north bank of the river. You can walk to the Loop, the Mag Mile and the Riverwalk.',
    homes: 'High-rise condos, boutique buildings',
    transit: 'Red, Brown and Purple Lines',
    highlights: ['Chicago Riverwalk', 'Gallery district', 'Merchandise Mart'],
    image: IMAGES.chicagoRiver,
  },
  {
    id: 'gold-coast',
    name: 'Gold Coast',
    short: 'Historic mansions and Oak Street Beach.',
    description:
      'Landmark mansions on Astor Street, pre-war co-ops along the lake, and Oak Street’s boutiques. It is quiet, central and close to the water.',
    homes: 'Pre-war co-ops, mansions, luxury high-rises',
    transit: 'Red Line at Clark/Division',
    highlights: ['Astor Street District', 'Oak Street Beach', 'Oak Street boutiques'],
    image: IMAGES.goldCoastSalon,
  },
  {
    id: 'logan-square',
    name: 'Logan Square',
    short: 'Boulevards, greystones and great coffee.',
    description:
      'Wide landscaped boulevards, restored greystones and an independent food and music scene. The Sunday farmers market and The 606 trail are local favorites.',
    homes: 'Greystones, two-flats, new construction',
    transit: 'Blue Line at Logan Square',
    highlights: ['Logan Square Farmers Market', 'Historic boulevards', 'The 606 trail'],
    image: IMAGES.greystoneDusk,
  },
];

/* -------------------------------------------------------------------------- */
/* Client manager (private /dashboard)                                        */
/* -------------------------------------------------------------------------- */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Buyer' | 'Seller' | 'Buyer & Seller' | 'Past client';
  notes: string;
  added: string;
}

export const EXAMPLE_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Maya Patel',
    email: 'maya@example.com',
    phone: '(312) 555-0142',
    type: 'Buyer',
    notes: '3-bed in Lincoln Park or Lakeview, pre-approved.',
    added: '2026-11-14',
  },
  {
    id: 'c2',
    name: 'Daniel Brooks',
    email: 'daniel@example.com',
    phone: '(312) 555-0188',
    type: 'Seller',
    notes: 'West Loop loft, wants to list in spring.',
    added: '2026-11-16',
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    email: 'elena@example.com',
    phone: '(312) 555-0194',
    type: 'Buyer',
    notes: 'Relocating from NYC, Gold Coast.',
    added: '2026-11-18',
  },
  {
    id: 'c4',
    name: 'Marcus & Hannah Lee',
    email: 'lee@example.com',
    phone: '(312) 555-0127',
    type: 'Buyer & Seller',
    notes: 'Selling Logan Square townhome, buying single-family.',
    added: '2026-11-19',
  },
];
