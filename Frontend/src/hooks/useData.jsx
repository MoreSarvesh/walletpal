import { useContext } from "react";
import { DataContext } from "../context/DataProvider";

const useData = () => {
  const data = useContext(DataContext);
  return data;
};

export default useData;
