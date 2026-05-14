🛫 FSHN Airlines API

FSHN Airlines API është pjesa Back-End e sistemit të rezervimit të fluturimeve. Aplikacioni është zhvilluar me Node.js dhe Express, ndërsa të dhënat ruhen në skedarë JSON për një menaxhim të thjeshtë dhe praktik të informacionit.

API mundëson komunikimin me klientin (Front-End) për funksione si:

- Marrja e fluturimeve
- Krijimi i rezervimeve
- Check-in i pasagjerëve
- Menaxhimi i të dhënave të udhëtarëve

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
