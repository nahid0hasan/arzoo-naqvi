import { monthlyPayment } from './format';

export const MORTGAGE_TERMS = [30, 20, 15] as const;

export const MORTGAGE_LIMITS = {
  homePrice: { min: 100_000, max: 5_000_000 },
  annualInterestRate: { min: 0, max: 10 },
  downPaymentPercent: { min: 0, max: 100 },
  annualPMIRate: { min: 0, max: 5 },
} as const;

const MAX_FINANCIAL_AMOUNT = Number.MAX_SAFE_INTEGER;

export type MortgageTerm = (typeof MORTGAGE_TERMS)[number];

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermYears: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
  monthlyHOA: number;
  annualPMIRate: number;
}

export type MortgageErrors = Partial<Record<keyof MortgageInputs, string>>;

export interface MortgageCalculation {
  loanAmount: number;
  downPaymentPercent: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyHOA: number;
  monthlyPMI: number;
  totalMonthlyPayment: number;
  totalMortgagePayments: number;
  totalInterest: number;
}

export function validateMortgageInputs(inputs: MortgageInputs): MortgageErrors {
  const errors: MortgageErrors = {};
  const nonNegativeFields: [keyof MortgageInputs, number, string][] = [
    ['downPayment', inputs.downPayment, 'Enter a valid down payment.'],
    ['annualPropertyTax', inputs.annualPropertyTax, 'Enter a valid annual property tax.'],
    ['annualHomeInsurance', inputs.annualHomeInsurance, 'Enter a valid annual insurance amount.'],
    ['monthlyHOA', inputs.monthlyHOA, 'Enter a valid monthly HOA amount.'],
    ['annualPMIRate', inputs.annualPMIRate, 'Enter a valid annual PMI rate.'],
  ];

  if (!Number.isFinite(inputs.homePrice)) {
    errors.homePrice = 'Enter a valid home price.';
  } else if (
    inputs.homePrice < MORTGAGE_LIMITS.homePrice.min ||
    inputs.homePrice > MORTGAGE_LIMITS.homePrice.max
  ) {
    errors.homePrice = `Enter a price from $${MORTGAGE_LIMITS.homePrice.min.toLocaleString()} to $${MORTGAGE_LIMITS.homePrice.max.toLocaleString()}.`;
  }

  if (!Number.isFinite(inputs.annualInterestRate)) {
    errors.annualInterestRate = 'Enter a valid interest rate.';
  } else if (
    inputs.annualInterestRate < MORTGAGE_LIMITS.annualInterestRate.min ||
    inputs.annualInterestRate > MORTGAGE_LIMITS.annualInterestRate.max
  ) {
    errors.annualInterestRate = `Enter a rate from ${MORTGAGE_LIMITS.annualInterestRate.min}% to ${MORTGAGE_LIMITS.annualInterestRate.max}%.`;
  }

  for (const [field, value, message] of nonNegativeFields) {
    if (!Number.isFinite(value) || value < 0) errors[field] = message;
    else if (value > MAX_FINANCIAL_AMOUNT) errors[field] = 'Amount is too large to calculate safely.';
  }

  if (
    Number.isFinite(inputs.annualPMIRate) &&
    (inputs.annualPMIRate < MORTGAGE_LIMITS.annualPMIRate.min ||
      inputs.annualPMIRate > MORTGAGE_LIMITS.annualPMIRate.max)
  ) {
    errors.annualPMIRate = `Enter a PMI rate from ${MORTGAGE_LIMITS.annualPMIRate.min}% to ${MORTGAGE_LIMITS.annualPMIRate.max}%.`;
  }

  if (
    Number.isFinite(inputs.homePrice) &&
    Number.isFinite(inputs.downPayment) &&
    inputs.downPayment > inputs.homePrice
  ) {
    errors.downPayment = 'Down payment cannot exceed the home price.';
  }

  if (!MORTGAGE_TERMS.some((term) => term === inputs.loanTermYears)) {
    errors.loanTermYears = 'Choose a supported loan term.';
  }

  return errors;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageCalculation {
  const errors = validateMortgageInputs(inputs);
  if (Object.keys(errors).length > 0) {
    throw new RangeError(Object.values(errors).join(' '));
  }

  const loanAmount = inputs.homePrice - inputs.downPayment;
  const downPaymentPercent = (inputs.downPayment / inputs.homePrice) * 100;
  const monthlyPrincipalAndInterest = monthlyPayment(
    loanAmount,
    inputs.annualInterestRate,
    inputs.loanTermYears,
  );
  const monthlyPropertyTax = inputs.annualPropertyTax / 12;
  const monthlyHomeInsurance = inputs.annualHomeInsurance / 12;
  const monthlyPMI =
    downPaymentPercent < 20 ? (loanAmount * (inputs.annualPMIRate / 100)) / 12 : 0;
  const totalMonthlyPayment =
    monthlyPrincipalAndInterest +
    monthlyPropertyTax +
    monthlyHomeInsurance +
    inputs.monthlyHOA +
    monthlyPMI;
  const totalMortgagePayments = monthlyPrincipalAndInterest * inputs.loanTermYears * 12;

  const result = {
    loanAmount,
    downPaymentPercent,
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    monthlyHOA: inputs.monthlyHOA,
    monthlyPMI,
    totalMonthlyPayment,
    totalMortgagePayments,
    totalInterest: Math.max(0, totalMortgagePayments - loanAmount),
  };
  if (!Object.values(result).every(Number.isFinite)) {
    throw new RangeError('Mortgage inputs exceed the supported calculation range.');
  }
  return result;
}
