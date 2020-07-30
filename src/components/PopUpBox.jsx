import React, { Fragment, useState } from 'react';
import { Form, Nav, Button, Alert, Jumbotron } from 'react-bootstrap';
import '../styles/popUpBox.scss';

const PopUpBox = ({ currentName, creatorName, creatorEmail, currentEmail, projectName }) => {
  const [message, setMessage] = useState({
    subjectText: '',
    messageText: '',
  });

  const [show, setShow] = useState(false);

  const sendData = () => {
    setShow(true);
    const body = {
      email: currentEmail,
      subject: message.subjectText,
      message: message.messageText,
    };
    fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  const form = currentName ? (
    currentEmail ? (
      <Fragment>
        <Jumbotron className="jumbo">
          <h1>Let's get started on {projectName}</h1>
          <hr></hr>
          <h3>Contact {creatorName}!</h3>
          <br></br>
          <Form>
            <Form.Group controlId="Subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="username"
                placeholder="Re:"
                onChange={(e) => setMessage({ ...message, subjectText: e.target.value })}
              />
              {/* onChange={setInput} /> */}
            </Form.Group>
            <Form.Group controlId="Message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Show off your skills here..."
                onChange={(e) => setMessage({ ...message, messageText: e.target.value })}
              />
            </Form.Group>
            <Button onClick={() => sendData()}>Submit</Button>
          </Form>
          {show && (
            <>
              <br></br>
              <Alert variant="success">Message sent!</Alert>
            </>
          )}
        </Jumbotron>
      </Fragment>
    ) : (
      <Fragment>
        <h1>Let's get started on {projectName}</h1>
        <br></br>
        <h3>Contact {creatorName}!</h3>
        <h3> You are {currentName}</h3>
        <br></br>
        <h1>Please register an email with your account to access messaging features!</h1>
        <Nav.Link href="/profile">Add Email Here</Nav.Link>
      </Fragment>
    )
  ) : (
    <Fragment>
      <h1> Please login first! </h1>
    </Fragment>
  );
  return form;
};

export default PopUpBox;
