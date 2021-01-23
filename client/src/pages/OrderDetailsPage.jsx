import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { PayPalButton } from 'react-paypal-button-v2';
import { deliverOrder, getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const cardStyle = {
  hidePostalCode: true,
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const OrderDetailsPage = ({ match }) => {
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  // Stripe setup
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { loading: loadingPay, error: errorPay, success: successPay } = useSelector(
    (state) => state.orderPay,
  );
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = useSelector((state) => state.orderDeliver);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const orderId = match.params.id;

  const addPayPalScript = async () => {
    const res = await axios.get('/api/config/paypal');
    const clientId = res.data;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&disable-funding=card`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  };
  const fetchPaymentIntent = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const {
        data: { clientSecret: stripeClientSecret },
      } = await axios.post(
        `/api/orders/create-payment-intent`,
        {
          amount: order.totalPrice * 100, // Stripe calculates amounts in the lowest denomination
        },
        config,
      );
      setClientSecret(stripeClientSecret);
    } catch (error) {
      setStripeError(error);
    }
  };

  useEffect(() => {
    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
        fetchPaymentIntent();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, orderId, order, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setStripeError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: userInfo.email,
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setStripeError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setStripeError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert>{error}</Alert>
  ) : (
    <div>
      <h1>Order {order._id}</h1>
      <div className='row top'>
        <div className='col-2'>
          <ul>
            <li>
              <div className='card card-body'>
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName}
                  <br />
                  <strong>Address:</strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                  <br />
                </p>
                {order.isDelivered ? (
                  <Alert variant='success'>Delivered on {order.deliveredAt}</Alert>
                ) : (
                  <Alert>Not delivered</Alert>
                )}
              </div>
            </li>
            <li>
              <div className='card card-body'>
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod},
                  <br />
                </p>
                {order.isPaid ? (
                  <Alert variant='success'>Paid on {order.paidAt}</Alert>
                ) : (
                  <Alert>Not paid</Alert>
                )}
              </div>
            </li>
            <li>
              <div className='card card-body'>
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className='row'>
                        <div>
                          <img src={item.image} alt={item.name} className='small' />
                        </div>
                        <div className='min-30'>
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </div>
                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className='col-1'>
          <div className='card card-body'>
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className='row'>
                  <div>Items</div>
                  <div>${order.itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Shipping</div>
                  <div>${order.shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Tax</div>
                  <div>${order.taxPrice}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady || loadingPay ? (
                    <Spinner />
                  ) : (
                    <Fragment>
                      <form id='payment-form' onSubmit={handleSubmit}>
                        <CardElement
                          id='card-element'
                          options={cardStyle}
                          onChange={handleChange}
                        />
                        <button
                          disabled={processing || disabled || succeeded}
                          id='creditButton'
                        >
                          <span id='button-text'>
                            {processing ? (
                              <div className='spinner-payment' id='spinner'>
                                caca
                              </div>
                            ) : (
                              'Pay'
                            )}
                          </span>
                        </button>
                        {/* Show any error that happens when processing the payment */}
                        {stripeError && (
                          <div className='card-error' role='alert'>
                            {stripeError}
                          </div>
                        )}
                        {/* Show a success message upon completion */}
                        <p
                          className={
                            succeeded ? 'result-message' : 'result-message hidden'
                          }
                        >
                          Payment succeeded, see the result in your Refresh the page to
                          pay again.
                        </p>
                      </form>
                      {errorPay && <Alert>{errorPay}</Alert>}
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
                    </Fragment>
                  )}
                </li>
              )}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver ? (
                    <Spinner />
                  ) : (
                    <Fragment>
                      {errorDeliver && <Alert>{errorDeliver}</Alert>}
                      <button
                        className='primary block'
                        onClick={() => dispatch(deliverOrder(order._id))}
                      >
                        Deliver Order
                      </button>
                    </Fragment>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
