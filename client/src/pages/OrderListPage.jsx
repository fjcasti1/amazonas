import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { deleteOrder, listOrders } from '../actions/orderActions';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';
import Moment from 'react-moment';

const OrderListPage = ({ history, match }) => {
  const sellerMode = match.path.indexOf('/seller') >= 0;
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.userAuth.userInfo._id);
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
      dispatch(listOrders({ seller: sellerMode ? userId : '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, successDelete, userId]);

  const detailsHandler = (orderId) => {
    if (sellerMode) {
      history.push(`/orders/${orderId}/seller`);
    } else {
      history.push(`/orders/${orderId}`);
    }
  };

  const deleteHandler = (orderId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteOrder(orderId));
    }
  };

  return (
    <div className='container'>
      <h1>Orders</h1>
      {errorDelete && <Alert>{errorDelete}</Alert>}
      {loading || loadingDelete ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{order.user.name}</td>
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
                    onClick={() => detailsHandler(order._id)}
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
