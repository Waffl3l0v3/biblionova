import React from "react";
import { Container, Button } from "react-bootstrap";

function Home() {
  return (
    <Container className="text-center mt-5">
      <h1>Welcome to Biblionova 📖</h1>
      <p className="lead">Your ultimate Bookflix – explore books, series, and reviews!</p>
      <Button variant="primary" href="/books">Explore Books</Button>
    </Container>
  );
}

export default Home;
