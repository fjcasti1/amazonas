import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
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

const App = () => {
  return (
    <BrowserRouter>
      <div className='grid-container'>
        <Header />
        <main>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/products/:id' component={ProductPage} />
          <Route exact path='/cart/:id?' component={CartPage} />
          <Route exact path='/shipping' component={ShippingAddressPage} />
          <Route exact path='/payment' component={PaymentMethodPage} />
          <Route exact path='/placeorder' component={PlaceOrderPage} />
          <Route exact path='/orders/:id' component={OrderDetailsPage} />
          <Route exact path='/orderhistory' component={OrderHistory} />
          <AdminRoute exact path='/orderlist' component={OrderListPage} />
          <PrivateRoute exact path='/profile' component={ProfilePage} />
          <AdminRoute exact path='/productlist' component={ProductListPage} />
          <AdminRoute exact path='/products/:id/edit' component={ProductEditPage} />
          <AdminRoute exact path='/userlist' component={UserListPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </main>

        <footer className='row center'>All rights reserverd</footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
