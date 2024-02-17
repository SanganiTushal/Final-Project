// src/components/Navbar.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { searchListing } from "../redux/list/listSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/search?term=${searchTerm}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching search results: ${response.statusText}`
        );
      }
      const data = await response.json();
      dispatch(searchListing(data));
      navigate("/search-result");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="bg-gray-800 p-5">
      <div className="container mx-auto flex items-center justify-between">
        {/* Company Name */}
        <div className="text-white text-lg font-bold">RentBar</div>

        {/* Search Bar */}
        <div className="mx-4">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            exact
            className="text-white hover:text-gray-300"
            activeClassName="border-b-2 border-white"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className="text-white hover:text-gray-300"
            activeClassName="border-b-2 border-white"
          >
            About
          </NavLink>

          <NavLink
            to="/profile"
            className="text-white hover:text-gray-300"
            activeClassName="border-b-2 border-white"
          >
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="avatar"
                className="rounded-full w-7 h-7 object-cover"
              ></img>
            ) : (
              <span>Sign in</span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
