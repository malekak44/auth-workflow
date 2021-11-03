import React from 'react';
import Navbar from './components/Navbar';
import { useGlobalContext } from './context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  Home,
  Error,
  Login,
  Verify,
  Register,
  Dashboard,
  ResetPassword,
  PrivateRoute,
  ForgotPassword,
} from './pages';

export default function App() {
  const { isLoading } = useGlobalContext();

  if (isLoading) {
    return (
      <section className='page page-center'>
        <div className='loading'></div>
      </section>
    );
  }

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <PrivateRoute exact path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <Route exact path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route exact path="/user/verify-email">
          <Verify />
        </Route>
        <Route exact path="/user/reset-password">
          <ResetPassword />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  )
}