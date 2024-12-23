import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router} from 'react-router-dom';
import { Route, Routes} from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useState, useEffect } from 'react';

import AppNavBar from './components/AppNavBar';

import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AllOrders from './pages/AllOrders';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Error from './pages/Error';
import ProductCatalog from './pages/ProductCatalog';
import SearchResults from './pages/SearchResults';
import UserManagement from './pages/UserManagement'; // New page for user management

import Footer from './components/Footer';

import { Provider } from "./components/ui/provider";

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  function unsetUser(){
    localStorage.clear()
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      method: 'GET',
      credentials: 'include',
      headers: {
       'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (typeof data !== "undefined"){
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      } else {
        setUser({
          id: null,
          isAdmin: null
        })
      }
    })
  }, [])

  useEffect(() => {
    console.log(user);
    console.log(localStorage)
  }, [user]);

  return (
    <>
    <Provider>
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavBar/>
        <Container>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/products/:productId' element={<ProductCatalog/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/all-orders' element={<AllOrders/>}/>
            <Route path='/user-management' element={<UserManagement/>}/> {/* Admin can manage users */}
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='*' element={<Error/>}/>
            <Route path='/search' element={<SearchResults/>}/>
          </Routes>
        </Container>
            <Footer/>
      </Router>
    </UserProvider>
    </Provider>
    </>
  );
}

export default App;
