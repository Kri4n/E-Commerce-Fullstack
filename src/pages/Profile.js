import { useState, useEffect, useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import UserContext from '../context/UserContext';

export default function Profile(){

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const notyf = new Notyf();

    const { user } = useContext(UserContext);

    const [details,setDetails] = useState({});

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:4006/b6/users/details`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // Set the user states values with the user details upon successful login.
            if (typeof data !== undefined) {

                setDetails(data);

            } else if (data.error === "User not found") {

                notyf.error("User not found.")

            } else {

                notyf.error("Something went wrong, Contact Your System Admin.")

            }
        });
    }, [])
    
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4006/b6/users/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newPassword: password }),
            });

            if (response.ok) {
                notyf.success('Password changed successfully');
                setPassword('');
                setConfirmPassword('');
                setShow(false); 
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        (user.id === null) ?
            <Navigate to="/shop" />
            :
            <Container className="mt-5 mb-5 p-5 bg-dark text-white">
                <h1 className="mb-5 mt-5">Profile</h1>
                <Button variant='light outline-dark' onClick={handleShow}>Change Password</Button>
                <h2 className="mt-3">Name: {`${details.firstName} ${details.lastName}`}</h2>
                <hr />
                <h4>Contacts</h4>
                <h5>Email: {details.email}</h5>
                <h5>Mobile No: {details.mobileNo}</h5>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group className="mb-3" controlId="changePassword">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control id="password" type="password" placeholder="Enter your new password" value={password} autoFocus onChange={(e) => setPassword(e.target.value)} required/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="newPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control id="confirmPassword" type="password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setMessage('');}} required />
                                {message && <div className="alert alert-danger text-danger mt-2">{message}</div>}
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleClose}>Close</Button>
                                <Button variant="dark" type='submit'>Save Changes</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
    )

}