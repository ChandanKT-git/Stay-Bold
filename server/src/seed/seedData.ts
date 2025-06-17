import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const testUser = new User({
      email: 'test@stayfinder.com',
      password: 'Test123!',
      name: 'Test User',
      isHost: true
    });
    await testUser.save();

    const guestUser = new User({
      email: 'guest@stayfinder.com',
      password: 'Guest123!',
      name: 'Guest User',
      isHost: false
    });
    await guestUser.save();

    console.log('Created test users');

    // Create sample listings
    const listings = [
      {
        title: 'Cozy Downtown Apartment',
        description: 'A beautiful and cozy apartment in the heart of downtown. Perfect for business travelers and couples looking for a romantic getaway. The apartment features modern amenities, high-speed internet, and is within walking distance of restaurants, shops, and attractions.',
        location: 'New York, NY',
        price: 150,
        images: [
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
          'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
          'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
        ],
        host: testUser._id,
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'TV', 'Washer'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      {
        title: 'Beachfront Villa Paradise',
        description: 'Stunning beachfront villa with panoramic ocean views. This luxury property features a private beach access, infinity pool, and spacious outdoor entertaining areas. Perfect for families and groups seeking a premium beach vacation experience.',
        location: 'Miami, FL',
        price: 350,
        images: [
          'https://images.pexels.com/photos/1612459/pexels-photo-1612459.jpeg',
          'https://images.pexels.com/photos/1612353/pexels-photo-1612353.jpeg',
          'https://images.pexels.com/photos/1612472/pexels-photo-1612472.jpeg'
        ],
        host: testUser._id,
        amenities: ['Pool', 'Beach Access', 'WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Hot Tub'],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        coordinates: {
          lat: 25.7617,
          lng: -80.1918
        }
      },
      {
        title: 'Mountain Cabin Retreat',
        description: 'Escape to this peaceful mountain cabin surrounded by pristine wilderness. Features include a stone fireplace, hot tub on the deck, and hiking trails right from your doorstep. Ideal for nature lovers and those seeking digital detox.',
        location: 'Aspen, CO',
        price: 275,
        images: [
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
          'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
          'https://images.pexels.com/photos/1396133/pexels-photo-1396133.jpeg'
        ],
        host: testUser._id,
        amenities: ['Fireplace', 'Hot Tub', 'WiFi', 'Kitchen', 'Heating', 'Parking', 'Mountain View'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        coordinates: {
          lat: 39.1911,
          lng: -106.8175
        }
      }
    ];

    const createdListings = await Listing.insertMany(listings);
    console.log('Created sample listings');

    // Create sample booking
    const booking = new Booking({
      listing: createdListings[0]._id,
      user: guestUser._id,
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-20'),
      totalPrice: 750,
      status: 'confirmed'
    });
    await booking.save();

    console.log('Created sample booking');
    console.log('Seed data created successfully!');
    
    console.log('\nTest accounts:');
    console.log('Host: test@stayfinder.com / Test123!');
    console.log('Guest: guest@stayfinder.com / Guest123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();