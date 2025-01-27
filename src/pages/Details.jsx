import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap';

export default function Details() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        fetch(`${API_URL}/${id}/information?apiKey=${API_KEY}`)
            .then((res) => res.json())
            .then((data) => {
                setRecipe(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching recipe details:', err);
                setError('Failed to load recipe details.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
    
    if (error) return (
        <Alert variant="danger" className="text-center">
            {error}
        </Alert>
    );

    return (
        <div className="container">
            <h1 className="text-center my-4">{recipe.title}</h1>
            <img src={recipe.image} alt={recipe.title} className="img-fluid rounded mb-4" style={{ maxHeight: '400px', objectFit: 'cover' }} />
            <h3>Ingredients</h3>
            <ul className="list-group mb-4">
                {recipe.extendedIngredients?.map((ingredient) => (
                    <li key={ingredient.id} className="list-group-item">{ingredient.original}</li>
                ))}
            </ul>
            <h3>Instructions</h3>
            <div className="recipe-instructions" style={{ fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            <div className="text-center mt-4">
                <Button as={Link} to="/" variant="primary">Back to Home</Button>
            </div>
        </div>
    );
}
