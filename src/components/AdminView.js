import { useState, useEffect, useContext } from 'react';
import { Button, ButtonGroup, Table, Modal, Form } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import EditProduct from './EditProduct';
import { Notyf } from 'notyf';

import ActivateProduct from './ActivateProduct';

import UserContext from '../context/UserContext';

export default function AdminView({ productsData, fetchData }) {

  const {user} = useContext(UserContext);

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");

  const notyf = new Notyf();

  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Generate rows for products table
  useEffect(() => {
    const productsArr = productsData.map((product) => (
      <tr key={product._id}>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td>{product.price}</td>
        <td className={product.isActive ? 'text-success' : 'text-danger'}>
          {product.isActive ? 'Available' : 'Unavailable'}
        </td>
        <td className="text-center">
          <EditProduct product={product} fetchData={fetchData} buttonText="Update" buttonStyle="primary"/>
          <ActivateProduct product={product} isActive={product.isActive} fetchData={fetchData}/>
        </td>
      </tr>
    ));

    setProducts(productsArr);
  }, [productsData]);

  // Modal controls
  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);


  // Add New Course
  function createProduct(e){

    //prevent submit event's default behavior
    e.preventDefault();

    let token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`,{

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
            
            setName("")
            setDescription("")
            setPrice(0);

            notyf.success("Product Added")

            handleCloseCreateModal();

            fetchData();

        } else {

            notyf.error("Error: Something Went Wrong.")

        }

    })

}

  return (
    (user.isAdmin === true)
      ?
    <>
      
      <h2 className="text-center pt-4">Admin Dashboard</h2>

      <div className="d-flex justify-content-center mb-3">
        <ButtonGroup>
        <Button variant="primary" onClick={handleShowCreateModal}>Add New Product</Button>
        <Button as={Link} to="/all-orders" variant="success">Show All Orders</Button>
        <Button as={Link} to="/user-management" variant="warning">User Management</Button> {/* Link to manage users */}
        </ButtonGroup>
      </div>

      <Table striped bordered hover responsive className="mt-2">
        <thead className="bg-dark text-white">
          <tr className="text-center">
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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
                onChange={e => {setName(e.target.value)}}
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
                onChange={e => {setDescription(e.target.value)}}
                value={description}
                required
              />
            </Form.Group>

            <Form.Group controlId="productPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                onChange={e => {setPrice(e.target.value)}}
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
