//rrd imports
import { Form, NavLink, redirect } from "react-router-dom";

//lib
import { toast } from "react-toastify";

//assets
import logo from "../assets/logomark.svg";
import { deleteItem } from "../utils/helper";

const Navbar = ({ username }) => {
  return (
    <nav>
      <NavLink to="/dashboard" aria-label="Go to Home">
        <img src={logo} alt="" height={30} />
        <span>WalletPal</span>
      </NavLink>
      {username && (
        <Form
          method="post"
          action="/logout"
          onSubmit={(e) => {
            if (!confirm("Logout")) {
              e.preventDefault();
            }
          }}
        >
          <button type="submit" className="btn btn--warning">
            <span>Logout</span>
          </button>
        </Form>
      )}
    </nav>
  );
};

export const logoutAction = () => {
  deleteItem({ key: "userName" });
  deleteItem({ key: "budgets" });
  deleteItem({ key: "expenses" });

  toast.success("Logout Successful");

  return redirect("/");
};

export default Navbar;
