import React from "react";

function Books() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1,2,3,4,5,6].map((b) => (
          <div key={b} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Book {b}</h2>
              <p>Author: Author {b}</p>
              <p>Rating: ⭐⭐⭐⭐</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
