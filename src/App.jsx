import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Navbar from './pages/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SavedRecipes from './pages/savedRecipes';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe/:id" element={<Details />} />
                    <Route path="/SavedRecipe" element={<SavedRecipes />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
