export const BUYING_LINKS = [
  { label: 'Search homes', to: '/buy#search' },
  { label: 'Mortgage calculator', to: '/buy#mortgage' },
  { label: 'How buying works', to: '/buy#process' },
  { label: 'Buyer questions', to: '/buy#faq' },
] as const;

export const SELLING_LINKS = [
  { label: 'What’s my home worth?', to: '/sell#valuation' },
  { label: 'Net proceeds calculator', to: '/sell#net-proceeds' },
  { label: 'Seller checklist', to: '/sell#checklist' },
  { label: 'How selling works', to: '/sell#process' },
] as const;

export const COLUMNS = [
  { title: 'Buying', links: BUYING_LINKS },
  { title: 'Selling', links: SELLING_LINKS },
  {
    title: 'Chicago',
    links: [
      { label: 'Lincoln Park', to: '/chicago/lincoln-park' },
      { label: 'West Loop', to: '/chicago/west-loop' },
      { label: 'Gold Coast', to: '/chicago/gold-coast' },
      { label: 'All neighborhoods', to: '/chicago' },
      { label: 'Blog', to: '/blog' },
    ],
  },
] as const;
