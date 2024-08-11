const express = require('express');
const router = express.Router();

// Route to handle form submission
router.post('/submit-form', (req, res) => {
    const { message } = req.body;
    // Respond with an HTMX compatible response
    res.send(`<div>Received your message: ${message}</div>`);
});

module.exports = router;
