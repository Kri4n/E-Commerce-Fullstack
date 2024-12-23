import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { NavLink, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { useContext } from 'react';

// Import icons
import { FaHome, FaShopify, FaInfoCircle, FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";

function NavScrollExample() {

  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-light">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Krian&Josh.com</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto ms-auto my-2 my-lg-0" navbarScroll>
            
            {(user.id !== null) ? user.isAdmin ? 
            <>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/products" exact='true'>
                <MdDashboard className="me-2" /> DASHBOARD
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={Link} to="/logout">
                <FaSignOutAlt className="me-2" /> LOGOUT
              </Nav.Link>
            </>
            :
            <>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/" exact='true'>
                <FaHome className="me-2" /> HOME
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/products" exact='true'>
                <FaShopify className="me-2" /> PRODUCTS
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/about" exact="true">
                <FaInfoCircle className="me-2" /> ABOUT
              </Nav.Link>
              <NavDropdown className='fw-bold d-flex align-items-center' title="PROFILE" id="navbarScrollingDropdown" exact="true">
                <NavDropdown.Item as={Link} to="cart" exact="true" className="d-flex align-items-center">
                  <FaShoppingCart className="me-2" /> Cart
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders" exact="true" className="d-flex align-items-center">
                  <FaCheck className="me-2" /> Orders
                </NavDropdown.Item>
                <NavDropdown.Divider exact="true"/>
                <NavDropdown.Item as={NavLink} to="/profile" exact="true" className="d-flex align-items-center">
                  <FaUser className="me-2" /> My Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/logout" exact="true" className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
            :
            <>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/" exact='true'>
                <FaHome className="me-2" /> HOME
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/products" exact='true'>
                <FaShopify className="me-2" /> PRODUCTS
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/about">
                <FaInfoCircle className="me-2" /> ABOUT
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/login" exact="true">
                <FaSignInAlt className="me-2" /> LOGIN
              </Nav.Link>
              <Nav.Link className='fw-bold d-flex align-items-center' as={NavLink} to="/register" exact="true">
                <FaSignInAlt className="me-2" /> SIGN UP
              </Nav.Link>
            </>
            }
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
