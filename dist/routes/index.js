"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var utils_1 = require("../utils");
var tax_1 = require("../utils/tax");
var router = express_1.default.Router();
router.route("/reverse-words").get(function (req, res) {
    var _a;
    var sentence = (_a = req.query) === null || _a === void 0 ? void 0 : _a.sentence;
    return Promise.resolve((0, utils_1.reverseWords)(sentence || ""))
        .then(function (reversed) {
        return res.set("Content-Type", "application/json").status(200).send(reversed);
    })
        .catch(function (error) { return res.status(400).send(error.message); });
});
router.route("/sort-words").get(function (req, res) {
    var _a;
    var sentence = (_a = req.query) === null || _a === void 0 ? void 0 : _a.sentence;
    return Promise.resolve((0, utils_1.sortWords)(sentence || ""))
        .then(function (sorted) {
        return res.set("Content-Type", "application/json").status(200).send(sorted);
    })
        .catch(function (error) { return res.status(400).send(error.message); });
});
router.route("/calculate-after-tax-income").get(function (req, res) {
    var baseSalary = parseInt(req.query.annualBaseSalary, 10);
    return Promise.all([
        (0, tax_1.getIncomeTax)(baseSalary),
        (0, tax_1.getMedicareTax)(baseSalary),
        (0, tax_1.getSuperannuation)(baseSalary),
    ])
        .then(function (_a) {
        var incomeTax = _a[0], medicareTax = _a[1], superannuation = _a[2];
        // const incomeTax = rounding(incomeTaxRate * baseSalary / 100);
        var totalTax = (0, tax_1.rounding)(incomeTax + medicareTax);
        return res
            .status(200)
            .json({
            baseSalary: baseSalary,
            superannuation: superannuation,
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
router.route("/calculate-pre-tax-income-from-take-home").get(function (req, res) {
    var postTaxSalary = parseInt(req.query.postTaxSalary, 10);
    return Promise.resolve((0, tax_1.estimateBaseSalary)(postTaxSalary))
        .then(function (baseSalary) {
        var incomeTax = (0, tax_1.getIncomeTax)(baseSalary);
        var medicareTax = (0, tax_1.getMedicareTax)(baseSalary);
        var superannuation = (0, tax_1.getSuperannuation)(baseSalary);
        var totalTax = (0, tax_1.rounding)(incomeTax + medicareTax);
        return res
            .status(200)
            .json({
            baseSalary: baseSalary,
            superannuation: superannuation,
            taxes: {
                income: (0, tax_1.rounding)(incomeTax),
                medicare: medicareTax,
                total: totalTax,
            },
            postTaxIncome: baseSalary - totalTax,
        });
    })
        .catch(function (error) {
        console.log('[Error]', error);
        return res.json({ status: false, message: error.message });
    });
});
exports.default = router;
