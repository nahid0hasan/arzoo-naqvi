export const TAX_SOURCES = {
  irsSellingYourHome: {
    label: 'Selling Your Home (Publication 523)',
    href: 'https://www.irs.gov/publications/p523',
  },
  irsSaleOfHome: {
    label: 'Sale of Your Home (Tax Topic 701)',
    href: 'https://www.irs.gov/taxtopics/tc701',
  },
  irsHomeownerTaxInfo: {
    label: 'Tax Information for Homeowners (Publication 530)',
    href: 'https://www.irs.gov/publications/p530',
  },
  irsMortgageInterest: {
    label: 'Home Mortgage Interest (Publication 936)',
    href: 'https://www.irs.gov/publications/p936',
  },
  irsPropertySales: {
    label: 'Sales and Other Dispositions of Assets (Publication 544)',
    href: 'https://www.irs.gov/publications/p544',
  },
  illinoisTransferTax: {
    label: 'Illinois Real Estate Transfer Tax',
    href: 'https://tax.illinois.gov/research/taxinformation/property/rett.html',
  },
  illinoisIncomeTax: {
    label: 'Illinois Individual Income Tax',
    href: 'https://tax.illinois.gov/research/taxinformation/income/individual.html',
  },
  illinoisTaxableIncome: {
    label: 'Illinois Taxable Income',
    href: 'https://tax.illinois.gov/individuals/taxableincome.html',
  },
  chicagoTransferTax: {
    label: 'Chicago Real Property Transfer Tax',
    href: 'https://chicago.gov/city/en/depts/fin/supp_info/revenue/tax_list/real_property_transfertax.html',
  },
  cookCountyCode: {
    label: 'Cook County Code of Ordinances',
    href: 'https://library.municode.com/il/cook_county/codes/code_of_ordinances',
  },
  cookCountyAssessor: {
    label: 'Cook County Assessor',
    href: 'https://www.cookcountyassessor.com/',
  },
  cookCountyTreasurer: {
    label: 'Cook County Treasurer',
    href: 'https://www.cookcountytreasurer.com/',
  },
} as const;

export const TAX_RESOURCE_GROUPS = [
  {
    title: 'Federal',
    links: [
      TAX_SOURCES.irsSellingYourHome,
      TAX_SOURCES.irsSaleOfHome,
      TAX_SOURCES.irsHomeownerTaxInfo,
      TAX_SOURCES.irsMortgageInterest,
      TAX_SOURCES.irsPropertySales,
    ],
  },
  {
    title: 'Illinois',
    links: [
      TAX_SOURCES.illinoisTransferTax,
      TAX_SOURCES.illinoisIncomeTax,
      TAX_SOURCES.illinoisTaxableIncome,
    ],
  },
  {
    title: 'Chicago & Cook County',
    links: [
      TAX_SOURCES.chicagoTransferTax,
      TAX_SOURCES.cookCountyCode,
      TAX_SOURCES.cookCountyAssessor,
      TAX_SOURCES.cookCountyTreasurer,
    ],
  },
] as const;
