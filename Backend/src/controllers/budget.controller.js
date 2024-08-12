const pool = require("../dbConnection.js");

//querie imports
const {
  getAllBudgets,
  insertBudget,
  removeBudget,
  preRemoveBudget,
} = require("../db_queries/budgets.queries.js");
const { getAllExpenses } = require("../db_queries/expenses.queries.js");
const { getUserId } = require("../db_queries/users.queries.js");

//list all budgets
const getBudgets = async (req, res) => {
  console.log("requesting user: ", req.user);

  const uid = await pool.query(getUserId, [req.user]);
  if (!uid.rowCount) return res.status(500).json({ error: "user not found!" });

  pool.query(getAllBudgets, [uid.rows[0].id], (error, result) => {
    if (error) {
      console.log("error:", error);
      return res.status(500).json({ error: error });
    }
    return res.status(200).json({ data: result.rows });
  });
};

//add a budget
const addBudget = async (req, res) => {
  const { name, amount, color } = req.body;

  const uid = await pool.query(getUserId, [req.user]);
  if (!uid.rowCount) return res.status(500).json({ error: "user not found!" });

  const date = new Date();
  const createdAt = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  console.log(createdAt);

  try {
    await pool.query(insertBudget, [
      name,
      createdAt,
      amount,
      color,
      uid.rows[0].id,
    ]);
    const updatedBudgets = await pool.query(getAllBudgets, [uid.rows[0].id]);
    return res
      .status(200)
      .json({ message: ` ${name} budget created`, data: updatedBudgets.rows });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ error: error });
  }
};

//delete a budget
const deleteBudget = async (req, res) => {
  const { id } = req.body;

  try {
    await pool.query(preRemoveBudget, [id]);
    await pool.query(removeBudget, [id]);

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
    return res.status(201).json({
      message: "budget deleted",
      data: { budgets: allUsersBudgets, expenses: userExpenses },
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = { getBudgets, addBudget, deleteBudget };
