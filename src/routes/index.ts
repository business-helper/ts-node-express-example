import express, { Request, Response } from "express";

import { reverseWords, sortWords } from "../utils";

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

export default router;
