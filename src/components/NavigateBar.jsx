import React from 'react';
import {
  Navbar,
  Nav /* Form, FormControl, Button, Container */,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NavigateBar = ({ authStatus, setAuthStatus }) => {
  const { isLoggedIn, username } = authStatus;
    // const fetchLoggedInUser = async () => {
    //   const loggedInStatus = await axios.get('/api/loginstatus');
    //   console.log('loggedInStatus', loggedInStatus);
    //   setAuthStatus({
    //     isLoggedIn: loggedInStatus.data[0].isLoggedIn,
    //     username: loggedInStatus.data[1],
    //   });
    // };

  const logoutHandler = async () => {
    await axios.get('/api/logout');
    window.location.reload(false);
  }

  return isLoggedIn ? (
    <Navbar bg="primary" variant="dark">
      {/* Leftside Nav Logo/Link */}
      {/* TODO: Point this href to `/explore` if User is authenticated */}
      <Link to="/">
        <Navbar.Brand>Scratch Project</Navbar.Brand>
      </Link>
      {/* Rightside Nav Links */}
      {/* Set class for Create Idea and Logout button Nav item to `margin-left: auto;`*/}
      <Nav className="ml-auto">
        {/* TODO: Remove inline styling in favor of Bootstrap or separate stylesheet */}

        {/* temporary link to render submit idea page */}
        <Link to="/submit">
          <Nav.Link style={{ color: 'white' }} href="/submit">
            Submit Idea
          </Nav.Link>
        </Link>
        <Link to="/profile">
          <Nav.Link style={{ color: 'white' }} href="/profile">
            My Profile
          </Nav.Link>
        </Link>
        <Link to="/login">
          <Nav.Link style={{ color: 'white' }} href="/login" onClick={logoutHandler}>
            Log Out
          </Nav.Link>
        </Link>
      </Nav>
    </Navbar>
  ) : (
    <Navbar bg="primary" variant="dark">
      {/* Leftside Nav Logo/Link */}
      {/* TODO: Point this href to `/explore` if User is authenticated */}
      <Link to="/">
        <Navbar.Brand>Scratch Project</Navbar.Brand>
      </Link>
      {/* Rightside Nav Links */}
      {/* Set class for Login and Signup button Nav item to `margin-left: auto;`*/}
      <Nav className="ml-auto">
        {/* TODO: Remove inline styling in favor of Bootstrap or separate stylesheet */}

        {/* temporary link to render submit idea page */}
        <Link to="/login">
          <Nav.Link style={{ color: 'white' }} href="/login">
            Login
          </Nav.Link>
        </Link>
        <Link to="/signup">
          <Nav.Link style={{ color: 'white' }} href="/signup">
            Signup
          </Nav.Link>
        </Link>
      </Nav>
    </Navbar>
  );

  // // Search Bar Component
  // < Form inline >
  //   <FormControl type="text" placeholder="Search" className="mr-sm-2" />
  //   <Button variant="outline-light">Search</Button>
  // </Form >
};

export default NavigateBar;
