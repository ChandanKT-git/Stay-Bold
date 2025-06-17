# StayFinder - Airbnb Clone

A full-stack web application for property rentals, built with React, Node.js, Express, and MongoDB.

## Features

### For Guests
- Browse and search properties with advanced filters
- View detailed property information with image galleries
- Interactive maps showing property locations
- Secure booking system with date validation
- User authentication and profile management
- Booking history and management

### For Hosts
- Host dashboard with analytics
- Create, edit, and delete property listings
- Manage bookings and view revenue
- Upload multiple property images
- Set amenities and property details

### Technical Features
- Responsive design optimized for all devices
- JWT-based authentication
- RESTful API with proper error handling
- MongoDB database with proper indexing
- Mock Stripe integration for payments
- Mapbox integration for maps
- Input validation and sanitization
- CORS and security middleware

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Mapbox GL JS** for maps
- **date-fns** for date handling
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## Project Structure

```
stayfinder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   ├── seed/           # Database seeding
│   │   └── types/          # TypeScript types
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stayfinder
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stayfinder
JWT_SECRET=your_super_secret_jwt_key_change_in_production
MAPBOX_API_KEY=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGFtcGxlIn0.example
STRIPE_SECRET_KEY=sk_test_51Example123456789
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_API_KEY=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGFtcGxlIn0.example
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Example123456789
```

### 4. Database Setup
Make sure MongoDB is running, then seed the database:
```bash
cd server
npm run seed
```

### 5. Start the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Test Accounts

The seeded database includes test accounts:

**Host Account:**
- Email: test@stayfinder.com
- Password: Test123!

**Guest Account:**
- Email: guest@stayfinder.com
- Password: Guest123!

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listing Endpoints
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (host only)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)
- `GET /api/listings/host/my-listings` - Get host's listings

### Booking Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/host` - Get host's bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Search Parameters
- `location` - Search by location
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `startDate` - Check-in date
- `endDate` - Check-out date
- `guests` - Number of guests

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `MAPBOX_API_KEY` - Mapbox API key for maps
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_MAPBOX_API_KEY` - Mapbox public API key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update environment variables for production
3. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to services like Netlify, Vercel, or AWS S3

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.