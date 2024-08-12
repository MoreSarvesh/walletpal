import { Form, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useData from "../hooks/useData";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const BudgetItem = ({ budgetItem, expenseItem, showDelete = false }) => {
  const { id, name, amount, color } = budgetItem;

  const { setData } = useData();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  //console.log(name + ": ", expenseItem);
  let spent = 0;
  if (expenseItem?.length >= 1) {
    spent = expenseItem?.reduce((acc, exp) => {
      //console.log("add: ", acc + exp.amount);

      return acc + exp.amount;
    }, 0);
  }
  //console.log(spent);

  const remaining = amount - spent;

  const handelDelete = async (e) => {
    e.preventDefault();

    try {
      console.log("deleting: ", id);

      const response = await axiosPrivate.post(
        "budgets/delete",
        JSON.stringify({ id: id })
      );

      console.log("new Budgets: ", response.data.budgets);
      console.log("new expenses: ", response.data.expenses);

      setData((prev) => ({
        ...prev,
        budgets: response.data.budgets,
        expenses: response.data.expenses,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.log("Expense Delete Error: ", error);
      toast("Something went wrong");
      if (error?.response?.status === 403)
        navigate("/", { state: { from: location }, replace: true });
    } finally {
      navigate("/dashboard");
    }
  };

  return (
    <div className="budget" style={{ "--accent": color }}>
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{amount} Budgeted</p>
      </div>
      <progress max={amount} value={spent}></progress>
      <div className="progress-text">
        <small>{spent} spent</small>
        <small>{remaining} remaining</small>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <button
            className="btn btn--warning"
            aria-label="Delete item"
            type="submit"
            onClick={handelDelete}
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`budget/${id}`} className="btn">
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
