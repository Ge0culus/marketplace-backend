import { Listing } from '../models/Listing.js'

export const createListing = async (req, res) => {
  const { title, description, price, imageUrl } = req.body
  const listing = await Listing.create({
    title,
    description,
    price,
    imageUrl,
    ownerId: req.user.id
  })
  res.status(201).json(listing)
}

export const getAllListings = async (req, res) => {
  const listings = await Listing.findAll()
  res.json(listings)
}

export const getListing = async (req, res) => {
  const listing = await Listing.findByPk(req.params.id)
  if (!listing) return res.status(404).json({ error: 'Not found' })
  res.json(listing)
}

export const getMyListings = async (req, res) => {
  const listings = await Listing.findAll({ where: { ownerId: req.user.id } })
  res.json(listings)
}

export const updateListing = async (req, res) => {
  const listing = await Listing.findByPk(req.params.id)
  if (!listing || listing.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  await listing.update(req.body)
  res.json(listing)
}

export const deleteListing = async (req, res) => {
  const listing = await Listing.findByPk(req.params.id)
  if (!listing || listing.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  await listing.destroy()
  res.status(204).end()
}
