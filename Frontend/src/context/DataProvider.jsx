import { createContext, useState } from "react";

export const DataContext = createContext({});

const DataProvider = ({ children }) => {
  const [data, setData] = useState({ budgets: [], expenses: [] });
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
