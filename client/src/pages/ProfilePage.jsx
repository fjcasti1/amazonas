import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfilePage = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.userAuth.userInfo._id);
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdateProfile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      if (user.isSeller && user.seller) {
        if (user.seller.name) setSellerName(user.seller.name);
        if (user.seller.logo) setSellerLogo(user.seller.logo);
        if (user.seller.description) setSellerDescription(user.seller.description);
      }
    }
  }, [dispatch, userId, user]);

  useEffect(() => {
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      dispatch(
        updateUserProfile({
          name,
          email,
          password,
          sellerName,
          sellerLogo,
          sellerDescription,
        }),
      );
      dispatch(getUserDetails(userId));
    }
  };

  return (
    <div>
      <form className='form' onSubmit={submitHandler}>
        <div>
          <h1>User Profile</h1>
        </div>
        {loading || (loadingUpdate && <Spinner />)}
        {error && <Alert>{error}</Alert>}
        {errorUpdate && <Alert>{errorUpdate}</Alert>}
        {successUpdate && <Alert variant='success'>Profile Updated Successfully</Alert>}
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='Enter name'
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            placeholder='Enter email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            placeholder='Confirm password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {user && user.isSeller && (
          <Fragment>
            <h2>Seller Profile</h2>
            <div>
              <label htmlFor='sellerName'>Seller Name</label>
              <input
                type='text'
                id='sellerName'
                placeholder='Enter Seller Name'
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='sellerLogo'>Seller Logo</label>
              <input
                type='text'
                id='sellerLogo'
                placeholder='Enter Seller Logo'
                value={sellerLogo}
                onChange={(e) => setSellerLogo(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='sellerDescription'>Seller Description</label>
              <input
                type='text'
                id='sellerDescription'
                placeholder='Enter Seller Description'
                value={sellerDescription}
                onChange={(e) => setSellerDescription(e.target.value)}
              />
            </div>
          </Fragment>
        )}

        <div>
          <label />
          <button className='primary' type='submit'>
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
