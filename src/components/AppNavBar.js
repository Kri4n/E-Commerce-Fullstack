import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { NavLink, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { useContext } from 'react';

function NavScrollExample() {

  const {user} = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-light">
      <Container>
        <Navbar.Brand as={NavLink} to="/">EcommerceG6</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto ms-auto my-2 my-lg-0" navbarScroll>
            
            {(user.id !== null) ? user.isAdmin ? 
            <>
              <Nav.Link className='fw-bold' as={NavLink} to="/products" exact='true'>DASHBOARD</Nav.Link>
              <Nav.Link className='fw-bold' as={Link} to="/logout">LOGOUT</Nav.Link>
            </>
            :
            <>
              <Nav.Link className='fw-bold' as={NavLink} to="/" exact='true'>HOME</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/products" exact='true'>PRODUCTS</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/about" exact="true">ABOUT</Nav.Link>
              <NavDropdown className='fw-bold' title="PROFILE" id="navbarScrollingDropdown" exact="true">
              <NavDropdown.Item as={Link} to="cart" exact="true">Cart</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/orders" exact="true">Orders</NavDropdown.Item>
              <NavDropdown.Divider exact="true"/>
              <NavDropdown.Item as={NavLink} to="/profile" exact="true">My Profile</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/logout" exact="true">Logout</NavDropdown.Item>
              </NavDropdown>
            </>
            :
            <>
              <Nav.Link className='fw-bold' as={NavLink} to="/" exact='true'>HOME</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/products" exact='true'>PRODUCTS</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/about">ABOUT</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/login" exact="true">LOGIN</Nav.Link>
              <Nav.Link className='fw-bold' as={NavLink} to="/register" exact="true">SIGN UP</Nav.Link>
            </>

            }
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;