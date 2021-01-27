import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { getMyOrders } from '../actions/orderActions';
import Moment from 'react-moment';

const OrderHistory = ({ history }) => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.orderMyList);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <div>
      <div className='container'>
        <h1>Order History</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    <Moment element='span' format='MMM DD, YYYY' date={order.createdAt} />
                  </td>
                  <td>$ {order.price.total}</td>
                  <td>
                    {order.isDelivered ? (
                      <Moment
                        element='span'
                        format='MMM DD, YYYY'
                        date={order.deliveredAt}
                      />
                    ) : (
                      'No'
                    )}
                  </td>
                  <td>
                    <button
                      type='button'
                      className='small'
                      onClick={() => history.push(`/orders/${order._id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
