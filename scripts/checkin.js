// FSHN-Airlines-API/routes/checkin.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const BOOKINGS_FILE = path.join(__dirname, '..', 'data', 'bookings.json');

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

const generateSeatNumber = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const seat = seats[Math.floor(Math.random() * seats.length)];
  return row + seat;
};

const generateGate = () => {
  return 'A' + Math.floor(Math.random() * 20 + 1);
};

// ========== RRUGËT ==========

// 1️⃣ POST - Kryej check-in
router.post('/', (req, res) => {
  const { pnr, passportNumber } = req.body;

  // Validimi
  if (!pnr || !passportNumber) {
    return res.status(400).json({
      success: false,
      error: 'Të dhëna të mangëta',
      required: ['pnr', 'passportNumber']
    });
  }

  const bookings = readBookings();
  const booking = bookings.find(b => b.pnr === pnr && b.passportNumber === passportNumber);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet ose të dhënat nuk përputhen'
    });
  }

  if (booking.checkInStatus === 'Completed') {
    return res.status(400).json({
      success: false,
      error: 'Check-in është bërë tashmë për këtë rezervim',
      boardingPass: booking.boardingPass
    });
  }

  // Përditëso check-in statusin
  const seatNumber = generateSeatNumber();
  const gate = generateGate();

  booking.checkInStatus = 'Completed';
  booking.seatNumber = seatNumber;
  booking.gate = gate;
  booking.boardingPass = {
    issuedAt: new Date().toISOString(),
    gate: gate,
    seat: seatNumber,
    boardingTime: '30 min para nisjes'
  };

  const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
  bookings[bookingIndex] = booking;

  if (writeBookings(bookings)) {
    res.json({
      success: true,
      message: 'Check-in u kriju me sukses!',
      boardingPass: {
        pnr: booking.pnr,
        passenger: booking.passengerName,
        flight: booking.flightNumber,
        route: booking.route,
        departureTime: booking.departureTime,
        gate: gate,
        seat: seatNumber,
        boardingTime: '30 min para nisjes',
        status: 'Ready to Board'
      }
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server gjatë check-in'
    });
  }
});

// 2️⃣ GET - Merr statusin e check-in sipas PNR
router.get('/:pnr', (req, res) => {
  const bookings = readBookings();
  const booking = bookings.find(b => b.pnr === req.params.pnr);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet'
    });
  }

  res.json({
    success: true,
    data: {
      pnr: booking.pnr,
      passenger: booking.passengerName,
      flight: booking.flightNumber,
      checkInStatus: booking.checkInStatus,
      boardingPass: booking.boardingPass || null
    }
  });
});

// 3️⃣ POST - Kancela check-in
router.post('/cancel/:pnr', (req, res) => {
  const bookings = readBookings();
  const bookingIndex = bookings.findIndex(b => b.pnr === req.params.pnr);

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Rezervimi nuk u gjet'
    });
  }

  bookings[bookingIndex].checkInStatus = 'Cancelled';
  bookings[bookingIndex].boardingPass = null;

  if (writeBookings(bookings)) {
    res.json({
      success: true,
      message: 'Check-in u anulua me sukses'
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Gabim në server'
    });
  }
});

module.exports = router;