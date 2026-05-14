# 🛫 FSHN Airlines API

**FSHN Airlines API** është shërbimi Back-End i krijuar për menaxhimin e fluturimeve, rezervimeve dhe check-in-it të pasagjerëve. Është ndërtuar me **Node.js** dhe **Express** duke përdorur skedarë JSON për ruajtjen e të dhënave (file-based storage).

## 📂 Struktura e Projektit

Projekti ndjek një strukturë të thjeshtë dhe të pastër:

```text
FSHN-Airlines-API/
├── data/                 # Ruajtja e të dhënave (Flights & Bookings)
│   ├── flights.json      # Listë fluturimesh
│   └── bookings.json     # Listë rezervimesh
├── routes/               # Përkufizimi i endpoints (Flights, Bookings, Check-in)
│   ├── flights.js
│   ├── bookings.js
│   └── checkin.js
├── server.js             # Pika kryesore e aplikacionit (Entry Point)
├── package.json          # Varësitë e projektit (Express, CORS, etc.)
└── README.md             # Dokumentacioni
