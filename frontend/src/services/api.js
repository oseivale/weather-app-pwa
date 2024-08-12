// src/services/api.js

export async function handleSubscriptionRequest(subscription, location) {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription, location })
    });
    return response.json();
  }
  