import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import RecipeCard from './RecipeCard';

export default function SavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        // Fetch saved recipes from localStorage
        const saved = JSON.parse(localStorage.getItem('favorites')) || [];
        setSavedRecipes(saved);
    }, []);

    const removeFromFavorites = (recipeId) => {
        if (!user) {
            alert('Please login to remove recipes.');
            return;
        }
        const updatedFavorites = savedRecipes.filter(recipe => recipe.id !== recipeId);
        setSavedRecipes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="bg-light py-4">
            <h1 className="text-center my-4 font-weight-bold text-primary">Saved Recipes</h1>

            {user ? (
                <div className="text-end me-3">
                    <span className="me-2">Welcome, {user.name}</span>
                </div>
            ) : (
                <div className="text-end me-3">
                    <p>Please login to view saved recipes.</p>
                </div>
            )}

            {savedRecipes.length > 0 ? (
                <div className="container">
                    <div className="row">
                        {savedRecipes.map((recipe) => (
                            <div key={recipe.id} className="col-md-4 mb-4">
                                <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
                                    <RecipeCard recipe={recipe} />
                                </Link>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <Button 
                                        variant="danger" 
                                        onClick={() => removeFromFavorites(recipe.id)}
                                    >
                                        <FaTrash /> Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>No saved recipes yet.</p>
                </div>
            )}
        </div>
    );
}
