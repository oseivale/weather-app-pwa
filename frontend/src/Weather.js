import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    // Function to convert VAPID key from URL safe base64 to Uint8Array
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

    
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;  // Ensure this is set in your environment variables

    const subscribeUser = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });
                await fetch('/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                alert("Subscribed!");
            } catch (error) {
                console.error('Error subscribing to notifications:', error);
                setError('Failed to subscribe to notifications.');
            }
        }
    };

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const fetchWeather = async (e) => {
        e.preventDefault();
        setError(null);  // Clear previous errors
        try {
            const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError(error.message);
        }
    };

    return (
        <Container className="p-3">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Form onSubmit={fetchWeather}>
                        <Form.Group controlId="cityName">
                            <Form.Label>Enter city name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="City name" 
                                value={city} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Get Weather
                        </Button>
                        <Button variant="secondary" onClick={subscribeUser} className="ml-2">
                            Subscribe for Notifications
                        </Button>
                    </Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {weather && (
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title>{weather.name}</Card.Title>
                                <Card.Text>
                                    Temperature: {weather.main.temp} °C
                                    <br />
                                    Weather: {weather.weather[0].description}
                                    <br />
                                    Humidity: {weather.main.humidity}%
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Weather;
