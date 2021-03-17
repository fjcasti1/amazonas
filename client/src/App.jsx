import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderHistory from './pages/OrderHistory';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import OrderListPage from './pages/OrderListPage';
import UserListPage from './pages/UserListPage';
import UserEditPage from './pages/UserEditPage';
import SellerRoute from './components/SellerRoute';
import GuestRoute from './components/GuestRoute';
import SellerPage from './pages/SellerPage';
import { listCategories } from './actions/productActions';
import SideBar from './components/SideBar';
import SearchPage from './pages/SearchPage';
import SellerOrAdminRoute from './components/SellerOrAdminRoute';
import CheckoutPage from './pages/CheckoutPage';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51ILbFnI8EWaUCIqJGHnChfLq2puLY2sBRrxGr34LWsKrHnCq1SUHM8OeG8AHM0PCeTEMyLOPqynjPH3bqWpKSHJA00Yy63693A',
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className='grid-container'>
        <Header />
        <SideBar />
        <main>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/products/:id' component={ProductPage} />
          <Route exact path='/cart/:id?' component={CartPage} />
          <Route exact path='/seller/:id?' component={SellerPage} />
          <Route path='/search' component={SearchPage} />

          <GuestRoute exact path='/login' component={LoginPage} />
          <GuestRoute exact path='/register' component={RegisterPage} />

          <PrivateRoute exact path='/shipping' component={ShippingAddressPage} />
          <Elements stripe={stripePromise}>
            <PrivateRoute exact path='/checkout' component={CheckoutPage} />
          </Elements>
          <PrivateRoute exact path='/orderhistory' component={OrderHistory} />
          <PrivateRoute exact path='/orders/:id' component={OrderDetailsPage} />
          <PrivateRoute exact path='/orders/:id/seller' component={OrderDetailsPage} />
          <PrivateRoute exact path='/profile' component={ProfilePage} />

          <SellerRoute exact path='/productlist/seller' component={ProductListPage} />
          <SellerRoute exact path='/orderlist/seller' component={OrderListPage} />

          <SellerOrAdminRoute
            exact
            path='/products/:id/edit'
            component={ProductEditPage}
          />

          <AdminRoute exact path='/productlist' component={ProductListPage} />
          <AdminRoute exact path='/orderlist' component={OrderListPage} />
          <AdminRoute exact path='/userlist' component={UserListPage} />
          <AdminRoute exact path='/users/:id/edit' component={UserEditPage} />
        </main>

        <footer className='row center'>All rights reserverd</footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
