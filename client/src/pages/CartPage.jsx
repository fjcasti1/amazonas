import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { changeProductQty, removeFromCart } from '../actions/cartActions';

const CartPage = ({ history }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };
  const checkoutHandler = (productId) => {
    history.push('/login?redirect=shipping');
  };

  return (
    <div className='row top'>
      <div className='col-2'>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Alert>
            Cart is empty. <Link to='/'>Go Shopping</Link>
          </Alert>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.product}>
                <div className='row'>
                  <div>
                    <img src={item.image} alt={item.name} className='small' />
                  </div>
                  <div className='min-30'>
                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                  </div>
                  <div>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          changeProductQty(item.product, Number(e.target.value)),
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>${item.price}</div>
                  <div>
                    <button
                      type='button'
                      onClick={(e) => removeFromCartHandler(item.product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='col-1'>
        <div className='card card-body'>
          <ul>
            <li>
              <h2>
                Subtotal ({cartItems.reduce((acc, curr) => acc + curr.qty, 0)} items)
                : ${cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)}
              </h2>
            </li>
            <li>
              <button
                type='button'
                onClick={checkoutHandler}
                className='primary block'
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
