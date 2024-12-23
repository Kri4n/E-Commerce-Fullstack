import { Accordion, Table } from 'react-bootstrap';

export default function OrderAccordion({ orders }) {

  return (
    <Accordion defaultActiveKey="0" className='my-3'>
      {orders.map((order, index) => (
        <Accordion.Item eventKey={index.toString()} key={order._id}>
          <Accordion.Header>{order.userId}</Accordion.Header>
          <Accordion.Body>
            <h5>Order Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.productsOrdered.map((product, productIndex) => (
                  <tr key={productIndex}>
                    <td>{product._id}</td>
                    <td>{product.quantity}</td>
                    <td>{product.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <strong className='d-block'>Total Price: ₱{order.totalPrice}</strong>
            <strong>Status: <span className='text-danger'>{order.status}</span></strong>
            <p>Ordered on: {new Date(order.orderedOn).toLocaleDateString()}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
