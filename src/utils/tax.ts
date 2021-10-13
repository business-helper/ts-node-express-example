import { TaxRuleItem } from '../types';
import { incomeTaxRule } from '../constants';

export function rounding(src: number, pos: number = 0): number {
  // The ATO have a crazy rule where values above 0.159 are rounded up.
  const threshold = 0.159;

  const exp = Math.pow(10, pos);
  const temp = src * exp;
  const fraction = temp - Math.floor(temp);
  return (fraction > threshold ? temp + 1 : temp) / exp;
}

/**
 * @name getIncomeTaxe
 * @description get tax for the basic income.
 * @param { number } income amount of income($)
 * @return { number } returns the tax rate(%)
 */
export function getIncomeTax(income: number): number {
  income = Math.floor(income);
  return incomeTaxRule
    .filter((rule: TaxRuleItem) => rule.from <= income || rule.to <= income)
    .reduce((sum, rule) => sum + (Math.min(income, rule.to) - rule.from) * rule.rate / 100, 0);
}

/**
 * @name getMedicareTax
 * @description get tax for medicare levey surcharge
 * @param { number } income amount of income($)
 * @return { number } returns the medicare tax
 */
export function getMedicareTax(income: number): number {
  if (income <= 21336) {
    return 0;
  } else if (income > 21336 && income <= 26668) {
    return rounding((income - 21336) * 0.1, 2);
  } else {
    return rounding(income * 0.02, 2);
  }
}

/**
 * @name getSuperAnnuation
 * @description get the amount of superannuation.
 * @param { number } income the amount of income.
 * @return { number } the amount of supperannuation.
 */
export function getSuperannuation(income: number): number {
  return rounding(income * 0.095, 2);
}
