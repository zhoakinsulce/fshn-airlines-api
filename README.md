# 🌐 FSHN Airlines API

Aplikacioni Back-End për menaxhimin e fluturimeve dhe rezervimeve të FSHN Airlines. Është ndërtuar me **Node.js** dhe **Express** për të siguruar një API të shpejtë dhe të sigurt.

## 📂 Struktura e Projektit

Projekti ndjek një organizim modular për lehtësi mirëmbajtjeje dhe zgjerimi:

```text
FSHN-Airlines-API/
├── config/             # Konfigurimi i aplikacionit (varësitë, portat)
├── data/               # Ruajtja fillestare e të dhënave (JSON)
│   ├── flights.json    # Listë fluturimesh (destination, price, time)
│   └── bookings.json   # Listë rezervimesh (passenger, flight, seats)
├── models/             # Modelet e të dhënave dhe validimi
├── routes/             # Rrugët (Endpoints) e API-së
│   ├── flights.js      # Logjika për fluturimet (GET, POST, PUT, DELETE)
│   ├── bookings.js     # Logjika për rezervimet
│   └── checkin.js      # Logjika për procesin e check-in
├── public/             # Skedarë statikë (nëse ka)
├── server.js           # Pika hyrëse e serverit
├── package.json        # Lista e varësive dhe skriptet e nisjes
└── README.md           # Dokumentacioni
