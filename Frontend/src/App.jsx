import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Error from "./Pages/Error";

//lib
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//layouts
import Main from "./Layouts/Main";

//actions

import Expenses from "./Pages/Expenses";
import Budget from "./Pages/Budget";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./Pages/Login";
import Register, { registerAction } from "./Pages/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Main />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          errorElement: <Error />,
        },
        {
          path: "expenses",
          element: <Expenses />,
          errorElement: <Error />,
        },
        {
          path: "budget/:id",
          element: <Budget />,
          errorElement: <Error />,
        },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
          action: registerAction,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
