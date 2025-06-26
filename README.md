# 📦 ShipTrack - Professional Logistics Management Platform

A modern, full-stack web application for shipment tracking and logistics management with real-time updates, integrated payments, and professional UI/UX design.

## 🚀 Live Demo

[View Live Application](https://shipment-delivery-application.netlify.app/)

## 📋 Project Overview

ShipTrack is a comprehensive logistics management platform that enables users to create, track, and manage shipments with integrated payment processing and real-time status updates. Built with modern web technologies and featuring a professional glassmorphism design.

## ✨ Key Features

### 🔐 Authentication & Security

- **Secure Firebase Authentication** with email/password
- **Role-based Access Control** (Admin/User permissions)
- **Protected Routes** with authentication guards
- **Modern Login/Register Pages** with glassmorphism design

### 📦 Shipment Management

- **Create Shipments** with detailed sender/receiver information
- **Real-time Tracking** with unique tracking numbers (ST + timestamp)
- **Multi-status Tracking**: Pending → In Transit → Delivered/Not Delivered/Returned
- **Package Details** with size, weight, and description

### 💳 Payment Integration

- **UPI Payment System** with QR code generation
- **Dynamic Pricing Calculator** based on package specifications
- **Real-time Payment Verification** by admins
- **Transaction Tracking** and payment status management

### 👨‍💼 Admin Panel

- **Comprehensive Dashboard** for all shipments oversight
- **Payment Verification System** for transaction approval
- **Status Update Controls** for shipment lifecycle management
- **User Activity Monitoring** and system analytics

### 📊 Analytics Dashboard

- **Real-time Statistics** with animated counters
- **Performance Metrics**: Success rates, revenue tracking
- **Business Intelligence** with visual data representation
- **Live Data Updates** from database

### 🎨 Modern UI/UX Design

- **Glassmorphism Effects** with backdrop blur and transparency
- **Gradient Backgrounds** and professional color schemes
- **Framer Motion Animations** and micro-interactions
- **Fully Responsive Design** for all device sizes
- **Mobile-first Approach** with touch optimization

## 🛠️ Tech Stack

### Frontend

- **React.js 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icon library

### Backend & Database

- **Firebase Firestore** - NoSQL real-time database
- **Firebase Authentication** - User management
- **Firebase Security Rules** - Data protection

### Additional Libraries

- **React Hot Toast** - Notification system
- **Date-fns** - Date manipulation
- **React Intersection Observer** - Scroll animations
- **Headless UI** - Accessible UI components

## 🏗️ Project Structure

```
shipment-delivery-application/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Hero.jsx        # Landing page hero section
│   │   ├── Features.jsx    # Feature showcase
│   │   ├── Stats.jsx       # Real-time statistics
│   │   ├── Footer.jsx      # Site footer
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── MobileMenu.jsx  # Mobile navigation
│   │   └── ...
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Authentication
│   │   ├── Register.jsx    # User registration
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── CreateShipment.jsx # Shipment creation
│   │   ├── TrackShipment.jsx  # Tracking page
│   │   ├── Analytics.jsx   # Analytics dashboard
│   │   └── AdminPanel.jsx  # Admin management
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/              # Custom React hooks
│   │   └── useAdmin.js     # Admin permission hook
│   └── firebase.js         # Firebase configuration
├── public/                 # Static assets
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/namansingla-coder/Shipment-Delivery-Application.git
   cd Shipment-Delivery-Application
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_UPI_ID=your-upi-id@bank
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   VITE_ADMIN_EMAILS=admin@example.com,manager@example.com
   ```

4. **Firebase Setup**

   - Create a Firebase project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Update Firestore Security Rules:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /shipments/{document} {
         allow read: if true;
         allow create: if request.auth != null &&
                      request.auth.uid == request.resource.data.userId;
         allow update: if request.auth != null &&
                      request.auth.uid == resource.data.userId &&
                      !('status' in request.resource.data.diff(resource.data).affectedKeys()) &&
                      !('paymentStatus' in request.resource.data.diff(resource.data).affectedKeys());
         allow update: if request.auth != null &&
                      request.auth.token.email in ['your-admin@email.com'];
       }
     }
   }
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### For Users

1. **Register/Login** to access the platform
2. **Create Shipments** with sender/receiver details
3. **Make Payments** using UPI integration
4. **Track Shipments** with unique tracking numbers
5. **View Analytics** of your shipping activity

### For Admins

1. **Login with admin email** (configured in environment)
2. **Access Admin Panel** to manage all shipments
3. **Verify Payments** and approve transactions
4. **Update Shipment Status** throughout delivery lifecycle
5. **Monitor Platform Activity** and user engagement

## 🔧 Configuration

### Admin Setup

Add admin email addresses to the `VITE_ADMIN_EMAILS` environment variable:

```env
VITE_ADMIN_EMAILS=admin@company.com,manager@company.com
```

### Payment Configuration

Configure UPI ID for payment processing:

```env
VITE_UPI_ID=your-business-upi@bank
```

## 📱 Features Breakdown

### Shipment Status Flow

1. **Pending** - Initial status after creation
2. **In Transit** - Package is being delivered
3. **Delivered** - Successfully delivered
4. **Not Delivered** - Delivery failed
5. **Returned** - Package returned to sender

### Payment Process

1. User creates shipment with package details
2. System calculates cost based on size/weight
3. UPI QR code generated for payment
4. Admin verifies payment
5. Shipment status updated to active

### Real-time Features

- Live shipment status updates
- Real-time payment verification
- Dynamic statistics on homepage
- Instant notifications with toast messages

## 🎨 Design Features

- **Glassmorphism UI** with backdrop blur effects
- **Gradient Backgrounds** and modern color schemes
- **Smooth Animations** with Framer Motion
- **Responsive Design** for all screen sizes
- **Professional Typography** and consistent spacing
- **Interactive Elements** with hover and tap effects

## 🔒 Security Features

- **Firebase Authentication** for secure user management
- **Firestore Security Rules** for data protection
- **Role-based Access Control** for admin functions
- **Input Validation** and sanitization
- **Protected Routes** and API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling framework
- Framer Motion for animations
- Lucide React for icons
- React community for excellent documentation

---

⭐ **Star this repository if you found it helpful!**
