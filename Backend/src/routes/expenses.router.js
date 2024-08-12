const { Router } = require("express");
const verifyJWT = require("../middleware/auth.middleware.js");
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require("../controllers/expense.controller.js");

const router = Router();

//protected routes
router.get("/", verifyJWT, getExpenses);
router.post("/add", verifyJWT, addExpense);
router.post("/delete", verifyJWT, deleteExpense);

module.exports = router;
