import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/dashboard";

  const { setAuth } = useAuth();

  const handelSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, password };

    try {
      const resopnse = await axios.post(
        "/users/login",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //console.log(resopnse.data.accessToken);
      setAuth({ accesstoken: resopnse.data.accessToken, username });
      toast.success("Login Successful");
      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        console.log("no server response");
        setErrorMessage("no server response");
      } else {
        console.log(JSON.stringify(error.response.data));
        setErrorMessage(JSON.stringify(error.response.data));
      }
    }
  };
  return (
    <>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handelSubmit}>
        <input
          type="text"
          name="userName"
          aria-label="Your Name"
          placeholder="What is your username?"
          autoComplete="given-name"
          value={username}
          onChange={(e) => {
            setErrorMessage("");
            setUsername(e.target.value);
          }}
          required
        />
        <input
          type="password"
          name="password"
          aria-label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setErrorMessage("");
            setPassword(e.target.value);
          }}
          required
        />
        <button type="submit" className="btn btn--dark">
          <span>Login</span>
        </button>
      </form>
      <p>Create new Account?</p>
      <Link to={"/register"} className="registerlink">
        Register
      </Link>
    </>
  );
};

export default Login;
