import React, { useState, useEffect } from 'react';
import ProductCard from "../components/ProductCard";
import { useLocation } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";

export default function SearchResults() {
    const location = useLocation(); // Get the location object
    const initialResults = location.state?.searchResults || []; // Retrieve initial search results from state

    // Local state to manage the search query and search results
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(initialResults);

    const handleSearch = async () => {
        try {
            // If the search query is empty, return the initial results
            if (searchQuery.trim() === '') {
                setSearchResults(initialResults);
                return;
            }

            const response = await fetch(`http://localhost:4006/b6/products/search-by-name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: searchQuery })
            });
            const data = await response.json();
            setSearchResults(data); // Update search results with new search query
        } catch (error) {
            console.error('Error searching for product:', error);
        }
    };

    
    return (
        <>
            <div className="my-5 d-flex justify-content-center">
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        id="productName"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        placeholder="Search Products"
                        className="me-2 border-dark"
                        aria-label="Search"
                    />
                    <Button variant="dark" onClick={handleSearch}>Search</Button>
                </Form>
            </div>
            <div className="container m-5">
                <div className="row g-1">
                    {searchResults.length > 0 ? (
                        searchResults.map(product => (
                            <ProductCard productProp={product} key={product._id} />
                        ))
                    ) : (
                        <p className='text-center h4'>No products found</p>
                    )}
                </div>
            </div>
        </>
    );
}
