import React from 'react';
import {
  BrowserRouter as Router,
  Redirect, Route, Switch
} from "react-router-dom";
import { isNullOrUndefined } from 'util';
import './App.scss';
import { Authenticate } from './components/authenticate/authenticate';
import { Exporter } from './components/exporter/exporter';
import { Home } from './components/home/home';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isAuthenticated() ? <Redirect to="/exporter" /> : <Home />}
        </Route>

        <Authenticate path="/authenticate"></Authenticate>

        <PrivateRoute exact path="/exporter">
          <Exporter />
        </PrivateRoute>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

function PrivateRoute({ children, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function isAuthenticated() {
  const accessToken = localStorage.getItem('access_token');
  const validUntil = localStorage.getItem('valid_until');

  if (isNullOrUndefined(accessToken) || isNullOrUndefined(validUntil)) {
    return false;
  }

  return parseInt(validUntil) > Date.now();
}

export default App;
