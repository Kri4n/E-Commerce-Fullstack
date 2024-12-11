import { useEffect, useState } from "react"
import ProductCard from './ProductCard';
import { Form, Button } from "react-bootstrap";

import { useNavigate } from 'react-router-dom';

export default function UserView ({productsData}){

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const productsArr = productsData.map(product => {
            if(product.isActive === true) {
                return (
                    <ProductCard productProp={product} key={product._id}/>
                )
            } else {
                return null;
            }
        })

        setProducts(productsArr);

    }, [productsData])

    const handleSearch = async () => {
        try {
          const response = await fetch(`http://localhost:4006/b6/products/search-by-name`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: searchQuery })
          });
          const data = await response.json();
          setSearchResults(data);

          if (data) {
            // Navigate to the SearchResults page and pass the searchResults in the state
            navigate('/search', { state: { searchResults: data } });
        }

        } catch (error) {
          console.error('Error searching for product:', error);
        }
      };

    return(
        <>  
            <div className="my-5 d-flex justify-content-center">
            <Form className="d-flex">
                <Form.Control
                type="search"
                   id="productName"
                   value={searchQuery}
                   onChange={event => setSearchQuery(event.target.value)}
                   
                placeholder="Search Products"
                className="me-2 bg-light border-dark"
                aria-label="Search"
                />
                <Button variant="dark" onClick={handleSearch}>Search</Button>
            </Form>
            </div>
            <div className="container m-5">
            <div className="row g-1">{products}</div>
            </div>
        </>
    )
}