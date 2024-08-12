const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3080;

app.use(cors());
// Body parser middleware to parse HTTP body in order to read JSON data
app.use(bodyParser.json());

// VAPID keys should be generated and stored securely
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  'mailto:example@yourdomain.com',
  publicVapidKey,
  privateVapidKey
);

// Store subscriptions in a makeshift database
let subscriptions = [];

// Subscribe Route
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription added.' });
});


// Route to send the notification
app.post('/notify', (req, res) => {
  const notificationPayload = {
    notification: {
      title: 'New Weather Alert!',
      body: 'There is a new weather update available.',
      icon: 'icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [{ action: "explore", title: "Go to the site" }]
    }
  };

  Promise.all(subscriptions.map(sub => webPush.sendNotification(sub, JSON.stringify(notificationPayload))))
    .then(() => res.status(200).json({ message: 'Notifications sent' }))
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
});

// HTTPS server setup
const privateKey = fs.readFileSync('../frontend/localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('../frontend/localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Secure server started on https://localhost:${PORT}`);
});