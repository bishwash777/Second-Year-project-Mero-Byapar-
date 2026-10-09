const express = require('express');
const mongoose = require('mongoose');

// Create a router
const router = express.Router();

// MongoDB Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// POST /newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already subscribed' });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
