// FSHN-Airlines-API/routes/bookings.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const BOOKINGS_FILE = path.join(__dirname, '..', 'data', 'bookings.json');
const FLIGHTS_FILE = path.join(__dirname, '..', 'data', 'flights.json');

// ========== FUNKSIONET NDIHMËSE ==========

const readBookings = () => {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Gabim në leximin e rezervimeve:', error.message);
    return [];
  }
};

const writeBookings = (bookings) => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Gabim në ruajtjen e rezervimeve:', error.message);
    return false;
  }
};

const readFlights = () => {
  try {
    if (!fs.existsSync(FLIGHTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(FLIGHTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const generatePNR = () => {
  return 'FA' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// ========== RRUGËT ==========

// 1️⃣ GET - Merr të gjitha rezervimet
router.get('/', (req, res) => {
  const bookings = readBookings();
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// 2️⃣ GET - Merr një rezervim sipas PNR
router.get('/pnr/:pnr', (req, res) => {
  const bookings = readBookings();
  const booking = bookings.find(b => b.pnr === req.params.pnr);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet',
      pnr: req.params.pnr
    });
  }

  res.json({
    success: true,
    data: booking
  });
});

// 3️⃣ POST - Krijo një rezervim të ri
router.post('/', (req, res) => {
  const { flightId, passengerName, passportNumber, email, phone } = req.body;

  // Validimi
  if (!flightId || !passengerName || !passportNumber) {
    return res.status(400).json({
      success: false,
      error: 'Të dhëna të mangëta',
      required: ['flightId', 'passengerName', 'passportNumber']
    });
  }

  const flights = readFlights();
  const flight = flights.find(f => f.id === flightId);

  if (!flight) {
    return res.status(404).json({
      success: false,
      error: 'Fluturimi nuk u gjet'
    });
  }

  if (flight.bookedSeats >= flight.availableSeats) {
    return res.status(400).json({
      success: false,
      error: 'Nuk ka vende të lira në këtë fluturim'
    });
  }

  const bookings = readBookings();
  const pnr = generatePNR();

  const newBooking = {
    id: uuidv4(),
    pnr: pnr,
    flightId: flightId,
    flightNumber: flight.flightNumber,
    passengerName: passengerName,
    passportNumber: passportNumber,
    email: email || 'N/A',
    phone: phone || 'N/A',
    status: 'Confirmed',
    seatNumber: 'TBD',
    gate: 'TBD',
    checkInStatus: 'Pending',
    bookingDate: new Date().toISOString(),
    departureTime: flight.departureTime,
    route: `${flight.origin} → ${flight.destination}`,
    price: flight.price
  };

  bookings.push(newBooking);

  // Përditëso fluturimin (shto një vend të zënë)
  flight.bookedSeats = (flight.bookedSeats || 0) + 1;
  const updatedFlights = flights.map(f => f.id === flightId ? flight : f);
  fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(updatedFlights, null, 2));

  if (writeBookings(bookings)) {
    res.status(201).json({
      success: true,
      message: 'Rezervimi u kriju me sukses',
      data: newBooking
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

// 4️⃣ PUT - Përditëso një rezervim
router.put('/:id', (req, res) => {
  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet'
    });
  }

  const updatedBooking = {
    ...bookings[bookingIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  bookings[bookingIndex] = updatedBooking;

  if (writeBookings(bookings)) {
    res.json({
      success: true,
      message: 'Rezervimi u përditësua me sukses',
      data: updatedBooking
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

// 5️⃣ DELETE - Anulo një rezervim
router.delete('/:id', (req, res) => {
  const bookings = readBookings();
  const booking = bookings.find(b => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet'
    });
  }

  const filteredBookings = bookings.filter(b => b.id !== req.params.id);

  if (writeBookings(filteredBookings)) {
    res.json({
      success: true,
      message: 'Rezervimi u anulua me sukses',
      refund: `€${booking.price} do të kthehet brenda 5-7 ditësh`
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

module.exports = router;
