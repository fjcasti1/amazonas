import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { getOrderDetails } from '../actions/orderActions';

const OrderDetailsPage = ({ match }) => {
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.orderDetails);

  const orderId = match.params.id;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

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
              {/* <li>
                <button
                  type='button'
                  className='primary block'
                  onClick={placeOrderHandler}
                  disabled={order.orderItems.length === 0}
                >
                  Place Order
                </button>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
