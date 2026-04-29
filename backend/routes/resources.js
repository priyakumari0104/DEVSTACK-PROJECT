const express = require('express');
const router = express.Router();
const Resource = require('../models/resources');
const auth = require('../middleware/authMiddleware');

// POST: Save a new resource (Protected by auth)
router.post('/add', auth, async (req, res) => {
    try {
        const { title, link, category, description } = req.body;
        const newResource = new Resource({
            title, link, category, description,
            userId: req.user.id // Linked to the logged-in user
        });
        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch resources only for the logged-in user
router.get('/all', auth, async (req, res) => {
    try {
        const resources = await Resource.find({ userId: req.user.id });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;