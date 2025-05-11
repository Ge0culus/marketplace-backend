const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { Listing } = require('../models/Listing');

const router = express.Router();

// Create a new listing
router.post('/', authenticate, async (req, res) => {
  const { title, description, price, imageUrl, location } = req.body;

  try {
    const listing = await Listing.create({
      title,
      description,
      price,
      imageUrl,
      location,
      ownerId: req.user.id
    });
    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create listing.' });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// Get a specific listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listing.' });
  }
});

// Get authenticated user's listings
router.get('/my', authenticate, async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { ownerId: req.user.id }
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});

// Update a listing
router.put('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or not owned by you' });
    }

    const { title, description, price, imageUrl, location } = req.body;

    listing.title = title ?? listing.title;
    listing.description = description ?? listing.description;
    listing.price = price ?? listing.price;
    listing.imageUrl = imageUrl ?? listing.imageUrl;
    listing.location = location ?? listing.location;

    await listing.save();
    res.json({ message: 'Listing updated', listing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// Delete a listing
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      where: { id: req.params.id, ownerId: req.user.id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or not yours' });
    }

    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

module.exports = router;
