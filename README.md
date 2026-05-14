🛫 FSHN Airlines API

FSHN Airlines API është pjesa Back-End e sistemit të rezervimit të fluturimeve. Aplikacioni është zhvilluar me Node.js dhe Express, ndërsa të dhënat ruhen në skedarë JSON për një menaxhim të thjeshtë dhe praktik të informacionit.

API mundëson komunikimin me klientin (Front-End) për funksione si:

- Marrja e fluturimeve
- Krijimi i rezervimeve
- Check-in i pasagjerëve
- Menaxhimi i të dhënave të udhëtarëve

📂 Struktura e Projektit

FSHN-Airlines-API/
│
├── data/
│   ├── flights.json
│   └── bookings.json
│
├── routes/
│   ├── flights.js
│   ├── bookings.js
│   └── checkin.js
│
├── server.js
├── package.json
└── README.md
