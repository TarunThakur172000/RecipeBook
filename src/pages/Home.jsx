import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { Form, FormControl, Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { FaSearch, FaExclamationTriangle, FaStar } from 'react-icons/fa';

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [limitExceeded, setLimitExceeded] = useState(false); 
    const [ratings, setRatings] = useState(JSON.parse(localStorage.getItem('ratings')) || {});
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        fetchRecipes();
    }, [diet, cuisine]);

    const fetchRecipes = (query = '') => {
        setLoading(true);
        setError(null);
        setLimitExceeded(false); 

        let url = `${API_URL}/complexSearch?apiKey=${API_KEY}&query=${query}`;
        
        if (diet) url += `&diet=${diet}`;
        if (cuisine) url += `&cuisine=${cuisine}`;

        fetch(url)
            .then((res) => {
                if (res.status === 402) {
                    setLimitExceeded(true);
                    throw new Error('API limit exceeded');
                }
                return res.json();
            })
            .then((data) => {
                setRecipes(data.results || []);
                setLoading(false);
            })
            .catch((error) => {
                if (!limitExceeded) {
                    setError('Failed to fetch recipes. Please try again later.');
                }
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(searchTerm);
    };

    const handleDietChange = (selectedDiet) => {
        setDiet(selectedDiet);
    };

    const handleCuisineChange = (selectedCuisine) => {
        setCuisine(selectedCuisine);
    };

    const clearFilters = () => {
        setDiet('');
        setCuisine('');
        setSearchTerm('');
        fetchRecipes('');
    };

    const saveToFavorites = (recipe) => {
        if (!user) {
            alert('Please login to save recipes.');
            return;
        }
        if (!favorites.some(fav => fav.id === recipe.id)) {
            const updatedFavorites = [...favorites, recipe];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }
    };

    const rateRecipe = (recipeId, rating) => {
        if (!user) {
            alert('Please login to rate recipes.');
            return;
        }
        const updatedRatings = { ...ratings, [recipeId]: rating };
        setRatings(updatedRatings);
        localStorage.setItem('ratings', JSON.stringify(updatedRatings));
    };

    const handleLogin = () => {
        const mockUser = { name: 'User', email: 'user@example.com' };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <div className="bg-light py-4">
            <h1 className="text-center my-4 font-weight-bold text-primary">Recipes</h1>
            
            {user ? (
                <div className="text-end me-3">
                    <span className="me-2">Welcome, {user.name}</span>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </div>
            ) : (
                <div className="text-end me-3">
                    <Button variant="success" onClick={handleLogin}>Login</Button>
                </div>
            )}

            <Form className="d-flex mb-4 justify-content-center" onSubmit={handleSearch}>
                <FormControl
                    type="search"
                    placeholder="Search for recipes..."
                    className="me-2 search-input"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit" className="search-button">
                    <FaSearch />
                </Button>
            </Form>

            <div className="d-flex justify-content-between mb-4">
                <DropdownButton id="diet-filter" title={diet ? `Diet: ${diet}` : "Select Diet"} onSelect={handleDietChange}>
                    <Dropdown.Item eventKey="">All Diets</Dropdown.Item>
                    <Dropdown.Item eventKey="vegetarian">Vegetarian</Dropdown.Item>
                    <Dropdown.Item eventKey="vegan">Vegan</Dropdown.Item>
                    <Dropdown.Item eventKey="glutenFree">Gluten-Free</Dropdown.Item>
                    <Dropdown.Item eventKey="dairyFree">Dairy-Free</Dropdown.Item>
                </DropdownButton>

                <DropdownButton id="cuisine-filter" title={cuisine ? `Cuisine: ${cuisine}` : "Select Cuisine"} onSelect={handleCuisineChange}>
                    <Dropdown.Item eventKey="">All Cuisines</Dropdown.Item>
                    <Dropdown.Item eventKey="italian">Italian</Dropdown.Item>
                    <Dropdown.Item eventKey="mexican">Mexican</Dropdown.Item>
                    <Dropdown.Item eventKey="indian">Indian</Dropdown.Item>
                    <Dropdown.Item eventKey="chinese">Chinese</Dropdown.Item>
                </DropdownButton>
            </div>

            <Button variant="secondary" className="mb-4" onClick={clearFilters}>Clear Filters</Button>

            <div className="container">
                <div className="row">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-4 mb-4">
                            <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
                                <RecipeCard recipe={recipe} />
                            </Link>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => saveToFavorites(recipe)}
                                    disabled={favorites.some(fav => fav.id === recipe.id)}
                                >
                                    {favorites.some(fav => fav.id === recipe.id) ? 'Saved' : 'Save to Favorites'}
                                </Button>
                                <div>
                                    <span>Rate: </span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar 
                                            key={star} 
                                            onClick={() => rateRecipe(recipe.id, star)} 
                                            color={ratings[recipe.id] >= star ? '#FFD700' : '#ccc'} 
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
