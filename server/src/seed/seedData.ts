import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import Listing from '../models/Listing';
import Booking from '../models/Booking';

dotenv.config();

const sampleListings = [
  {
    title: "Cozy Downtown Apartment",
    description: "A beautiful apartment in the heart of the city with modern amenities and stunning views.",
    price: 120,
    location: {
      address: "123 Main Street",
      city: "New York",
      country: "United States",
      coordinates: [-74.006, 40.7128]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "Heating"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Beachfront Villa",
    description: "Luxurious villa right on the beach with private access and breathtaking ocean views.",
    price: 350,
    location: {
      address: "456 Ocean Drive",
      city: "Miami",
      country: "United States",
      coordinates: [-80.1918, 25.7617]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Kitchen", "Air Conditioning"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Mountain Cabin Retreat",
    description: "Peaceful cabin in the mountains, perfect for a quiet getaway surrounded by nature.",
    price: 85,
    location: {
      address: "789 Mountain Road",
      city: "Aspen",
      country: "United States",
      coordinates: [-106.8175, 39.1911]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "Fireplace", "Kitchen", "Heating", "Mountain View"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create test users
    const hostUser = new User({
      name: 'Test Host',
      email: 'test@stayfinder.com',
      password: 'Test123!',
      isHost: true
    });
    
    const guestUser = new User({
      name: 'Test Guest',
      email: 'guest@stayfinder.com',
      password: 'Guest123!',
      isHost: false
    });
    
    await hostUser.save();
    await guestUser.save();
    
    console.log('Created test users');
    
    // Create sample listings
    const listings = await Promise.all(
      sampleListings.map(listingData => {
        const listing = new Listing({
          ...listingData,
          host: hostUser._id
        });
        return listing.save();
      })
    );
    
    console.log('Created sample listings');
    
    // Create a sample booking
    const sampleBooking = new Booking({
      listing: listings[0]._id,
      guest: guestUser._id,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      totalPrice: listings[0].price * 3, // 3 nights
      status: 'confirmed'
    });
    
    await sampleBooking.save();
    console.log('Created sample booking');
    
    console.log('Database seeded successfully!');
    console.log('Test accounts:');
    console.log('Host: test@stayfinder.com / Test123!');
    console.log('Guest: guest@stayfinder.com / Guest123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();