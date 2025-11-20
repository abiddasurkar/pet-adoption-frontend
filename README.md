# Pet Adoption Management System – Frontend

A responsive React app I built for managing pet adoption workflows. It covers the entire flow—from browsing pets to applying for adoption and an admin panel for managing requests. The app uses React 18, Context API for state management, and Tailwind CSS for styling.

---

## 🌟 Features

### Visitors (No Login Required)
- Browse pets with pagination  
- Search by name or breed  
- Filter pets by species, age, and breed  
- View complete pet details  
- Fully responsive layout  

### Users (Logged In)
- Register and login  
- Apply for pet adoption  
- Track all submitted applications  
- Check application status (Pending / Approved / Rejected)  
- View admin notes  
- Update basic profile info  

### Admin
- Add, edit, and remove pets  
- View all adoption applications  
- Approve or reject applications  
- Add internal notes  
- Manage pet availability and basic stats  

---

## 📁 Project Structure

```
src/
  components/        → Shared components
  context/           → Auth, Pets, Applications, UI context
  pages/             → All screens/pages
  hooks/             → Custom hooks
  utils/             → Axios instance, helpers, constants
  App.js             → Main routing setup
  index.js           → React entry point
  index.css          → Tailwind + custom styles
```

The structure is simple, clean, and easy to maintain.

---

## 🚀 Getting Started

### Requirements
- Node.js 16+
- npm / yarn
- Git

### Installation

```bash
git clone https://github.com/abiddasurkar/pet-adoption-frontend
cd pet-adoption-frontend
npm install
cp .env.example .env
```

Update environment variables:

```
REACT_APP_API_URL=http://localhost:0000 //not decided
```

Run locally:

```bash
npm start
```

App runs on:  
`http://localhost:3000`

---

## 🏗️ Architecture Overview

This project uses **React Context API** for global state:

### AuthContext
- Handles login/signup  
- JWT-based authentication  
- Stores user role  
- Auto restores session  

### PetsContext
- Fetch pets  
- Apply filters & search  
- Pagination  
- Admin CRUD  

### ApplicationsContext
- Create adoption application  
- Fetch user applications  
- Admin approve/reject  

### UIContext
- Toasts  
- Modals  
- Global loading states  

---

## 📡 API Integration

Base URL:

```js
const API_URL = process.env.REACT_APP_API_URL;
```

### API Endpoints

#### Public
```
GET /api/pets
GET /api/pets/:id
```

#### User (Auth Required)
```
POST /api/auth/signup
POST /api/auth/login
POST /api/applications
GET  /api/applications/my
```

#### Admin
```
POST   /api/pets
PUT    /api/pets/:id
DELETE /api/pets/:id
GET    /api/applications
PUT    /api/applications/:id/approve
PUT    /api/applications/:id/reject
```

---

## 🎨 UI & Styling

- TailwindCSS for layout & utilities  
- Custom animations & components  
- Simple toast system  
- Fully responsive  

Color palette:

```
#8b5cf6  → Primary
#ec4899  → Secondary
#10b981  → Success
#ef4444  → Error
#f59e0b  → Warning
#3b82f6  → Info
```

---

## 🔐 Authentication

- JWT stored in localStorage  
- Auto session restore  
- Token check on every protected route  

Example:

```jsx
<ProtectedRoute requiredRole="user">
  <UserDashboard />
</ProtectedRoute>
```

---

## 🧪 Testing

```bash
npm test
npm test -- --coverage
```

---

## 📦 Build & Deploy

Build production:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

---

## 🐛 Common Issues & Fixes

### Port already in use
```bash
PORT=3001 npm start
```

### Tailwind not loading
```bash
rm -rf node_modules
npm install
```

### CORS errors
- Check backend CORS  
- Verify `REACT_APP_API_URL`  

---

## 🤝 Contributing

1. Fork this repo  
2. Create a feature branch  
3. Commit your changes  
4. Push to remote  
5. Open a Pull Request  

---

## 🎯 Future Enhancements

- Image upload for pets  
- Notifications  
- Medical records section  
- Basic analytics dashboard  
- Mobile app (React Native)  
- Blog & FAQs  

---
