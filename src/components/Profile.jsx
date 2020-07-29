import React, { Fragment, useState, useEffect } from 'react'
import { Container, Col, Row, Button } from 'react-bootstrap';
import Spinner from './Spinner';
import '../styles/user-profile.scss';
import axios from 'axios'

const Profile = (props) => {
  /*
   * Possible Props:
   * creatorUsername (possibly) passed in from IdeaPage
   * authStatus always passed in from App
   */
  let { ideaCreator, authStatus } = props;
console.log('auth',authStatus)
// console.log('REG STATUS', registrationInputs)
  // Destructure currently authenticated user's username from authStatus
  // let { firstname,
  //   lastname,
  //   email,
  //   linkedin,
  //   githubhandle,
  //   personalpage,
  //   about, } = registrationInputs;

  let { username } = authStatus;
  // Initialize creator name-to-display to currently authenticated user
  let creatorName = username;
  // console.log('USERNAME', username)
  // console.log('LINKED', linkedin)
  // Accessing Profile from Idea Page?
  if (ideaCreator) {
    console.log('idea creator is : ', ideaCreator)
    // If logged-in user is _not_ clicking on their own profile picture, 
    // RESET name-to-display to that of the User being clicked by logged-in User
    if (loggedInUsername !== ideaCreator) {
      creatorName = ideaCreator;
    }
  }
  // Set up user data to display on Profile
  const [userData, setUserData] = useState({
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
  });

  // componentDidMount() functional equivalent
  useEffect(() => {
    const getUser = async () => {
      // Get all existing user data, sending username as a parameter
      console.log('creator name', creatorName)
      const res = await axios.get(`/api/profile/${creatorName}`);
      console.log('resssssssssssssssssssssssssssssssssss', res.data)
      // Expect in response an object with all User table column properties
      // const userTableData = await res.json();
      // setUserData(userTableData);
      const {firstname,
        lastname,
        username,
        email,
        linkedin,
        githubhandle,
        personalpage,
        about} = res.data

      setUserData({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        linkedin: linkedin,
        githubhandle: githubhandle,
        personalpage: personalpage,
        about: about,
      })
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

  if (!Object.keys(userData).length) {
    return <Spinner />;
  }
  else if (userData.err) {
    return <Container>Could not load user</Container>;
  }

  return (
    <Container id='userProfileContainer'>
      <Row className='mb-4' id='row1'>
        <h3>
          {creatorName}'s Developer Profile
        </h3>
        <img id='profilePic' src='https://www.clker.com/cliparts/Z/j/o/Z/g/T/turquoise-anonymous-man-hi.png' />
      </Row>
      <Row id='row2'>
        <Col className='cardHeader' id='bioCard'>
          <Fragment>Bio</Fragment>
        </Col>
        <Col className='cardHeader ml-5' id='contactInfoCard'>
          <Fragment>Where else can your future teammates contact you?</Fragment>
        </Col>
      </Row>
      <div className="row">
        <div className="col">
          Full Name: {userData.username}
        </div>
        <div className="col">
          Github: {userData.githubhandle}
        </div>
        </div>
        <div className="row">
        <div className="col">
          About: {userData.about}
        </div>
        <div className="col">
          LinkedIn: {userData.linkedin}
        </div>
        </div>
        <div className="row">
        <div className="col">
          Tech Stack: 
        </div>
        <div className="col">
          Personal Site/Portfolio:{userData.personalpage}
        </div>
        </div>
    </Container>
  );
}

export default Profile;
