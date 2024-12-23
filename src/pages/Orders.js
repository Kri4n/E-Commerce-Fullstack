import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, ListGroup } from 'react-bootstrap';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to fetch product details by productId
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
      const productData = await response.json();
      return productData; // Return product details (name, price, etc.)
    } catch (err) {
      console.error("Error fetching product details:", err);
      return null;
    }
  };

  useEffect(() => {
    // Fetch the orders from the API
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // For each order, fetch the product details for each productId
          const ordersWithProducts = await Promise.all(
            data.map(async (order) => {
              const productsWithNames = await Promise.all(
                order.productsOrdered.map(async (product) => {
                  const productDetails = await fetchProductDetails(product.productId);
                  return {
                    ...product,
                    name: productDetails ? productDetails.name : 'Product not found',
                  };
                })
              );
              return {
                ...order,
                productsOrdered: productsWithNames,
              };
            })
          );
          setOrders(ordersWithProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  // Handle showing and hiding the modal
  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Render the component based on loading state or errors
  if (loading) {
    return <div className='text-center h1'>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className='my-5'>
      <h2 className='text-center my-5'>Orders History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Order #{order._id}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Status: {order.status}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Total Price:</strong> ₱{order.totalPrice.toFixed(2)}
                  </Card.Text>
                  <Button variant="dark" onClick={() => handleShowModal(order)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal to show order details */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className='text-center p-3'>Status: {selectedOrder.status} | Total Price: ₱{selectedOrder.totalPrice}</h5>
            <ListGroup>
              {selectedOrder.productsOrdered.map((product, index) => (
                <ListGroup.Item key={index}>
                  <strong>Product Name:</strong> {product.name} <br />
                  <strong>Product ID:</strong> {product.productId} <br />
                  <strong>Quantity:</strong> {product.quantity} <br />
                  <strong>Subtotal:</strong> ₱{product.subtotal.toFixed(2)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Orders;
