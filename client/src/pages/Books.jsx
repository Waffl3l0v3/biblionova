import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

function Books() {
  const books = [
    { id: 1, title: "Atomic Habits", author: "James Clear" },
    { id: 2, title: "The Alchemist", author: "Paulo Coelho" },
    { id: 3, title: "1984", author: "George Orwell" },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Books</h2>
      <Row>
        {books.map((book) => (
          <Col key={book.id} md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>by {book.author}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Books;
