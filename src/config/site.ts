/**
 * Everything the client may want to change lives here:
 * contact details, links and where form submissions are sent.
 */
export const SITE = {
  name: 'Arzoo Naqvi',
  title: 'Realtor',
  city: 'Chicago, IL',
  brokerage: 'Brokerage Name', // TODO: replace with Arzoo's brokerage
  license: 'Illinois Licensed Real Estate Broker',

  // TODO: replace with real details before launch
  phone: '(312) 555-0100',
  phoneHref: 'tel:+13125550100',
  smsHref: 'sms:+13125550100',
  email: 'hello@arzoonaqvi.com',

  // Links to Arzoo's profiles. Leave '' to hide a link.
  zillowProfile: 'https://www.zillow.com/homes/Chicago,-IL_rb/',
  zillowReviews: 'https://www.zillow.com/professionals/real-estate-agent-reviews/chicago-il/',
  instagram: 'https://www.instagram.com/',
  linkedin: 'https://www.linkedin.com/',
  facebook: 'https://www.facebook.com/',

  /**
   * Where forms are delivered. Works with Web3Forms, Formspree, Getform or
   * any endpoint that accepts a JSON POST. Example (Web3Forms):
   *   formEndpoint: 'https://api.web3forms.com/submit'
   *   formAccessKey: '<your access key>'
   * While empty, submissions are kept in this browser and shown in /dashboard.
   */
  formEndpoint: '',
  formAccessKey: '',

  /** Optional homepage background video (mp4). Leave '' to use the photo slideshow. */
  heroVideo: '',
};
