import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ListGroup, Alert } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();
  const navigate = useNavigate();
  const emptyCart = 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png';

  useEffect(() => {
    if (user.id !== null) {
      fetchCartItems();
    }
  }, [user]);

  function fetchCartItems() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const updatedItems = data[0].cartItems;
          setTotalPrice(data[0].totalPrice);

          // Fetch product details for each item in the cart
          const updatedCartItemsPromises = updatedItems.map(item =>
            fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`)
              .then(res => res.json())
              .then(productData => ({
                ...item,
                productName: productData.name,
                price: productData.price, // Add price for each product
              }))
          );

          Promise.all(updatedCartItemsPromises)
            .then(updatedItemsWithNames => setCartItems(updatedItemsWithNames))
            .catch(() => notyf.error('Failed to fetch product details.'));
        }
      })
      .catch(() => notyf.error('Failed to fetch cart items.'));
  }

  function updateQuantity(productId, newQuantity) {
    const updatedItem = cartItems.find(item => item.productId === productId);
    if (updatedItem) {
      const updatedSubtotal = updatedItem.price * newQuantity; // Calculate new subtotal

      fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
          subtotal: updatedSubtotal,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchCartItems();
        })
        .catch((error) => {
          notyf.error('Failed to update quantity.');
        });
    }
  }

  function removeFromCart(productId) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        notyf.success('Item removed from cart');
        fetchCartItems();
      })
      .catch((error) => {
        notyf.error('Failed to remove item.');
      });
  }

  function clearCart() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${localStorage.getItem(`token`)}`,
        },
    })
    .then((res => res.json()))
    .then(() => {
        fetchCartItems();
    })
    .catch((error) => {
        notyf.error('Failed to clear cart.');
    });
  }

  function checkout() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        userId: user.id,
        cartItems,
        totalPrice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Ordered Successfully') {
          notyf.success('Order placed successfully!');
          clearCart(); // Clear the cart after a successful order
          navigate('/orders'); // Redirect to the orders page
        } else {
          notyf.error(data.error || 'Failed to place order.');
        }
      })
      .catch(() => notyf.error('Failed to checkout.'));
  }

  return (
    <div className="my-5">
      <h2 className="text-center mb-4 fw-bold">My Cart</h2>

      {cartItems.length === 0 ? (
        <Alert variant="warning" className="text-center mt-5 p-5">
             <h3>Your cart is empty.</h3>
             <NavLink className="btn btn-dark my-2" to="/products">Go to Products</NavLink>
            <div className='d-flex justify-content-center align-items-center'>
            <img className='img-fluid empty-cart' src={emptyCart}/>
            </div>
        </Alert>
      ) : (
        <ListGroup>
          {cartItems.map((item) => (
            <ListGroup.Item key={item.productId} className="d-flex justify-content-between">
              <div>
                <div className='lead fw-bold'>{item.productName}</div>
                <div className='lead'>Price: ₱{item.price}</div> {/* Show price per product */}
                <div className='lead'>
                    Quantity: {item.quantity}
                    <ButtonGroup aria-label="modifyQuantity" className='ps-5'>
                    <Button variant="outline-dark" onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                    <Button variant="outline-dark" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                    </ButtonGroup>
                </div>
                <div className='lead'>Subtotal: ₱{item.subtotal}</div>
              </div>
              <div className='my-auto'>
              <Button variant="danger" onClick={() => removeFromCart(item.productId)}>Remove</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {cartItems.length > 0 && (
        <>
        <Button variant='danger' className='mt-3' onClick={() => clearCart()}>Clear Cart</Button>
        <div className="d-flex justify-content-between mt-4">
          <h4>Total Price: ₱{totalPrice}</h4>
          <Button variant="dark" onClick={checkout}>Checkout</Button>
        </div>
        </>
      )}
    </div>
  );
}
