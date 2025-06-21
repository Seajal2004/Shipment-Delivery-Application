# Shipment Delivery Application

A modern React-based shipment tracking and management application built with Vite, Tailwind CSS, and Firebase.

## Features

- **User Authentication**: Register and login with Firebase Auth
- **Shipment Management**: Create new shipments with detailed information
- **Real-time Tracking**: Track shipment status with visual progress indicators
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Dashboard**: Overview of all shipments with statistics
- **Secure Routes**: Protected pages for authenticated users only

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and Firestore Database
4. Get your Firebase config from Project Settings
5. Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shipments/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 3. Authentication Setup

In Firebase Console:
1. Go to Authentication > Sign-in method
2. Enable Email/Password authentication

### 4. Run the Application

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

## Application Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation component
│   └── ProtectedRoute.jsx  # Route protection
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Registration page
│   ├── Dashboard.jsx      # User dashboard
│   ├── CreateShipment.jsx # Shipment creation
│   └── TrackShipment.jsx  # Shipment tracking
├── firebase.js            # Firebase configuration
├── App.jsx               # Main app component
└── main.jsx              # App entry point
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Shipment**: Fill out sender, receiver, and package details
3. **Track Shipments**: Use tracking number to monitor delivery status
4. **Dashboard**: View all your shipments and statistics

## Shipment Status Flow

- **Pending**: Shipment created, awaiting pickup
- **In Transit**: Package is being delivered
- **Delivered**: Package successfully delivered

## Future Enhancements

- Payment integration with Razorpay
- Email notifications
- SMS tracking updates
- Admin panel for status updates
- Delivery photo confirmation
- Multiple package types and pricing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request