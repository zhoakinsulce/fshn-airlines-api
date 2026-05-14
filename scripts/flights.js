// FSHN-Airlines-API/routes/flights.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'flights.json');

// ========== FUNKSIONET NDIHMËSE ==========

// Lexo fluturimet nga file
const readFlights = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Gabim në leximin e fluturimeve:', error.message);
    return [];
  }
};

// Ruaj fluturimet në file
const writeFlights = (flights) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(flights, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Gabim në ruajtjen e fluturimeve:', error.message);
    return false;
  }
};

// ========== RRUGËT ==========

// 1️⃣ GET - Merr të gjitha fluturimet
router.get('/', (req, res) => {
  const flights = readFlights();
  res.json({
    success: true,
    count: flights.length,
    data: flights
  });
});

// 2️⃣ GET - Merr një fluturim specifik sipas ID
router.get('/:id', (req, res) => {
  const flights = readFlights();
  const flight = flights.find(f => f.id === req.params.id);

  if (!flight) {
    return res.status(404).json({
      success: false,
      error: 'Fluturimi nuk u gjet',
      id: req.params.id
    });
  }

  res.json({
    success: true,
    data: flight
  });
});

// 3️⃣ POST - Shto një fluturim të ri (Admin)
router.post('/', (req, res) => {
  const { flightNumber, origin, destination, departureTime, arrivalTime, price, availableSeats } = req.body;

  // Validimi
  if (!flightNumber || !origin || !destination || !departureTime || !price) {
    return res.status(400).json({
      success: false,
      error: 'Të dhëna të mangëta',
      required: ['flightNumber', 'origin', 'destination', 'departureTime', 'price']
    });
  }

  const flights = readFlights();

  const newFlight = {
    id: uuidv4(),
    flightNumber: flightNumber.toUpperCase(),
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureTime: departureTime,
    arrivalTime: arrivalTime || 'N/A',
    price: parseFloat(price),
    availableSeats: availableSeats || 150,
    bookedSeats: 0,
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  };

  flights.push(newFlight);

  if (writeFlights(flights)) {
    res.status(201).json({
      success: true,
      message: 'Fluturimi u shtua me sukses',
      data: newFlight
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server gjatë ruajtjes'
    });
  }
});

// 4️⃣ PUT - Përditëso një fluturim
router.put('/:id', (req, res) => {
  const flights = readFlights();
  const flightIndex = flights.findIndex(f => f.id === req.params.id);

  if (flightIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Fluturimi nuk u gjet'
    });
  }

  const updatedFlight = {
    ...flights[flightIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  flights[flightIndex] = updatedFlight;

  if (writeFlights(flights)) {
    res.json({
      success: true,
      message: 'Fluturimi u përditësua me sukses',
      data: updatedFlight
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

// 5️⃣ DELETE - Fshi një fluturim
router.delete('/:id', (req, res) => {
  const flights = readFlights();
  const initialLength = flights.length;

  const filteredFlights = flights.filter(f => f.id !== req.params.id);

  if (initialLength === filteredFlights.length) {
    return res.status(404).json({
      success: false,
      error: 'Fluturimi nuk u gjet'
    });
  }

  if (writeFlights(filteredFlights)) {
    res.json({
      success: true,
      message: 'Fluturimi u fshi me sukses',
      deletedId: req.params.id
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

// 6️⃣ GET - Kërko fluturime sipas destinacionit
router.get('/search/by-route', (req, res) => {
  const { origin, destination, date } = req.query;
  const flights = readFlights();

  let results = flights;

  if (origin) {
    results = results.filter(f => f.origin.toLowerCase().includes(origin.toLowerCase()));
  }

  if (destination) {
    results = results.filter(f => f.destination.toLowerCase().includes(destination.toLowerCase()));
  }

  if (date) {
    results = results.filter(f => f.departureTime.startsWith(date));
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

module.exports = router;