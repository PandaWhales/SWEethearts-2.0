import React, { Fragment } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

/*
 * HELPER FUNCTION: nextPath
 * Push `path` to Landing component's destructured `history` prop
 * (provided by invoking withRouter on Landing component before export)
 */
const redirectToPath = (history, path) => {
  history.push(path);
};

const Landing = ({ history }) => {
  //react spring stuff
  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1,
  ];
  const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  //

  return (
    //react spring stuff
    <animated.div
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: props.xys.interpolate(trans) }}
    >
      <Container fluid className="container" style={{ marginTop: '20vh' }}>
        <div className="mt-5">
          <h1 className="d-flex justify-content-center"> Welcome to Scratch Project </h1>
          <br />
          <h2 className="mb-5 d-flex justify-content-center">
            {' '}
            A place where developers make their dreams come true{' '}
          </h2>
          <br />
        </div>
        <div className="mt-5 d-flex justify-content-center">
          <Button
            className="w-25"
            onClick={() => redirectToPath(history, '/explore')}
            size="lg"
            variant="outline-primary"
            block
          >
            Start Exploring
          </Button>
        </div>
      </Container>
    </animated.div>
  );
};

export default withRouter(Landing);
