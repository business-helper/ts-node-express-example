import express, { Request, Response } from "express";

import { reverseWords, sortWords } from "../utils";
import {
  estimateBaseSalary,
  getIncomeTax,
  getMedicareTax,
  getSuperannuation,
  rounding,
} from "../utils/tax";

const router = express.Router();

router.route("/reverse-words").get((req: Request, res: Response) => {
  const sentence = req.query?.sentence as string;
  return Promise.resolve(reverseWords(sentence || ""))
    .then((reversed: string) =>
      res.status(200).json(reversed)
    )
    .catch((error) => res.status(400).send(error.message));
});

router.route("/sort-words").get((req: Request, res: Response) => {
  const sentence = req.query?.sentence as string;
  return Promise.resolve(sortWords(sentence || ""))
    .then((sorted: string) =>
      res.status(200).json(sorted)
    )
    .catch((error) => res.status(400).send(error.message));
});

router.route("/calculate-after-tax-income").get((req: Request, res: Response) => {
  const baseSalary = parseInt(req.query.annualBaseSalary as string, 10);
  return Promise.all([
    getIncomeTax(baseSalary),
    getMedicareTax(baseSalary),
    getSuperannuation(baseSalary),
  ])
    .then(([incomeTax, medicareTax, superannuation]: number[]) => {
      // const incomeTax = rounding(incomeTaxRate * baseSalary / 100);
      const totalTax = rounding(incomeTax + medicareTax);
      return res
        .status(200)
        .json({
          baseSalary,
          superannuation,
          taxes: {
            income: incomeTax,
            medicare: medicareTax,
            total: totalTax,
          },
          postTaxIncome: baseSalary - totalTax,
        });
    })
    .catch();
});

router.route("/calculate-pre-tax-income-from-take-home").get((req: Request, res: Response) => {
  const postTaxSalary = parseInt(req.query.postTaxSalary as string, 10);
  return Promise.resolve(estimateBaseSalary(postTaxSalary))
    .then((baseSalary) => {
      const incomeTax = getIncomeTax(baseSalary);
      const medicareTax = getMedicareTax(baseSalary);
      const superannuation = getSuperannuation(baseSalary);

      const totalTax = rounding(incomeTax + medicareTax);
      return res
        .status(200)
        .json({
          baseSalary,
          superannuation,
          taxes: {
            income: rounding(incomeTax),
            medicare: medicareTax,
            total: totalTax,
          },
          postTaxIncome: baseSalary - totalTax,
        });
    })
    .catch((error) => {
      console.log('[Error]', error);
      return res.json({status: false, message: error.message});
    })
});

export default router;
