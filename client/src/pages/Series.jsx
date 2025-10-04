import React from "react";
import { Container, ListGroup } from "react-bootstrap";

function Series() {
  const series = ["Harry Potter", "Lord of the Rings", "Game of Thrones"];

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Book Series</h2>
      <ListGroup>
        {series.map((s, index) => (
          <ListGroup.Item key={index}>{s}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default Series;
