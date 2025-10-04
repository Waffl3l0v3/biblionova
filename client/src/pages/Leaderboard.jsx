// src/pages/Leaderboard.jsx
import React from "react";
import { Container, Table } from "react-bootstrap";

function Leaderboard() {
  // Dummy data → replace with DB query
  const leaderboard = [
    { username: "Sanika", xp: 250 },
    { username: "Namu", xp: 180 },
    { username: "Aarav", xp: 120 },
  ];

  return (
    <Container className="mt-4">
      <h2>🏆 Leaderboard</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.xp}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Leaderboard;
