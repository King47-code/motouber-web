// File: server/routes/rides.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../middleware/auth');

// POST: Add a new ride
router.post('/', authenticate, async (req, res) => {
  const {
    driver_id,
    pickup_location,
    dropoff_location,
    ride_type,
    status,
    fare
  } = req.body;

  const passenger_id = req.user.id;

  try {
    const newRide = await db('rides').insert({
      passenger_id,
      driver_id,
      pickup_location,
      dropoff_location,
      ride_type,
      status,
      fare,
      created_at: new Date()
    }).returning('*');

    res.status(201).json(newRide[0]);
  } catch (err) {
    console.error('Error adding ride:', err);
    res.status(500).json({ error: 'Failed to add ride' });
  }
});

// GET: All rides (filtered by role, status, date)
router.get('/', authenticate, async (req, res) => {
  const { status, date } = req.query;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const query = db('rides').select('*');

    if (role === 'rider') {
      query.where('passenger_id', userId);
    } else if (role === 'driver') {
      query.where('driver_id', userId);
    }

    if (status) query.andWhere('status', status);

    if (date) {
      const dateOnly = new Date(date).toISOString().split('T')[0];
      query.andWhereRaw("DATE(created_at) = ?", [dateOnly]);
    }

    const rides = await query.orderBy('created_at', 'desc');
    res.json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// GET: Available rides for drivers (pending and unassigned)
router.get('/available', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can access available rides' });
  }

  try {
    const rides = await db('rides')
      .select('*')
      .whereNull('driver_id')
      .andWhere('status', 'pending')
      .orderBy('created_at', 'desc');

    res.json(rides);
  } catch (err) {
    console.error('Error fetching available rides:', err);
    res.status(500).json({ error: 'Failed to load available rides' });
  }
});

// PATCH: Accept or reject a ride
router.patch('/:id/assign', authenticate, async (req, res) => {
  const rideId = req.params.id;
  const { action } = req.body;

  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can accept or reject rides' });
  }

  try {
    if (action === 'accept') {
      const updated = await db('rides')
        .where({ id: rideId, driver_id: null })
        .update({ driver_id: req.user.id, status: 'accepted' })
        .returning('*');

      if (!updated.length) return res.status(404).json({ error: 'Ride not available' });
      res.json(updated[0]);

    } else if (action === 'reject') {
      res.status(200).json({ message: 'Ride rejected (no update performed)' });

    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('Error updating ride:', err);
    res.status(500).json({ error: 'Failed to process ride request' });
  }
});

// POST: Driver sets preferred destination
router.post('/drivers/set-destination', authenticate, async (req, res) => {
  const { preferred_destination } = req.body;

  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can set destinations' });
  }

  try {
    await db('drivers')
      .where({ id: req.user.id })
      .update({ preferred_destination });

    res.json({ message: 'Destination saved' });
  } catch (err) {
    console.error('Error saving destination:', err);
    res.status(500).json({ error: 'Failed to save destination' });
  }
});

// GET: Driver earnings (filter by day/week/month/year)
router.get('/driver/earnings', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can view earnings' });
  }

  const { filter = 'day' } = req.query;

  let dateCondition;
  switch (filter) {
    case 'day':
      dateCondition = db.raw("DATE(created_at) = CURRENT_DATE");
      break;
    case 'week':
      dateCondition = db.raw("DATE_PART('week', created_at) = DATE_PART('week', CURRENT_DATE)");
      break;
    case 'month':
      dateCondition = db.raw("DATE_PART('month', created_at) = DATE_PART('month', CURRENT_DATE)");
      break;
    case 'year':
      dateCondition = db.raw("DATE_PART('year', created_at) = DATE_PART('year', CURRENT_DATE)");
      break;
    default:
      return res.status(400).json({ error: 'Invalid filter' });
  }

  try {
    const rides = await db('rides')
      .where('driver_id', req.user.id)
      .andWhere(dateCondition)
      .select('fare', db.raw("DATE(created_at) as date"));

    const history = rides.reduce((acc, ride) => {
      const date = ride.date.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + ride.fare;
      return acc;
    }, {});

    const todayTotal = Object.values(history).reduce((a, b) => a + b, 0);

    res.json({
      today: todayTotal,
      history: Object.entries(history).map(([date, amount]) => ({ date, amount }))
    });
  } catch (err) {
    console.error('Error loading earnings:', err);
    res.status(500).json({ error: 'Failed to load earnings' });
  }
});

// GET: Messages for a specific ride
router.get('/driver/messages', authenticate, async (req, res) => {
  const { ride_id } = req.query;

  try {
    const messages = await db('messages')
      .where({ ride_id })
      .orderBy('sent_at', 'asc');

    res.json(messages);
  } catch (err) {
    console.error('Error loading messages:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// POST: Send a message for a ride
router.post('/driver/messages', authenticate, async (req, res) => {
  const { ride_id, message } = req.body;

  try {
    const newMsg = await db('messages').insert({
      ride_id,
      message,
      sent_at: new Date()
    }).returning('*');

    res.status(201).json(newMsg[0]);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
