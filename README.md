# 🏫 School ERP (Basic Edition)

A clean, modern, and reliable School ERP system built for streamlined school management.

---

## 🛠️ Technology Stack
* **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons
* **Backend:** Node.js + Express.js (ES Modules)
* **Database & ORM:** PostgreSQL + Prisma ORM
* **Authentication:** JWT + bcryptjs
* **Services:** ImageKit (Media/Uploads), Nodemailer (Email), WhatsApp API

---

## 📁 Repository Structure
```text
school erp/
├── backend/                   # Express.js REST API server
│   ├── prisma/
│   │   └── schema.prisma      # PostgreSQL schema
│   ├── src/
│   │   ├── config/            # Prisma client & env configs
│   │   ├── core/              # Global middleware & utils (auth, error, services)
│   │   ├── modules/           # Feature modules (to be defined)
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/                  # React + Vite client
│   ├── src/
│   │   ├── components/        # UI & layout components
│   │   ├── modules/           # Feature views (to be defined)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md                  # Project overview
├── INSTRUCTIONS.md            # Coding standards & folder rules
└── PROJECT_JOURNEY.md         # Live development journey log
```
