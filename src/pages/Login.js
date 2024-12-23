import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';

import UserContext from '../context/UserContext';

export default function Login() {
    const notyf = new Notyf();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);
    
    const { user, setUser } = useContext(UserContext);
    
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const navigate = useNavigate();
    
    function authenticate(e) {
        e.preventDefault();
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
            .then(data => {
                if (data.access !== undefined) {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);
                    setEmail('');
                    setPassword('');
                    notyf.success('Successfully Logged in');
                    } else if (data.message === "Incorrect email or password") {
                        notyf.error('Incorrect Credentials. Try again.');
                        } else {
                            notyf.error('User Not Found. Try Again');
                }
        });
    }
    
    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({ id: data._id, isAdmin: data.isAdmin });
            setIsLoggedIn(true);
            navigate('/products');
        });
    }
    
    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);
    
    if (isLoggedIn || user.id !== null) {
        return <Navigate to="/products" />;
    }
    
    return (
        <div className="border rounded p-3 shadow mt-5 mb-5 d-flex justify-content-center">
        <div className="w-50 my-3"> 
        <Form onSubmit={(e) => authenticate(e)}>
        <h2 className="p-5 text-center">Login</h2>
        <div className="d-flex flex-column p-3">
        <Form.Group>
        <Form.Control
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        </Form.Group>
        
        <Form.Group className="mb-3 mt-3">
        <Form.Control
        type="password"
        placeholder="Enter your password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        </Form.Group>
        </div>
        <div className="d-flex justify-content-center mb-5">
        {isActive ? (
            <Button
            className="w-50 mt-5"
            variant="dark"
            type="submit"
            id="loginBtn"
            >
            Login
            </Button>
        ) : (
            <Button
            className="w-50 mt-5"
            variant="outline"
            type="submit"
            id="loginBtn"
            disabled
            >
            Login
            </Button>
        )}
        </div>
        </Form>
        </div>
        </div>
        
    );
}
