import Table from "../components/Table";
import useData from "../hooks/useData";

const Expenses = () => {
  const { data } = useData();
  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {data.expenses && data.expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({data.expenses.length} total)</small>
          </h2>
          <Table expenses={data.expenses} />
        </div>
      ) : (
        <p>No Expenses to Show</p>
      )}
    </div>
  );
};

export default Expenses;
