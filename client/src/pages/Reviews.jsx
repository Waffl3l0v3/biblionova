import React from "react";
import { Container, Card } from "react-bootstrap";

function Reviews() {
  const reviews = [
    { id: 1, book: "Atomic Habits", review: "Amazing read, very practical!" },
    { id: 2, book: "The Alchemist", review: "Inspiring story, beautifully written." },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Reviews</h2>
      {reviews.map((r) => (
        <Card key={r.id} className="mb-3">
          <Card.Body>
            <Card.Title>{r.book}</Card.Title>
            <Card.Text>{r.review}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default Reviews;
