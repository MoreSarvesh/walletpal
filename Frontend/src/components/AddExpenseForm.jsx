import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useData from "../hooks/useData";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AddExpenseForm = ({ budgets }) => {
  const { setData } = useData();

  const axiosPrivate = useAxiosPrivate();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(budgets[0].id);
  const [isSubmittig, setIsSubmitting] = useState(false);

  //console.log(name, amount, selectedBudget, isSubmittig );

  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmittig) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmittig]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newExpense = { name, amount: +amount, bid: +selectedBudget };
    //console.log("newExpense: ", newExpense);

    try {
      const response = await axiosPrivate.post(
        "expenses/add",
        JSON.stringify(newExpense)
      );
      //console.log("Add expense: ", response.data.data);
      setData((prev) => ({ ...prev, expenses: response.data.data }));
      toast.success(response.data.message);
    } catch (error) {
      console.log("Budget Form Error: ", error);
      toast("Something went wrong");
      if (error?.response?.status === 403)
        navigate("/", { state: { from: location }, replace: true });
    } finally {
      setIsSubmitting(false);
      setAmount("");
      setName("");
    }
  };

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Add new{" "}
        <span className="accent">
          {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}
        </span>
      </h2>
      <form ref={formRef} className="grid-sm" onSubmit={handelSubmit}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name:</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid-xs" hidden={budgets.length === 1}>
            <label htmlFor="newExpenseBudget">Budget Category</label>
            <select
              name="newExpenseBudget"
              id="newExpenseBudget"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              required
            >
              {budgets
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn--dark" disabled={isSubmittig}>
          <span>Create Expense</span>
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
