import { Outlet } from "react-router-dom";

//assests
import wave from "../assets/wave.svg";
import illustration from "../assets/illustration.jpg";

const AuthLayout = () => {
  return (
    <div className="authcontainer">
      <div className="authlayout">
        <div>
          <h1>
            Take Charge of Your <span className="accent">Money</span>
          </h1>
          <p>
            Track your expenses, create budgets, and achieve your financial
            goals with confidence. Your path to financial freedom starts here.
          </p>
          <Outlet />
        </div>
        <img src={illustration} alt="Person with money" />
      </div>
      <img src={wave} alt="" />
    </div>
  );
};

export default AuthLayout;
