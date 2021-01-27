import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingAddressPage = ({ history }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userAuth.userInfo);
  if (!userInfo) history.push('/login');

  const shippingAddress = useSelector((state) => state.cart.shippingAddress);

  const [firstName, setFirstName] = useState(shippingAddress.firstName);
  const [lastName, setLastName] = useState(shippingAddress.lastName);
  const [line1, setLine1] = useState(shippingAddress.line1);
  const [line2, setLine2] = useState(shippingAddress.line2);
  const [city, setCity] = useState(shippingAddress.city);
  const [state, setState] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        firstName,
        lastName,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      }),
    );
    history.push('/checkout');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 />
      <div className='container'>
        <div>
          <h1>Shipping Address</h1>
        </div>
        <form className='form form-grid' onSubmit={submitHandler}>
          <div className='form-group firstName'>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              placeholder='Enter first name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className='form-group lastName'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              placeholder='Enter last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className='form-group line1'>
            <label htmlFor='line1'>Address</label>
            <input
              type='text'
              id='line1'
              placeholder='Enter address'
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
            />
          </div>
          <div className='form-group line2'>
            <label htmlFor='line2'>Address (Optional)</label>
            <input
              type='text'
              id='line2'
              placeholder='Apt #'
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
          </div>
          <div className='form-group city'>
            <label htmlFor='city'>City</label>
            <input
              type='text'
              id='city'
              placeholder='Enter city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className='form-group state'>
            <label htmlFor='state'>State</label>
            <input
              type='text'
              id='state'
              placeholder='Example: AZ'
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className='form-group postalCode'>
            <label htmlFor='postalCode'>Postal Code</label>
            <input
              type='text'
              id='postalCode'
              placeholder='Enter postal code'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className='form-group country'>
            <label htmlFor='country'>Country</label>
            <input
              type='text'
              id='country'
              placeholder='Enter country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className='form-group button'>
            <label />
            <button className='primary' type='submit'>
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddressPage;
