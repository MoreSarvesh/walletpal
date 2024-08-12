import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { toast } from "react-toastify";
import useData from "../hooks/useData";

const AddBudgetForm = ({ budgetLength }) => {
  const { setData } = useData();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [isSubmittig, setIsSubmitting] = useState(false);
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmittig) {
      formRef.current.reset();
      focusRef.current.focus();
    }
  }, [isSubmittig]);

  const generateRamdomColors = () => {
    return `${budgetLength * 34} 65% 50%`;
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newBudget = { name, amount: +amount, color: generateRamdomColors() };
    //console.log("newBudget: ", newBudget);

    try {
      const response = await axiosPrivate.post(
        "budgets/add",
        JSON.stringify(newBudget)
      );
      //console.log("Add Budget: ", response.data.data);
      setData((prev) => ({ ...prev, budgets: response.data.data }));
      toast.success(response.data.message);
    } catch (error) {
      console.log("Budget Form Error: ", error);
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
      <h2 className="h3">Create budget</h2>
      <form className="grid-sm" ref={formRef} onSubmit={handelSubmit}>
        <div className="grid-xs">
          <label htmlFor="newBudget">Budget Name</label>
          <input
            type="text"
            name="newBudget"
            id="newBudget"
            placeholder="e.g. Groceries "
            ref={focusRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>
        <div className="grid-xs">
          <label htmlFor="newBudgetAmount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="newBudgetAmount"
            id="newBudgetAmount"
            placeholder="e.g., $500"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn--dark"
            disabled={isSubmittig}
          >
            <span>Create Budget</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBudgetForm;
