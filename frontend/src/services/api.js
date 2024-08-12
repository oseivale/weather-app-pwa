// src/services/api.js

// export async function handleSubscriptionRequest(subscription, location) {
//     const response = await fetch('/subscribe', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ subscription, location })
//     });
//     return response.json();
// }

export async function handleSubscriptionRequest(subscription, location) {
  const response = await fetch('/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription, location })
  });
  if (!response.ok) {
    throw new Error(`HTTP error, status = ${response.status}`);
  }
  return response.json(); // This will still fail if the response is not JSON
}
  