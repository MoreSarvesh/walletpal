//rrd imports
import { redirect, useLoaderData, useParams } from "react-router-dom";

//components
import BudgetItem from "../components/BudgetItem";
import AddExpenseForm from "../components/AddExpenseForm";
import Table from "../components/Table";

//library
import { toast } from "react-toastify";
import useData from "../hooks/useData";

const Budget = () => {
  const { data } = useData();
  const { id } = useParams();

  const budget = data.budgets.filter((budget) => budget.id === +id);
  const expenses = data.expenses.filter((expense) => expense["b_id"] === +id);

  return (
    <div className="grid-lg" style={{ "--accent": budget.color }}>
      <h1 className="h2">
        <span className="accent">Budget Overview</span>
      </h1>
      <div className="flex-lg">
        <BudgetItem
          budgetItem={budget[0]}
          expenseItem={expenses}
          showDelete={true}
        />
        <AddExpenseForm budgets={budget} />
        {expenses && expenses.length > 0 && (
          <div className="grid-md">
            <h2>
              <span className="accent">{budget.name}</span> Expenses
            </h2>
            <Table expenses={expenses} showBudget={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
