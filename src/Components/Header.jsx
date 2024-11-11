import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Task Management</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userInfo ? (
              <>
              <Nav.Item>
                  <span className="nav-link" style={{ color: 'lightgray' }}>
                    Welcome, {userInfo?.username}
                  </span>
                </Nav.Item>
                <LinkContainer to="/home">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
                
              </>
            ) : (
              <>
              
              <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/Register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
