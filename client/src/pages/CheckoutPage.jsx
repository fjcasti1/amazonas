import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Alert from '../components/Alert';
import { createOrder } from '../actions/orderActions';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { PayPalButton } from 'react-paypal-button-v2';
import Spinner from '../components/Spinner';
import Spacer from '../components/Spacer';
import { getCode } from 'country-list';

const cardStyle = {
  hidePostalCode: true,
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#687075',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutPage = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, price, shippingAddress } = cart;
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    order,
  } = useSelector((state) => state.orderCreate);
  // == Component State ==
  // ==========================
  // -- Common
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  // -- Stripe
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  // -- PayPal
  const [sdkReady, setSdkReady] = useState(false);

  // == PayPal setup ==
  // ==================
  // Add PayPal Script
  useEffect(() => {
    const addPayPalScript = async () => {
      try {
        const res = await axios.get('/api/config/paypal');
        const clientId = res.data;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&disable-funding=card`;
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
      } catch (error) {
        setPaymentError(error);
      }
    };
    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  // == Stripe setup ==
  // ==================
  // Stripe Hooks
  const stripe = useStripe();
  const elements = useElements();
  // Load Stripe Payment Intent
  useEffect(() => {
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
          `/api/payments/create-payment-intent`,
          {
            amount: price.total * 100, // Stripe calculates amounts in the lowest denomination
            shippingAddress,
          },
          config,
        );
        setClientSecret(stripeClientSecret);
      } catch (error) {
        setPaymentError(error);
      }
    };
    fetchPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paymentSucceeded) {
      const order = {
        ...cart,
        orderItems: cartItems,
        paymentMethod: {
          option: paymentOption,
          card_network: cardBrand,
          card_last4: cardLast4,
        },
      };
      dispatch(createOrder(order));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paymentSucceeded]);

  useEffect(() => {
    if (successCreate) {
      history.push(`/orders/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, history, order, successCreate]);

  const handleCardChange = async (ev) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(ev.empty);
    setPaymentError(ev.error ? ev.error.message : '');
  };

  const handleCardSubmit = async (ev) => {
    ev.preventDefault();
    setProcessingPayment(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: userInfo.email,
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // Billing addres is the same as shipping for now
          address: {
            city: shippingAddress.city,
            country:
              shippingAddress.country === 'United States'
                ? getCode('United States of America')
                : getCode(shippingAddress.country),
            postal_code: shippingAddress.postalCode,
          },
        },
      },
    });

    if (payload.error) {
      setPaymentError(`Payment failed ${payload.error.message}`);
      setProcessingPayment(false);
    } else {
      setPaymentError(null);
      const config = {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/payments/get-card-preview`,
        { payment_method_id: payload.paymentIntent.payment_method },
        config,
      );
      setPaymentOption('card');
      setCardBrand(data.brand);
      setCardLast4(data.last4);
      setProcessingPayment(false);
      setPaymentSucceeded(true);
    }
  };

  const handlePayPalSubmit = () => {
    setPaymentOption('PayPal');
    setPaymentSucceeded(true);
  };

  return (
    <Fragment>
      <CheckoutSteps step1 step2 step3 />
      {!loadingCreate && errorCreate && <Alert>{errorCreate}</Alert>}
      <div className='row center'>
        <div className='card card-sm'>
          <div className='card-body'>
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className='row'>
                  <div>Items Subtotal</div>
                  <div>${price.items}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Shipping</div>
                  <div>${price.shipping}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Estimated tax collected</div>
                  <div>${price.tax}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${price.total}</strong>
                  </div>
                </div>
              </li>
              <li>
                <form id='payment-form' onSubmit={handleCardSubmit}>
                  <CardElement
                    id='card-element'
                    options={cardStyle}
                    onChange={handleCardChange}
                  />
                  <button
                    disabled={processingPayment || disabled || paymentSucceeded}
                    id='creditButton'
                  >
                    <span id='button-text'>
                      {processingPayment ? (
                        <div className='spinner-payment' id='spinner'></div>
                      ) : (
                        'Pay'
                      )}
                    </span>
                  </button>
                  {/* Show any error that happens when processing the payment */}
                  {paymentError && <Alert>{paymentError}</Alert>}
                </form>
              </li>
              <Spacer />
              <li>
                {!sdkReady ? (
                  <Spinner />
                ) : (
                  <PayPalButton
                    amount={price.total}
                    onSuccess={handlePayPalSubmit}
                    style={{
                      size: 'responsive',
                      color: 'gold',
                      label: 'pay',
                      fundingicons: true,
                      intent: 'authorize',
                    }}
                    // funding={{
                    //   allowed: [paypal.FUNDING.CREDIT],
                    // }}
                  />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CheckoutPage;
