const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { Listing } = require('../models/Listing');

const router = express.Router();

// Create listing
router.post('/', authenticate, async (req, res) => {
  const { title, description, price, imageUrl } = req.body;

  const listingData = {
    title,
    description,
    price,
    ownerId: req.user.id
  };

  if (imageUrl && imageUrl.trim() !== '') {
    listingData.imageUrl = imageUrl;
  }

  try {
    const listing = await Listing.create(listingData);
    res.status(201).json(listing);
  } catch (err) {
  console.error('❌ Error creating listing:', err);
  res.status(500).json({ error: 'Failed to create listing.' });
}
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll();
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// Get my listings
router.get('/my', authenticate, async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { ownerId: req.user.id }
    });
    res.json(listings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});

// Delete listing
router.delete('/:id', authenticate, async (req, res) => {
  const listing = await Listing.findOne({
    where: {
      id: req.params.id,
      ownerId: req.user.id
    }
  });

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found or not yours' });
  }

  await listing.destroy();
  res.json({ message: 'Listing deleted' });
});

module.exports = router;
