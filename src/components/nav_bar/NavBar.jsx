import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Keep this for minor custom styling (like the blue button)

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" sticky="top" className="custom-navbar shadow-sm">
      <Container>
        
        {/* Logo Section (Left Side) */}
        <Navbar.Brand as={Link} to="/" className="nav-logo">
          Kotdwar<span></span>
        </Navbar.Brand>

        {/* Hamburger Menu Toggle for Mobile (Auto handled by Bootstrap) */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Collapsible Menu Content */}
        <Navbar.Collapse id="responsive-navbar-nav">
          
          {/* ms-auto pushes these links to the Right Side */}
          <Nav className="ms-auto align-items-center">
            
            {/* Login Button / Link */}
            <Nav.Link 
              as={Link} 
              to="/login" 
              className="nav-btn-primary"
            >
              Login
            </Nav.Link>

            {/* If you want to add more links later, they go here */}
            {/* <Nav.Link as={Link} to="/register" className="nav-btn-outline">Get Started</Nav.Link> */}

          </Nav>
        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
}

export default NavBar;