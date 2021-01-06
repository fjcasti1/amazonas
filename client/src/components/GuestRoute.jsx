import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const GuestRoute = ({ component: Component, ...rest }) => {
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  return (
    <Route
      {...rest}
      render={(props) => (userInfo ? <Redirect to='/' /> : <Component {...props} />)}
    ></Route>
  );
};

export default GuestRoute;
