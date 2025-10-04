import React from "react";

function Reviews() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>
      <div className="space-y-4">
        {[1,2,3].map((r) => (
          <div key={r} className="card bg-base-100 shadow-md p-4">
            <p><strong>User {r}:</strong> Loved the book! ⭐⭐⭐⭐</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
