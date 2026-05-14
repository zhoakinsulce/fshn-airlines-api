// FSHN-Airlines-API/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Importo rrugët
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const checkinRoutes = require('./routes/checkin');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors()); // Lejon Front-End të komunikojë me Back-End
app.use(bodyParser.json()); // Përdorur për të lexuar JSON
app.use(bodyParser.urlencoded({ extended: true }));

// ========== INICIALIZIMI I DOSJES DATA ==========
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('✅ Dosja "data" u krijua me sukses');
}

// ========== RRUGËT E API ==========

// Përshëndetje
app.get('/', (req, res) => {
  res.json({
    message: '🛫 FSHN Airlines API - Mirësevini!',
    version: '1.0.0',
    endpoints: {
      flights: '/api/flights',
      bookings: '/api/bookings',
      checkin: '/api/checkin',
      health: '/api/health'
    }
  });
});

// Kontrolli i shëndetit të serverit
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FSHN Airlines API është aktiv',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rrugët e fluturimeve
app.use('/api/flights', flightRoutes);

// Rrugët e rezervimeve
app.use('/api/bookings', bookingRoutes);

// Rrugët e check-in
app.use('/api/checkin', checkinRoutes);

// ========== MENAXHIMI I GABIMEVE ==========

// Rruga për të gjitha kërkesat e panjohura
app.use((req, res) => {
  res.status(404).json({
    error: 'Rruga e kërkuar nuk u gjet',
    path: req.path,
    method: req.method,
    message: 'Përdorni /api/flights, /api/bookings, ose /api/checkin'
  });
});

// ========== NISJA E SERVERIT ==========
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   🛫 FSHN AIRLINES API - NISUR ME SUKSES  ║');
  console.log('╠═══════════════════════════════════════════╣');
  console.log(`║ 📍 Adresa: http://localhost:${PORT}`);
  console.log('║                                           ║');
  console.log('║ 🔌 Endpointet e Disponueshme:            ║');
  console.log(`║ • GET    http://localhost:${PORT}/api/health`);
  console.log(`║ • GET    http://localhost:${PORT}/api/flights`);
  console.log(`║ • POST   http://localhost:${PORT}/api/bookings`);
  console.log(`║ • POST   http://localhost:${PORT}/api/checkin`);
  console.log('║                                           ║');
  console.log('║ 📌 Për të ndalur: Shtyp CTRL+C            ║');
  console.log('╚═══════════════════════════════════════════╝');
});

module.exports = app;
