import axios from "axios";

//generate random colors
const generateRamdomColors = () => {
  const exisitingBudggetLen = fetchData("budgets")?.length ?? 0;
  return `${exisitingBudggetLen * 34} 65% 50%`;
};

//loacal storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

//delete item
export const deleteItem = ({ key, id }) => {
  if (id) {
    const exisitingItems = fetchData(key);
    const newData = exisitingItems.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

//create budget
export const createBudget = ({ name, amount }) => {
  const newBudget = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount, //convert str to num
    color: generateRamdomColors(),
  };

  const existingBudget = fetchData("budgets") ?? []; //Nullish coalescing operator
  localStorage.setItem(
    "budgets",
    JSON.stringify([...existingBudget, newBudget])
  );
};

//create expense
export const createExpense = ({ name, amount, budgetId }) => {
  const newExpense = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount, //convert str to num
    budgetId: budgetId,
  };

  const existingExpense = fetchData("expenses") ?? [];
  localStorage.setItem(
    "expenses",
    JSON.stringify([...existingExpense, newExpense])
  );
};

//total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    if (expense.budgetId !== budgetId) return acc;
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};

export const formatDateToLocalString = (epoch) =>
  new Date(epoch).toLocaleDateString();
