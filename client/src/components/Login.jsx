import React from "react";

function Login() {
  return (
    <div className="flex justify-center mt-20">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <input type="text" placeholder="Username" className="input input-bordered w-full" />
          <input type="password" placeholder="Password" className="input input-bordered w-full" />
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
