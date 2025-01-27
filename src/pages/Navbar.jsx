import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

export default function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">Recipe Book</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/SavedRecipe">Saved Recipe</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
