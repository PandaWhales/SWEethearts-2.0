import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Landing from './Landing.jsx';
import Explore from './Explore.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Profile from './Profile.jsx';
import NavigateBar from './NavigateBar';
import IdeaPage from './IdeaPage';
import SubmitIdea from './SubmitIdea';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';

const App = () => {
  const [authStatus, setAuthStatus] = useState({
    isLoggedIn: false,
    username: '',
  });

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const loggedInStatus = await axios.get('/api/loginstatus');
      console.log('loggedInStatus', loggedInStatus);
      setAuthStatus({
        isLoggedIn: loggedInStatus.data[0].isLoggedIn,
        username: loggedInStatus.data[1],
      });
    };
    fetchLoggedInUser();
  }, []);

  return (
    <Router>
      {/* Using Fragment rather than native div to avoid React warnings */}
      <>
        {/* Navigation Bar is ever-present */}
        <NavigateBar authStatus={authStatus} />
        {/* Use the first Route whose path matches current URL */}
        <Switch>
          {/* Render given component if given path matches current URL */}
          {/* <Route exact path="/" component={Landing} /> */}
          <Route
            exact
            path="/"
            render={() => <Landing authStatus={authStatus} />}
          />
          <Route
            exact
            path="/login"
            render={() => (
              <Login authStatus={authStatus} setAuthStatus={setAuthStatus} />
            )}
          />
          <Route
            exact
            path="/signup"
            render={() => (
              <Signup authStatus={authStatus} setAuthStatus={setAuthStatus} />
            )}
          />
          <Route
            exact
            path="/explore"
            render={() => <Explore authStatus={authStatus} />}
          />
          <Route exact path="/idea" component={IdeaPage} />
          <Route
            exact
            path="/submit"
            render={() => <SubmitIdea authStatus={authStatus} />}
          />
          <Route
            exact
            path="/profile"
            render={() => <Profile authStatus={authStatus} />}
          />
        </Switch>
      </>
    </Router>
  );
};

export default App;
