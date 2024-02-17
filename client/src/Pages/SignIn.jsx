// src/components/SignInForm.js

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailuer,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import GoogleButton from "../components/GoogleButton";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      // Send POST request using fetch
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const signInData = await response.json();
        dispatch(signInSuccess(signInData));
        navigate("/");
      } else {
        const errorText = await response.text();
        dispatch(signInFailuer(errorText));
      }
    } catch (error) {
      dispatch(signInFailuer(error.message));
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

        <form action="#" method="post" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
        <GoogleButton />
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="mt-4 text-center">
          <p className="text-sm">
            Do not have an account?{" "}
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
