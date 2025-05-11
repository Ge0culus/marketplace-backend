import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const register = async (req, res) => {
  const { username, password } = req.body
  const existing = await User.findOne({ where: { username } })
  if (existing) return res.status(400).json({ error: 'User exists' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, passwordHash })

  res.status(201).json({ message: 'User created', userId: user.id })
}

export const login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })
  const correct = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!correct) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET)
  res.json({ token, username: user.username })
}
