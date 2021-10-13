import express, { Request, Response } from "express";

import { reverseWords, sortWords } from "../utils";
import {
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
      res.set("Content-Type", "application/json").status(200).send(reversed)
    )
    .catch((error) => res.status(400).send(error.message));
});

router.route("/sort-words").get((req: Request, res: Response) => {
  const sentence = req.query?.sentence as string;
  return Promise.resolve(sortWords(sentence || ""))
    .then((sorted: string) =>
      res.set("Content-Type", "application/json").status(200).send(sorted)
    )
    .catch((error) => res.status(400).send(error.message));
});

router
  .route("/calculate-after-tax-income")
  .get((req: Request, res: Response) => {
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
          .set("Content-Type", "application/json")
          .status(200)
          .send({
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

export default router;
