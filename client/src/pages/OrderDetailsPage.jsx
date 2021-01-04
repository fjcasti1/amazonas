import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { PayPalButton } from 'react-paypal-button-v2';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderDetailsPage = ({ match }) => {
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { loading: loadingPay, error: errorPay, success: successPay } = useSelector(
    (state) => state.orderPay,
  );

  const orderId = match.params.id;

  useEffect(() => {
    const addPayPalScript = async () => {
      const res = await axios.get('/api/config/paypal');
      const clientId = res.data;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, orderId, order, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert variant='danger'>{error}</Alert>
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
                  <Alert variant='danger'>Not delivered</Alert>
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
                  <Alert variant='danger'>Not paid</Alert>
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
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className='row'>
                  <div>
                    <strong>Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady || loadingPay ? (
                    <Spinner />
                  ) : (
                    <Fragment>
                      {errorPay && <Alert variant='danger'>{errorPay}</Alert>}
                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      />
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
