import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import LandigPage from './components/views/LandingPage/LandigPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          {/* <Route exact path="/">
            <LandigPage /> */}
          {/* 위 코드를 깔끔하게 하고싶다면 이렇게 하면된다. */}
          <Route exact path="/" component={LandigPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/register" component={RegisterPage}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


