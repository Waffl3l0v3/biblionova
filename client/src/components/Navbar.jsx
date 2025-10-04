import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Biblionova</Link>
      </div>
      <div className="flex-none gap-2">
        <Link to="/books" className="btn btn-ghost">Books</Link>
        <Link to="/series" className="btn btn-ghost">Series</Link>
        <Link to="/reviews" className="btn btn-ghost">Reviews</Link>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    </div>
  );
}

export default Navbar;
