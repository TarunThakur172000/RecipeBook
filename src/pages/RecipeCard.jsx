import React from 'react';
import { Card, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function RecipeCard({ recipe }) {
    return (
        <Card className="shadow-sm recipe-card">
            <Card.Img 
                variant="top" 
                src={recipe.image} 
                alt={recipe.title} 
                className="card-img"
            />
            <Card.Body>
                <Card.Title className="recipe-title">{recipe.title}</Card.Title>
                <Card.Text className="recipe-description">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{recipe.title}</Tooltip>}
                    >
                        <p className="mb-2">
                            A delicious recipe to try! 
                            <span className="text-muted"> Click for more details.</span>
                        </p>
                    </OverlayTrigger>
                </Card.Text>
                <div className="d-flex justify-content-start">
                    {/* Example Badges */}
                    <Badge pill variant="success" className="mr-2">
                        Vegan
                    </Badge>
                    <Badge pill variant="warning">
                        20 min
                    </Badge>
                </div>
            </Card.Body>
        </Card>
    );
}
