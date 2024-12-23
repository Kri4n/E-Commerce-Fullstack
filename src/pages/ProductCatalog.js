import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function ProductView() {
    const notyf = new Notyf();
    const { productId } = useParams();
    const { user } = useContext(UserContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(1); // Default quantity set to 1
    const [price, setPrice] = useState(0);

    const productImage = "https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    function addToCart(productId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                subtotal: quantity * price // Calculate subtotal based on quantity
            })
        })
        .then(res => res.json())
        .then(data => {
            if (user.isAdmin) {
                notyf.error("Admin Forbidden");
            } else if (data.message === 'Item added to cart successfully') {
                notyf.success('Added to cart');
            } else {
                notyf.error("Internal Server Error. Notify System Admin.");
            }
        });
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
            });
    }, []);

    return (
        <Container className="mt-5 mb-5">
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card className='shadow'>
                        <Card.Body className="text-center p-5 m-5">
                            <img className='img-fluid mb-5' src={productImage} alt={name} />
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>PhP {price}</Card.Text>
                            {user.id !== null ?
                                <div className='d-flex justify-content-center gap-1'>
                                    <div className="d-flex align-items-center">
                                        <Button variant="outline-dark" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</Button>
                                        <span className="mx-3">{quantity}</span>
                                        <Button variant="outline-dark" onClick={() => setQuantity(quantity + 1)}>+</Button>
                                    </div>
                                    <Button variant="dark" onClick={() => addToCart(productId)}>Add to cart</Button>
                                </div>
                                :
                                <Link className="btn btn-danger btn-block" to="/login">Log in to buy</Link>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
