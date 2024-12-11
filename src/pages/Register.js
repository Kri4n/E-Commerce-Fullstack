import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Register() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);

  // State hooks to store the values of the input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State to determine whether the submit button is enabled or not
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      (firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "") &&
      (password === confirmPassword) &&
      (mobileNo.length === 11) 
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  function registerUser(e) {

    e.preventDefault();

    fetch('http://localhost:4006/b6/users/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.message === "User registered successfully") {
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobileNo('');
        setPassword('');
        setConfirmPassword('');

        notyf.success("Registration successful");  // Fixed typo here
      } else {
        notyf.error(data.message || "Registration failed");
      }
    })
    .catch(err => {
      console.error(err);
      notyf.error("Something went wrong");
    });
  }

  return (
    (user.id !== null) ? 
      <Navigate to="/shop" /> 
      : 
      <Form onSubmit={(e) => registerUser(e)}>
        <h1 className="my-5 text-center">Register</h1>
        <Form.Group>
          <Form.Label>First Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter First Name" 
            required 
            value={firstName}
            onChange={e => { setFirstName(e.target.value) }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Last Name" 
            required  
            value={lastName}
            onChange={e => { setLastName(e.target.value) }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter Email" 
            required 
            value={email}
            onChange={e => { setEmail(e.target.value) }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile No:</Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Enter 11 Digit No." 
            required  
            value={mobileNo}
            onChange={e => { setMobileNo(e.target.value) }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Enter Password" 
            required 
            value={password}
            onChange={e => { setPassword(e.target.value) }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            required 
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value) }}
          />
        </Form.Group>
        { isActive ?
          <Button className='mt-1 mb-3' variant="primary" type="submit" id="submitBtn">Submit</Button> 
          : 
          <Button className='mt-1 mb-3' variant="primary" type="submit" id="submitBtn" disabled>Submit</Button>
        }
      </Form>
  );
}
