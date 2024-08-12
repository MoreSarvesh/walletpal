const pool = require("../dbConnection.js");
const { getAllBudgets } = require("../db_queries/budgets.queries.js");
const {
  getAllExpenses,
  insertExpense,
  removeExpense,
} = require("../db_queries/expenses.queries.js");
const { getUserId } = require("../db_queries/users.queries.js");

//list all expenses
const getExpenses = async (req, res) => {
  pool.query(getAllExpenses, (error, result) => {
    if (error) {
      console.log("error:", error);
      return res.status(500).json({ error: error });
    }
    return res.status(200).json({ data: result.rows });
  });
};

//add a expense
const addExpense = async (req, res) => {
  const { name, amount, bid } = req.body;

  const date = new Date();
  const createdAt = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  console.log("created at : ", createdAt);

  try {
    await pool.query(insertExpense, [name, createdAt, amount, bid]);

    const updatedExpenses = await pool.query(getAllExpenses);

    const uid = await pool.query(getUserId, [req.user]);
    if (!uid.rowCount)
      return res.status(500).json({ error: "user not found!" });
    const allBudgets = await pool.query(getAllBudgets, [uid.rows[0].id]);

    const allUsersBudgets = allBudgets.rows;
    const allUsersExpenses = updatedExpenses.rows;

    let map = new Map();
    allUsersBudgets.forEach((budget) => map.set(budget.id, true));

    const userExpenses = allUsersExpenses.filter((expense) =>
      map.has(expense["b_id"])
    );

    return res
      .status(201)
      .json({ message: ` ${name} expense added`, data: userExpenses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

//delete a expense
const deleteExpense = async (req, res) => {
  const { id } = req.body;

  try {
    await pool.query(removeExpense, [id]);

    const uid = await pool.query(getUserId, [req.user]);
    if (!uid.rowCount)
      return res.status(500).json({ error: "user not found!" });

    const allBudgets = await pool.query(getAllBudgets, [uid.rows[0].id]);
    const updatedExpenses = await pool.query(getAllExpenses);

    const allUsersBudgets = allBudgets.rows;
    const allUsersExpenses = updatedExpenses.rows;

    let map = new Map();
    allUsersBudgets.forEach((budget) => map.set(budget.id, true));

    const userExpenses = allUsersExpenses.filter((expense) =>
      map.has(expense["b_id"])
    );

    //console.log("User expense: ", userExpenses);

    return res
      .status(201)
      .json({ message: "expense deleted", data: userExpenses });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = { deleteExpense, addExpense, getExpenses };
