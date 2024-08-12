const { Router } = require("express");
const {
  getBudgets,
  addBudget,
  deleteBudget,
} = require("../controllers/budget.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");

const router = Router();

//protected routes
router.get("/list", verifyJWT, getBudgets);
router.post("/add", verifyJWT, addBudget);
router.post("/delete", verifyJWT, deleteBudget);

module.exports = router;
