import { useState, useEffect, useContext } from 'react';
import { Button, ButtonGroup, Table, Spinner, Alert } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import UserContext from '../context/UserContext';

export default function UserManagement() {
  const { user } = useContext(UserContext); // Accessing the current user's context to check if they're an admin
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notyf = new Notyf();

  // Fetch users data
  useEffect(() => {
    const token = localStorage.getItem('token'); // Ensure token is available
    if (!token) {
      setError('No token found. Please login again.');
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch users again after admin toggle
  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login again.');
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Toggle admin status
  const handleAdminToggle = (userId, isAdmin) => {
    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('No token found. Please login again.');
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/set-as-admin`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update user');
        }
        return res.json();
      })
      .then((updatedUser) => {
        // Trigger a re-fetch of users after updating the admin status
        fetchUsers();
        notyf.success(`User ${updatedUser.updatedUser.email} now ${updatedUser.updatedUser.isAdmin ? 'is an admin' : 'is a regular user'}`);
      })
      .catch((err) => {
        notyf.error(err.message);
      });
  };

  if (!user.isAdmin) {
    // Redirect or show an error if the logged-in user is not an admin
    return <Alert variant="danger">You do not have permission to access this page.</Alert>;
  }

  return (
    <div>
      <h2 className='text-center'>User Management</h2>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-center mt-3">
        <ButtonGroup className='pb-4'>
        <Button as={Link} to="/products" variant="primary">
          Back to Dashboard
        </Button>
        <Button as={Link} to="/all-orders" variant="secondary">
          Go to All Orders
        </Button>
        </ButtonGroup>
      </div>

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && !error && users.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td className='table-actions'>
                  <Button
                    variant={user.isAdmin ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => handleAdminToggle(user._id, user.isAdmin)}
                  >
                    {user.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
