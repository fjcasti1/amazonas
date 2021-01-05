import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { deleteOrder, listOrders } from '../actions/orderActions';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

const OrderListPage = ({ history }) => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.orderList);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.orderDelete);

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: ORDER_DELETE_RESET });
    } else {
      dispatch(listOrders());
    }
  }, [dispatch, successDelete]);

  const deleteHandler = (orderId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteOrder(orderId));
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {errorDelete && <Alert variant='danger'>{errorDelete}</Alert>}
      {loading || loadingDelete ? (
        <Spinner />
      ) : error ? (
        <Alert variant='danger'>{error}</Alert>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                </td>
                <td>
                  <button
                    type='button'
                    className='small'
                    onClick={() => history.push(`/orders/${order._id}`)}
                  >
                    Details
                  </button>
                  <button
                    type='button'
                    className='small'
                    onClick={() => deleteHandler(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;
