import { Form, Link, redirect, useActionData } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const registerAction = async ({ request }) => {
  const data = await request.formData();

  const registerdata = {
    username: data.get("userName"),
    password: data.get("password"),
  };

  try {
    const resopnse = await axios.post(
      "http://localhost:3000/users/register",
      JSON.stringify(registerdata),
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(resopnse.data);
    return redirect("/");
  } catch (error) {
    if (!error?.response) {
      console.log("no server response");
      return "no server response";
    } else {
      console.log(error);
      return "Registration Failed";
    }
  }
};

const Register = () => {
  const errorMessage = useActionData() || null;
  console.log(errorMessage);

  return (
    <>
      {errorMessage && <div>{errorMessage}</div>}
      <Form method="post">
        <input
          type="text"
          name="userName"
          aria-label="Your Name"
          placeholder="Enter your username?"
          autoComplete="given-name"
          required
        />
        <input
          type="password"
          name="password"
          aria-label="Password"
          placeholder="Enter a Password"
          required
        />
        <input type="hidden" name="_action" value="newUser" />
        <button type="submit" className="btn btn--dark">
          <span>Create Account</span>
        </button>
      </Form>
      <p>Already have an Account?</p>
      <Link to={"/"} className="registerlink">
        Login
      </Link>
    </>
  );
};

export default Register;
