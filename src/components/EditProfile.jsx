import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/login-signup.scss';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import { Form, Button } from 'react-bootstrap';
import '../components/Profile';
import Profile from '../components/Profile';

const EditProfile = (props) => {
  const { authStatus, setAuthStatus } = props;

  const [registrationInputs, setRegistrationInputs] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    linkedin: '',
    githubhandle: '',
    personalpage: '',
    about: '',
    userTechStack: [],
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [registerStatus, setRegisterStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstname,
      lastname,
      username,
      password,
      confirmPassword,
      email,
      linkedin,
      githubhandle,
      personalpage,
      about,
      userTechStack: [],
    } = registrationInputs;
    if (password !== confirmPassword)
      return setErrorMsg(`Passwords don't match!`);

    const body = {
      firstname,
      lastname,
      username,
      password,
      email,
      linkedin,
      githubhandle,
      personalpage,
      about,
      userTechStack: [],
    };

    let response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (response.status === 200) {
      setRegisterStatus(true);
      setAuthStatus({ isLoggedIn: true, username });
    } else
    setErrorMsg('New user could not be created - duplicate username/email');
  };

  const setInput = (e) => {
    setRegistrationInputs({
      ...registrationInputs,
      [e.target.id]: e.target.value,
    });
  };
  
  return registerStatus || authStatus.isLoggedIn ? (
    <Redirect
    to={{
      pathname: '/explore',
    }}
    />
    ) : (
      <div className="login-container">
      {/* <Profile registrationInputs={registrationInputs} setRegistrationInputs={setRegistrationInputs}/> */}
      <div className="login-box">
        <center>
          <h4>Welcome!</h4>
        </center>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Username"
              onChange={setInput}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={setInput}
            />
          </Form.Group>

          <Form.Group controlId="linkedin">
            <Form.Label>LinkedIn</Form.Label>
            <Form.Control
              type="linkedin"
              placeholder="LinkedIn URL"
              onChange={setInput}
            />
          </Form.Group>

          <Form.Group controlId="githubhandle">
            <Form.Label>GitHub</Form.Label>
            <Form.Control
              type="githubhandle"
              placeholder="gitHubHandle URL"
              onChange={setInput}
            />
          </Form.Group>

          <Form.Group controlId="personalpage">
            <Form.Label>Personal Page</Form.Label>
            <Form.Control
              type="personalpage"
              placeholder="Personal Page URL"
              onChange={setInput}
            />
          </Form.Group>

          <Form.Group controlId="about">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="about"
              placeholder="About you"
              onChange={setInput}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <div className="error-msg">{errorMsg}</div>
      </div>
    </div>
  );
};

export default EditProfile;
