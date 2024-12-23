import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import { useEffect, useState, useContext } from 'react';

import UserContext from '../context/UserContext';

export default function Products(){
    
    const {user} = useContext(UserContext);

    const [products, setProducts] = useState([]);
    
    const fetchData = () => {
        let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` 
        :
        `${process.env.REACT_APP_API_BASE_URL}/products/active` 
        
        
        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setProducts(data)
        })
    }
    
    useEffect(() => {
        fetchData()
    }, [user])

    return(
        (user.isAdmin === true) ? <AdminView productsData={products} fetchData={fetchData}/> 
        :
        <UserView productsData={products}/>
    )
}