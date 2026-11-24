import { TAX_RESOURCE_GROUPS } from '../data/taxResources';
import { Eyebrow } from './ui';

const TAX_TOPICS = [
  {
    title: 'Federal capital gains tax',
    text: 'A potential gain is generally the amount realized from the sale (sale price less allowable selling expenses) minus the home’s adjusted basis. It is not the full sale price. Whether a gain is taxable depends on factors such as holding period, income, filing status, ownership, use, and any available exclusion. Short-term and long-term gains are treated differently; there is no single rate for every seller.',
  },
  {
    title: 'Primary residence gain exclusion',
    text: 'Eligible sellers may be able to exclude up to $250,000 of gain, or up to $500,000 for qualifying married couples filing jointly. Generally, the ownership and use tests require at least two years during the five-year period ending on the sale date, and a recent exclusion on another home may limit eligibility. Joint filers have additional rules. Exceptions and partial exclusions may apply; eligibility is not automatic.',
  },
  {
    title: 'Illinois income tax',
    text: 'A taxable real-estate gain may affect Illinois individual income tax, depending on the seller’s return and circumstances. Illinois generally starts with federal adjusted gross income and applies state additions or subtractions. This is distinct from federal capital-gains treatment and from transfer taxes. The home’s entire gross sale price is not automatically Illinois taxable income.',
  },
  {
    title: 'Illinois, Cook County & Chicago transfer taxes',
    text: 'These are separate transaction taxes, not recurring property taxes. Illinois and Cook County have their own rules; no state or county rate is quoted here. For Chicago property, the City currently lists a $3.75-per-$500 City portion and a $1.50-per-$500 CTA portion; it generally assigns $3.75 to the buyer and $1.50 to the seller. Exemptions apply, and Chicago rules do not cover every suburb. Confirm the parcel, statutory responsibility, and contract allocation with the closing team.',
  },
  {
    title: 'Property-tax proration at closing',
    text: 'Property-tax bills may cover a period before the bill is issued, so a sale can close while some taxes remain unpaid. The purchase contract and closing statement determine how the buyer and seller divide the relevant period, including any credit or unpaid balance. Prorations are not based on one universal percentage, and the adjustment can change the seller’s proceeds.',
  },
  {
    title: 'Adjusted basis & selling expenses',
    text: 'A home’s basis generally starts with its purchase price and may include certain qualifying acquisition costs and capital improvements, subject to adjustments. Allowable selling expenses may reduce the amount realized. Improvements generally add value, extend useful life, or adapt the home to a new use; routine repairs and maintenance usually do not qualify as improvements. Keep receipts and closing records—expenses are not automatically deductible.',
  },
  {
    title: 'Rental & investment properties',
    text: 'A rental or investment sale may involve capital gains and tax treatment related to depreciation, and the primary-residence exclusion may be limited by how and when the property was used. A Section 1031 exchange may defer gain for qualifying investment or business real estate if strict rules are followed; it does not automatically erase tax and generally does not apply to an ordinary personal residence. Other taxes may depend on income and facts.',
  },
  {
    title: 'Tax reporting & professional guidance',
    text: 'Reporting depends on whether gain is taxable, whether an exclusion applies, whether Form 1099-S was issued, and the applicable federal and Illinois rules. Receiving a form does not by itself determine the tax due. Keep sale and basis records, and use current IRS and state guidance to determine whether a return or form is required.',
  },
] as const;

export function SellerTaxInformation() {
  return (
    <section id="tax-information" className="scroll-mt-20 py-20 sm:py-28">
      <div className="wrap">
        <div className="rounded-3xl border border-stone bg-white p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <Eyebrow>Seller resources</Eyebrow>
            <h2 className="h-section">Understanding Taxes When Selling Your Home</h2>
            <p className="lead mt-5 text-muted">
              Selling a property involves more than determining its market value. Understanding potential taxes,
              exemptions, and closing-related obligations can help you make informed financial decisions before
              selling your home in Chicago.
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 md:grid-cols-2">
            {TAX_TOPICS.map((topic, index) => (
              <article key={topic.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-stone py-6">
                <span className="num pt-0.5 text-xs font-medium text-bronze">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="h-card">{topic.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{topic.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-stone pt-6">
            <p className="text-sm leading-relaxed text-muted">
              This information is provided for general educational purposes only and does not constitute tax, legal,
              or financial advice. Tax obligations and exemptions vary based on property location, ownership history,
              filing status, and individual circumstances. Please consult a qualified tax professional or real estate
              attorney for guidance specific to your situation.
            </p>
            <p className="mt-3 text-xs text-muted">
              Tax content reviewed November 24, 2026. Chicago transfer-tax figures above reflect the City’s official
              guidance reviewed on that date; state and Cook County rates are not quoted here.
            </p>
          </div>

          <details className="group mt-6 border-t border-stone pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bronze [&::-webkit-details-marker]:hidden">
              Official tax resources
              <span className="text-sm font-normal text-muted">Federal, Illinois & local</span>
            </summary>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {TAX_RESOURCE_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-medium text-ink">{group.title}</h3>
                  <ul className="mt-3 space-y-2.5">
                    {group.links.map((resource) => (
                      <li key={resource.href}>
                        <a
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm leading-relaxed text-muted underline decoration-stone underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                        >
                          {resource.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
