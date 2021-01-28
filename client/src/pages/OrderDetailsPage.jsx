import React, { Fragment, useEffect } from 'react';
import Moment from 'react-moment';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { deliverOrder, getOrderDetails } from '../actions/orderActions';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
  ORDER_DETAILS_RESET,
} from '../constants/orderConstants';

const OrderDetailsPage = ({ match }) => {
  const sellerMode = match.path.indexOf('/seller') >= 0;
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.userAuth.userInfo._id);

  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = useSelector((state) => state.orderDeliver);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const orderId = match.params.id;

  useEffect(() => {
    if (!order || order._id !== orderId || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId, { seller: sellerMode ? userId : '' }));
    }
    return () => {
      if (order) dispatch({ type: ORDER_DETAILS_RESET });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, orderId, order, successDeliver, userId]);
  return loading ? (
    <Spinner />
  ) : error ? (
    <Alert>{error}</Alert>
  ) : (
    <div>
      <div className='container'>
        <div className='order-title'>
          <h1>Order Details</h1>
          <p>
            Ordered on{' '}
            <Moment element='span' format='MMMM DD, YYYY' date={order.paidAt} /> | Order#{' '}
            {order._id}
          </p>
        </div>

        <div className='row top center'>
          <div className='col-2'>
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
          </div>

          <div className='col-1'>
            <div className='card card-body'>
              <h2>Shipping Address</h2>
              <p>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
                <br />
              </p>
              {order.isDelivered ? (
                <Alert variant='success'>
                  Delivered
                  <Moment
                    element='span'
                    format=' MMM DD, YYYY'
                    date={order.deliveredAt}
                  />{' '}
                </Alert>
              ) : (
                <Alert>Not delivered</Alert>
              )}
              <h2>Payment Method</h2>
              {order.paymentMethod.option === 'PayPal' ? (
                <p>PayPal</p>
              ) : (
                <p className='order-payment-method'>
                  {order.paymentMethod.card_network} ****{order.paymentMethod.card_last4}
                </p>
              )}
              {order.isPaid ? (
                <Alert variant='success'>
                  Paid
                  <Moment
                    element='span'
                    format=' MMM DD, YYYY'
                    date={order.paidAt}
                  />{' '}
                </Alert>
              ) : (
                <Alert>Not paid</Alert>
              )}
              {!sellerMode && (
                <ul>
                  <li>
                    <h2>Order Summary</h2>
                  </li>
                  <li>
                    <div className='row'>
                      <div>Items</div>
                      <div>$ {order.price.items}</div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div>Shipping</div>
                      <div>$ {order.price.shipping}</div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div>Tax</div>
                      <div>$ {order.price.tax}</div>
                    </div>
                  </li>
                  <li>
                    <div className='row'>
                      <div>
                        <strong>Order Total</strong>
                      </div>
                      <div>
                        <strong>$ {order.price.total}</strong>
                      </div>
                    </div>
                  </li>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
