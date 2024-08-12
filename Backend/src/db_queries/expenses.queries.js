const getAllExpenses = "SELECT * FROM expences";

const insertExpense =
  " INSERT INTO expences (name, created_at, amount, b_id) VALUES ($1, $2, $3, $4)";

const getExpenseId = "SELECT id FROM expences WERE name = $1";

const removeExpense = "DELETE FROM expences WHERE id = $1";

module.exports = {
  getAllExpenses,
  insertExpense,
  removeExpense,
  getExpenseId,
};
