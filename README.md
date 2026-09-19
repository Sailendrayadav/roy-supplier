# RSY Supplier - Full-Stack Web Application

A modern, production-quality full-stack web application built for **RSY Supplier** (Nepal's premier construction materials supplier, heavy equipment rental, and transportation logistics enterprise).

## Technology Stack

- **Frontend**: React.js, JavaScript, Framer Motion (animations), Lucide React (icons), Tailwind CSS, Vite
- **Backend**: Node.js + Express.js REST API
- **Database**: SQL Database (SQLite with standard SQL schema, foreign keys, indexes, and automatic data seeding)
- **API Architecture**: RESTful API communicating via JSON payloads

---

## Project Structure

```
roy-supplier/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── EquipmentCard.jsx
│   │   │   ├── TransportationCard.jsx
│   │   │   ├── BulkMaterialCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── QuoteModal.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── AdminSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   └── BackToTop.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useSupplierData.js
│   │   ├── data/
│   │   │   └── seedData.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── categoriesController.js
│   │   ├── productsController.js
│   │   ├── servicesController.js
│   │   ├── equipmentController.js
│   │   ├── quotesController.js
│   │   └── contactController.js
│   ├── routes/
│   │   ├── categoriesRoutes.js
│   │   ├── productsRoutes.js
│   │   ├── servicesRoutes.js
│   │   ├── equipmentRoutes.js
│   │   ├── quotesRoutes.js
│   │   └── contactRoutes.js
│   ├── server.js
│   └── package.json
└── README.md
```

---

## Features & Core Categories

1. **Construction Materials**: OPC/PPC Cement, TMT Steel Rebars (Fe 500D), River Sand (बालुवा), Crusher Aggregate (गिट्टी), Bricks/Blocks, GI Sheets (जस्तापाता), HDPE/PVC Pipes, Electrical Materials, Paint, Tiles, GI Binding Wire, Construction Tools.
2. **Transportation**: Construction material haulage, sand/aggregate/soil transport, cement/steel transport, truck rental (6-14 wheelers), hydraulic tractor rental, Bolero pickup rental, labor crew services.
3. **Bulk & Road Construction Materials**: Crusher dust & screenings, road base course, sub-base gravel, quarry boulders & retaining stones.
4. **Construction Equipment**: CAT/Komatsu excavators, JCB backhoes, heavy tippers, hydraulic tractors, heavy freight haulers.

---

## Interactive Admin Dashboard

The application includes an integrated **Admin Dashboard** (toggleable from the Navbar):
- Inspect all submitted **Quote Requests**.
- Update quote request status (`pending`, `in_review`, `quoted`, `completed`).
- Review customer contact messages.

---

## Running the Application Locally

### 1. Start Express REST API Backend
```bash
cd backend
npm.cmd install
npm.cmd start
# Backend runs on http://localhost:5000
```

### 2. Start React Frontend
```bash
cd frontend
npm.cmd install
npm.cmd run dev
# Frontend runs on http://localhost:5173
```
