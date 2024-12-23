import { useState, useContext, useEffect } from 'react';
import { Button, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import OrderAccordion from '../components/OrderAccordion';

import UserContext from '../context/UserContext';

export default function AllOrders() {

  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [orders, setOrders] = useState([]); 

  const notyf = new Notyf();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal controls
  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  // Add New Product
  function createProduct(e) {
    e.preventDefault();

    let token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            description: description,
            price: price
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            setName("");
            setDescription("");
            setPrice(0);

            notyf.success("Product Added");
            handleCloseCreateModal();
        } else {
            notyf.error("Error: Something Went Wrong.");
        }
    });
  }

  // Fetch Orders
  useEffect(() => {
    if (user && user.isAdmin) {
      let token = localStorage.getItem('token');

      fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setOrders(data);
          } else {
            notyf.error('Error: Something Went Wrong.');
          }
        })
        .catch((err) => {
          notyf.error('Error fetching orders.');
        });
    }
  }, [user]);

  return (
    (user.isAdmin === true)
      ?
    <>
      <h2 className="text-center pt-4">Admin Dashboard</h2>

      <div className="d-flex justify-content-center mb-3">
        <ButtonGroup>
          <Button variant="primary" onClick={handleShowCreateModal}>Add New Product</Button>
          <Button as={Link} to="/products" variant="danger">Show All Products</Button>
          <Button as={Link} to="/user-management" variant="warning">User Management</Button> {/* Add User Management button */}
        </ButtonGroup>
      </div>

      <OrderAccordion orders={orders} />

      {/* Modal for adding new product */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={e => createProduct(e)}>
            <Form.Group controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                onChange={e => { setName(e.target.value) }}
                value={name}
                required
              />
            </Form.Group>

            <Form.Group controlId="productDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                onChange={e => { setDescription(e.target.value) }}
                value={description}
                required
              />
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                onChange={e => { setPrice(e.target.value) }}
                value={price}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">Add Product</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
    :
    <Navigate to="/" />
  );
}
