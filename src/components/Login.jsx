import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/login-signup.scss';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Spring, config } from 'react-spring/renderprops';

const Login = (props) => {
  const { authStatus, setAuthStatus } = props;

  const [loginInputs, setLoginInputs] = useState({
    username: '',
    password: '',
    email: '',
  });

  //used to toggle error message if auth fails
  //as well as redirect if auth succeeds
  const [loginStatus, setLoginStatus] = useState(null);

  const handleSubmit = async (e) => {
    let status;
    e.preventDefault();
    const { username, password } = loginInputs;
    const body = {
      username,
      password,
    };
    let response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    status = response.status;
    let data = await response.json();
    if (status === 200) {
      let email;
      setLoginStatus(true);
      setAuthStatus({ isLoggedIn: true, username: data.username, email: data.email });
    } else setLoginStatus(false);
  };

  const setInput = (e) => {
    setLoginInputs({ ...loginInputs, [e.target.id]: e.target.value });
  };

  return loginStatus || authStatus.isLoggedIn ? (
    <Redirect to={{ pathname: '/explore' }} />
  ) : (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={config.slow}>
      {(springProps) => (
        <div style={springProps} className="login-container">
          <div className="login-box">
            <center>
              <h4>Welcome Back!</h4>
            </center>
            <Form>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Username" onChange={setInput} />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={setInput} />
              </Form.Group>

              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
              </Button>
              <div className={loginStatus === false ? 'error-msg' : 'hidden'}>
                Sorry, your username/password was invalid.
              </div>
            </Form>
            <br></br>
            <Button variant="primary" type="link" href="/api/auth/github">
              Log In with GitHub
            </Button>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default Login;
