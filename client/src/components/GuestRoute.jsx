import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const GuestRoute = ({ component: Component, ...rest }) => {
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  return (
    <Route
      {...rest}
      render={(props) => {
        const redirect =
          props.location.search && props.location.search.split('redirect=')[1];
        return !userInfo ? (
          <Component {...props} />
        ) : redirect ? (
          <Redirect to={redirect} />
        ) : (
          <Redirect to='/' />
          // props.history.goBack() // Can create problems if you re-login with nother user. It keeps trying to go back until you hit an allowed route
        );
      }}
    ></Route>
  );
};

export default GuestRoute;
