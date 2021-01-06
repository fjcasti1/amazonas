import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const SellerRoute = ({ component: Component, ...rest }) => {
  const userInfo = useSelector((state) => state.userAuth.userInfo);
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.isSeller ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    ></Route>
  );
};

export default SellerRoute;
