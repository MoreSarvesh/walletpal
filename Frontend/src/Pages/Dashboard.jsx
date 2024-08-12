//rrd functions
import { Link, useLocation, useNavigate } from "react-router-dom";

//libraries
import { toast } from "react-toastify";

//components
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";

//component
const Dashboard = () => {
  const { data, setData } = useData();

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //gettting budgets
    const getBudgets = async () => {
      try {
        const response = await axiosPrivate.get("budgets/list");
        //console.log("Budget response: ", response.data.data);
        setData((prev) => ({ ...prev, budgets: response.data.data }));
      } catch (error) {
        console.log("Budget Error: ", error);
        if (error?.response?.status === 403)
          navigate("/", { state: { from: location }, replace: true });
      }
    };

    //getting expenses
    const getExpenses = async () => {
      try {
        const response = await axiosPrivate.get("expenses/");
        //console.log("Expenses response: ", response.data.data);
        setData((prev) => ({ ...prev, expenses: response.data.data }));
      } catch (error) {
        console.log("Expenses Error:", error);
        if (error?.response?.status === 403)
          navigate("/", { state: { from: location }, replace: true });
      }
    };

    getBudgets();
    getExpenses();
  }, []);

  //console.log("My budgets: ", data.budgets);
  //console.log("My expenses: ", data?.expenses);

  return (
    <div className="dashboard">
      <h1>
        Welcome back, <span className="accent">{auth.username}</span>
      </h1>
      {data?.budgets && data?.budgets.length > 0 ? (
        <div className="grid-lg">
          <div className="flex-lg">
            <AddBudgetForm budgetLength={data.budgets.length} />
            <AddExpenseForm budgets={data?.budgets} />
          </div>
          <h2>Existing Budgets</h2>
          <div className="budgets">
            {data?.budgets?.map((item) => {
              const expenses = data?.expenses?.filter(
                (expense) => expense["b_id"] === item.id
              );

              //console.log("ee: ", expenses);

              return (
                <BudgetItem
                  key={item.id}
                  budgetItem={item}
                  expenseItem={expenses}
                />
              );
            })}
          </div>
          {data?.expenses && data?.expenses.length > 0 && (
            <div className="grid-md">
              <h2>Recent expenses</h2>
              <Table
                expenses={data?.expenses
                  .sort((a, b) =>
                    new Date(b["created_at"]) < new Date(a["created_at"])
                      ? -1
                      : 1
                  )
                  .slice(0, 8)}
              />
              {data?.expenses.length > 8 && (
                <Link className="btn btn--dark" to="expenses">
                  View all
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid-sm">
          <p>Create a Budget to get started!</p>
          <AddBudgetForm budgetLength={0} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
