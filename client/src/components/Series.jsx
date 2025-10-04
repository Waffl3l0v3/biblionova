import React from "react";

function Series() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Series</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map((s) => (
          <div key={s} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">Series {s}</h2>
              <p>Books: 3</p>
              <p>Average Rating: ⭐⭐⭐⭐</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Series;
