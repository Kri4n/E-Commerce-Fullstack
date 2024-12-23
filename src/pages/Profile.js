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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
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
            <Navigate to="/products" />
            :
            <Container className="mt-5 mb-5 pb-5 p-5 bg-dark text-white rounded-top">
                <h3 className="">Profile</h3>
                <hr />
                <Button variant='light outline-dark' onClick={handleShow}>Change Password</Button>
                <h1 className="my-3">{`${details.firstName} ${details.lastName}`}</h1>
                <h5 className='my-2'>Contact Details</h5>
                <h5 className='lead'>{details.email}</h5>
                <h5 className='lead'>{details.mobileNo}</h5>

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