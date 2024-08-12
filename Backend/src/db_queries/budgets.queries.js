const getAllBudgets = "SELECT * FROM budgets WHERE u_id = $1";

const insertBudget =
  " INSERT INTO budgets (name, created_at, amount, color, u_id) VALUES ($1, $2, $3, $4, $5)";

const getBudgetId = "SELECT id FROM budgets WERE name = $1";

const preRemoveBudget = "DELETE FROM expences WHERE b_id = $1";

const removeBudget = "DELETE FROM budgets WHERE id = $1";

module.exports = {
  getAllBudgets,
  insertBudget,
  removeBudget,
  getBudgetId,
  preRemoveBudget,
};
