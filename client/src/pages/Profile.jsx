// src/pages/Profile.jsx
import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";

function Profile() {
  // Dummy data → replace with API data
  const user = {
    username: "Sanika",
    xp: 250,
    nextLevelXP: 500,
    streak: 5,
    badges: [
      { id: 1, name: "Bookworm", description: "Read 10 books" },
      { id: 2, name: "Critic", description: "Wrote 5 reviews" },
    ],
  };

  const progress = (user.xp / user.nextLevelXP) * 100;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Profile</h2>
      <Card className="p-3 mb-4">
        <h4>{user.username}</h4>
        <p>🔥 Streak: {user.streak} days</p>
        <ProgressBar now={progress} label={`${user.xp} XP`} />
      </Card>

      <Row>
        <h4>Badges</h4>
        {user.badges.map((badge) => (
          <Col md={3} key={badge.id} className="mb-3">
            <Card className="p-3 text-center">
              <Badge bg="success" className="mb-2">{badge.name}</Badge>
              <p>{badge.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Profile;
