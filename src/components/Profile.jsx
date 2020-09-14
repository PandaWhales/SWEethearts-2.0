import React, { Fragment, useState, useEffect } from 'react';
import { Container, Col, Row, Button, Form, Jumbotron } from 'react-bootstrap';
import Spinner from './Spinner';
import '../styles/user-profile.scss';
import axios from 'axios';
import PopUpBox from 'reactjs-popup';
import Popup from 'reactjs-popup';

const Profile = (props) => {
  /*
   * Possible Props:
   * creatorUsername (possibly) passed in from IdeaPage
   * authStatus always passed in from App
   */
  let { ideaCreator, authStatus } = props;

  let { username } = authStatus;

  const [registrationInputs, setRegistrationInputs] = useState({
    firstname: '',
    lastname: '',
    username: authStatus.username,
    password: '',
    confirmPassword: '',
    email: '',
    linkedin: '',
    githubhandle: '',
    personalpage: '',
    about: '',
    userTechStack: [],
  });

  // Set up user data to display on Profile

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const { linkedin, githubhandle, personalpage, about } = registrationInputs;

    const body = { linkedin, githubhandle, personalpage, about };

    await fetch(`/api/profile/${authStatus.username}`, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        const {
          firstname,
          lastname,
          username,
          email,
          linkedin,
          githubhandle,
          personalpage,
          about,
        } = data;

        setRegistrationInputs({
          ...registrationInputs,
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          linkedin: linkedin,
          githubhandle: githubhandle,
          personalpage: personalpage,
          about: about,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    window.location.reload(false);
  };

  const setInput = (e) => {
    //   setUserData({
    //   ...userData,
    //   [e.target.id]: e.target.value,
    // });
    setRegistrationInputs({
      ...registrationInputs,
      [e.target.id]: e.target.value,
    });
  };

  // componentDidMount() functional equivalent
  useEffect(() => {
    const getUser = async () => {
      // Get all existing user data, sending username as a parameter

      const loggedInStatus = await axios.get('/api/loginstatus');
      const userLogin = loggedInStatus.data[1];

      const res = await axios.get(`/api/profile/${userLogin.username}`);
      // Expect in response an object with all User table column properties
      // const userTableData = await res.json();
      // setUserData(userTableData);
      const {
        firstname,
        lastname,
        username,
        email,
        linkedin,
        githubhandle,
        personalpage,
        about,
      } = res.data;

      setRegistrationInputs({
        firstname: firstname,
        lastname: lastname,
        username: username,
        linkedin: linkedin,
        githubhandle: githubhandle,
        personalpage: personalpage,
        about: about,
      });
    };
    getUser();
  }, []);

  /* 
   * PROFILE COMPONENT USER FLOW:
  
   *   Case 1: Viewing your own profile (READ and WRITE)
   *       On first render, display all data in this DB row (distinguished by `username`)
   *       
   *       If current User clicks edit, then submit:
   *         1a. Send all data stored from initial GET request
   *         1b. Except for the modified fields, whose values will be set to User input
   * 
   *   Case 2: Viewing another User's profile (whether or not you're a registered user)
   *     Same page without edit button functionality (READ-ONLY)
  */

  // if (!Object.keys(userData).length) {
  //   return <Spinner />;
  // } else if (userData.err) {
  //   return <Container>Could not load user</Container>;
  // }

  return (
    <Container id="userProfileContainer">
      <Row className="mb-4" id="row1">
        <h3>{authStatus.username}'s Developer Profile</h3>
        <img
          id="profilePic"
          src="https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-hi.png"
        />
      </Row>
      <Row id="row2">
        <Col className="cardHeader" id="bioCard">
          <Fragment>Bio</Fragment>
        </Col>
        <Col className="cardHeader ml-5" id="contactInfoCard">
          <Fragment>Where else can your future teammates contact you?</Fragment>
        </Col>
      </Row>
      {/* <div className="row">
        <div className="col">Full Name: {userData.username}</div>
        <div className="col">Github: {userData.githubhandle}</div>
      </div>
      <div className="row">
        <div className="col">About: {userData.about}</div>
        <div className="col">LinkedIn: {userData.linkedin}</div>
      </div> */}
      <div className="row">
        <div className="col">Full Name: {registrationInputs.username}</div>
        <div className="col">Github: {registrationInputs.githubhandle}</div>
      </div>
      <div className="row">
        <div className="col">About: {registrationInputs.about}</div>
        <div className="col">LinkedIn: {registrationInputs.linkedin}</div>
      </div>
      <div className="row">
        <div className="col">Tech Stack:</div>
        <div className="col">
          Personal Site/Portfolio:{registrationInputs.personalpage}
        </div>
      </div>

      <Popup trigger={<button> Edit Profile</button>} modal>
        {(close) => (
          <Jumbotron>
            <h1>Update Your Peronal Info</h1>
            <div>
              <Form onSubmit={handleEditFormSubmit}>
                <Form.Group controlId="linkedin">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="linkedin"
                    placeholder="LinkedIn URL"
                    value={registrationInputs.linkedin}
                    onChange={setInput}
                  />
                </Form.Group>

                <Form.Group controlId="githubhandle">
                  <Form.Label>GitHub</Form.Label>
                  <Form.Control
                    type="githubhandle"
                    placeholder="gitHubHandle URL"
                    value={registrationInputs.githubhandle}
                    onChange={setInput}
                  />
                </Form.Group>

                <Form.Group controlId="personalpage">
                  <Form.Label>Personal Page</Form.Label>
                  <Form.Control
                    type="personalpage"
                    placeholder="Personal Page URL"
                    value={registrationInputs.personalpage}
                    onChange={setInput}
                  />
                </Form.Group>

                <Form.Group controlId="about">
                  <Form.Label>About</Form.Label>
                  <Form.Control
                    type="about"
                    placeholder="About you"
                    value={registrationInputs.about}
                    onChange={setInput}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </Jumbotron>
        )}
      </Popup>
      {/* <button onClick={handleformsubmit}> 
          <EditProfile />
          // we fill out the form
          // hit submit and do a post request to database
          // .then window.location profile page to automatically do get request
        </button>  */}
    </Container>
  );
};

export default Profile;
