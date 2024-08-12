import { Link } from "react-router-dom";
import { formatDateToLocalString } from "../utils/helper";
import useData from "../hooks/useData";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const ExpenseItem = ({ expense, showBudget = true }) => {
  const axiosPrivate = useAxiosPrivate();
  const { setData } = useData();

  const handelDelete = async (e) => {
    e.preventDefault();

    try {
      console.log("deleting: ", expense.id);

      const response = await axiosPrivate.post(
        "expenses/delete",
        JSON.stringify({ id: expense.id })
      );
      //console.log("Add expense: ", response.data.data);
      setData((prev) => ({ ...prev, expenses: response.data.data }));
      toast.success(response.data.message);
    } catch (error) {
      console.log("Expense Delete Error: ", error);
      toast("Something went wrong");
      if (error?.response?.status === 403)
        navigate("/", { state: { from: location }, replace: true });
    }
  };

  const { data } = useData();

  const budget = data.budgets.filter((bud) => bud.id === expense["b_id"])[0];
  /*   console.log("ExpneseItem - b: ", budget);
  console.log("ExpneseItem: ", expense); */

  return (
    <>
      <td>{expense.name}</td>
      <td>{expense.amount}</td>
      <td>{formatDateToLocalString(expense["created_at"])}</td>
      {showBudget && (
        <td>
          <Link
            to={`/dashboard/budget/${budget?.id}`}
            style={{ "--accent": budget?.color }}
          >
            {budget?.name}
          </Link>
        </td>
      )}
      <td>
        <button
          className="btn btn--warning"
          aria-label={`delete ${expense.name}`}
          type="submit"
          onClick={handelDelete}
        >
          Delete
        </button>
      </td>
    </>
  );
};

export default ExpenseItem;
