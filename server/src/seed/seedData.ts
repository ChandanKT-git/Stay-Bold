import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import Listing from '../models/Listing';
import Booking from '../models/Booking';

dotenv.config();

const indianListings = [
  // Mumbai Properties (10)
  {
    title: "Luxury Sea View Apartment in Bandra West",
    description: "Experience Mumbai's glamour from this stunning 3BHK apartment with panoramic Arabian Sea views. Located in Bandra's elite Hill Road area, featuring contemporary furnishings, modular kitchen, and premium amenities including infinity pool and state-of-the-art gym.",
    price: 8500,
    location: {
      address: "Hill Road, Bandra West",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8261, 19.0596]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "Kitchen", "Swimming Pool", "Gym", "Security", "Parking", "Sea View", "Balcony"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Heritage Studio in Colaba",
    description: "Charming studio in historic Colaba, walking distance to Gateway of India and Taj Hotel. Features colonial architecture with modern amenities, perfect for exploring South Mumbai's iconic landmarks and vibrant street life.",
    price: 3500,
    location: {
      address: "Colaba Causeway",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8311, 18.9067]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    ],
    amenities: ["WiFi", "AC", "Kitchenette", "Near Gateway of India", "Historic Location", "Cable TV"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Modern 2BHK in Powai with Lake View",
    description: "Contemporary apartment in Mumbai's IT hub overlooking Powai Lake. Close to Hiranandani Gardens, IIT Bombay, and major tech companies. Features modern amenities and serene lake views.",
    price: 5500,
    location: {
      address: "Hiranandani Gardens, Powai",
      city: "Mumbai",
      country: "India",
      coordinates: [72.9081, 19.1197]
    },
    images: [
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["WiFi", "AC", "Kitchen", "Lake View", "Business Center", "Gym", "Shopping Mall"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Luxury Penthouse in Worli",
    description: "Exclusive penthouse with 360-degree city views including Bandra-Worli Sea Link. Features private terrace, jacuzzi, and premium furnishings in Mumbai's most prestigious neighborhood.",
    price: 15000,
    location: {
      address: "Worli Sea Face",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8181, 19.0176]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["WiFi", "AC", "Private Terrace", "Jacuzzi", "Sea Link View", "Concierge", "Valet Parking"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Cozy 1BHK in Andheri East",
    description: "Perfect for business travelers, located near Mumbai Airport and major IT parks. Modern amenities with easy access to metro and shopping centers.",
    price: 4000,
    location: {
      address: "Andheri East, Near Airport",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8697, 19.1136]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "Kitchen", "Near Airport", "Metro Access", "Shopping Centers"],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Artist's Loft in Khar West",
    description: "Creative space in trendy Khar West, perfect for artists and creatives. Features high ceilings, natural light, and proximity to galleries and cafes.",
    price: 6000,
    location: {
      address: "Linking Road, Khar West",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8328, 19.0728]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    ],
    amenities: ["WiFi", "AC", "High Ceilings", "Natural Light", "Art Galleries", "Trendy Cafes"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Family Villa in Juhu",
    description: "Spacious villa near Juhu Beach, perfect for families. Features private garden, multiple bedrooms, and easy beach access for morning walks and sunset views.",
    price: 12000,
    location: {
      address: "Juhu Tara Road",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8267, 19.1075]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "AC", "Private Garden", "Beach Access", "Family Friendly", "Parking"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4
  },
  {
    title: "Business Suite in BKC",
    description: "Premium business suite in Bandra Kurla Complex, Mumbai's financial district. Perfect for corporate travelers with meeting rooms and business center access.",
    price: 9000,
    location: {
      address: "Bandra Kurla Complex",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8697, 19.0596]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "Business Center", "Meeting Rooms", "Financial District", "Metro Access"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Bollywood Theme Apartment in Goregaon",
    description: "Unique Bollywood-themed apartment near Film City. Perfect for movie enthusiasts with memorabilia, themed decor, and studio tour packages.",
    price: 5000,
    location: {
      address: "Near Film City, Goregaon",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8489, 19.1646]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["WiFi", "AC", "Bollywood Theme", "Film City Tours", "Movie Memorabilia", "Entertainment"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Marine Drive View Apartment",
    description: "Iconic apartment overlooking Marine Drive, the Queen's Necklace. Experience Mumbai's most famous promenade with stunning sunset views and city lights.",
    price: 11000,
    location: {
      address: "Marine Drive",
      city: "Mumbai",
      country: "India",
      coordinates: [72.8235, 18.9432]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["WiFi", "AC", "Marine Drive View", "Sunset Views", "City Lights", "Iconic Location"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Delhi Properties (10)
  {
    title: "Heritage Haveli in Chandni Chowk",
    description: "Restored 18th-century haveli in Old Delhi's heart. Experience Mughal architecture with modern comforts, walking distance to Red Fort, Jama Masjid, and spice markets.",
    price: 6500,
    location: {
      address: "Chandni Chowk",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2300, 28.6562]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "AC", "Heritage Architecture", "Courtyard", "Near Red Fort", "Cultural Tours"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Luxury Villa in Greater Kailash",
    description: "Independent villa in Delhi's most prestigious neighborhood. Features landscaped garden, modern amenities, and proximity to upscale shopping and dining.",
    price: 12000,
    location: {
      address: "Greater Kailash Part 1",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2410, 28.5494]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "Private Garden", "Parking", "Security", "Luxury Furnishing", "Shopping"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4
  },
  {
    title: "Modern Apartment in Connaught Place",
    description: "Prime location in Delhi's commercial heart. Perfect for business travelers with metro access, shopping, and dining. Classic Delhi charm with modern amenities.",
    price: 7500,
    location: {
      address: "Connaught Place",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2167, 28.6289]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    ],
    amenities: ["WiFi", "AC", "Metro Access", "Central Location", "Business District", "Shopping"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Diplomatic Enclave Residence",
    description: "Elegant residence in the diplomatic area, perfect for international visitors. Features embassy proximity, high security, and diplomatic services.",
    price: 10000,
    location: {
      address: "Chanakyapuri",
      city: "New Delhi",
      country: "India",
      coordinates: [77.1910, 28.5984]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["WiFi", "AC", "High Security", "Embassy Area", "Diplomatic Services", "Luxury"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3
  },
  {
    title: "Artist Quarter in Hauz Khas Village",
    description: "Bohemian apartment in trendy Hauz Khas Village. Surrounded by art galleries, boutiques, and cafes. Perfect for creative souls and culture enthusiasts.",
    price: 5500,
    location: {
      address: "Hauz Khas Village",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2062, 28.5494]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["WiFi", "AC", "Art Galleries", "Boutiques", "Trendy Cafes", "Cultural Hub"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Government Quarter in Lutyens Delhi",
    description: "Colonial bungalow in Lutyens' Delhi, featuring wide lawns, heritage architecture, and proximity to India Gate and government buildings.",
    price: 9500,
    location: {
      address: "Lutyens Delhi",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2273, 28.6139]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "AC", "Heritage Architecture", "Large Lawns", "India Gate", "Government Area"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Tech Hub Apartment in Gurgaon",
    description: "Modern high-rise apartment in Millennium City. Perfect for IT professionals with proximity to Cyber City, malls, and corporate offices.",
    price: 6000,
    location: {
      address: "Sector 29, Gurgaon",
      city: "Gurgaon",
      country: "India",
      coordinates: [77.0688, 28.4595]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "IT Hub", "Shopping Malls", "Corporate Offices", "Metro Access"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "University Area Hostel in North Campus",
    description: "Student-friendly accommodation near Delhi University. Budget-friendly with study areas, library access, and vibrant student life.",
    price: 2500,
    location: {
      address: "North Campus, Delhi University",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2085, 28.6969]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["WiFi", "Study Areas", "Library Access", "Student Life", "Budget Friendly", "University"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Airport Hotel in Aerocity",
    description: "Convenient hotel near IGI Airport with shuttle service. Perfect for transit passengers and business travelers with meeting facilities.",
    price: 4500,
    location: {
      address: "Aerocity",
      city: "New Delhi",
      country: "India",
      coordinates: [77.1025, 28.5562]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    ],
    amenities: ["WiFi", "AC", "Airport Shuttle", "Meeting Facilities", "Business Center", "24/7 Service"],
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Spiritual Retreat in Nizamuddin",
    description: "Peaceful accommodation near Nizamuddin Dargah. Experience Sufi culture with qawwali nights and spiritual ambiance in historic surroundings.",
    price: 4000,
    location: {
      address: "Nizamuddin West",
      city: "New Delhi",
      country: "India",
      coordinates: [77.2426, 28.5933]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["WiFi", "AC", "Spiritual Experience", "Qawwali Nights", "Sufi Culture", "Historic Area"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Bangalore Properties (8)
  {
    title: "Tech Hub Apartment in Koramangala",
    description: "Modern apartment in Bangalore's Silicon Valley. High-speed internet, co-working spaces, vibrant nightlife, and proximity to major IT companies.",
    price: 4500,
    location: {
      address: "Koramangala 5th Block",
      city: "Bangalore",
      country: "India",
      coordinates: [77.6309, 12.9352]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["High-Speed WiFi", "AC", "Kitchen", "Co-working Space", "Tech Hub", "Nightlife"],
    maxGuests: 3,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Garden City Villa in Whitefield",
    description: "Spacious villa surrounded by gardens in IT corridor. Traditional South Indian architecture with modern amenities, perfect for families.",
    price: 8000,
    location: {
      address: "Whitefield Main Road",
      city: "Bangalore",
      country: "India",
      coordinates: [77.7499, 12.9698]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "AC", "Garden", "Traditional Architecture", "IT Corridor", "Family Friendly"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Brewery District Loft in Indiranagar",
    description: "Trendy loft in Bangalore's pub capital. Walking distance to microbreweries, restaurants, and shopping. Perfect for nightlife enthusiasts.",
    price: 5500,
    location: {
      address: "100 Feet Road, Indiranagar",
      city: "Bangalore",
      country: "India",
      coordinates: [77.6413, 12.9719]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["WiFi", "AC", "Microbreweries", "Restaurants", "Shopping", "Nightlife"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Heritage Bungalow in Basavanagudi",
    description: "Colonial-era bungalow in traditional Bangalore neighborhood. Features heritage architecture, temple visits, and authentic South Indian culture.",
    price: 6000,
    location: {
      address: "Bull Temple Road, Basavanagudi",
      city: "Bangalore",
      country: "India",
      coordinates: [77.5946, 12.9432]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["WiFi", "AC", "Heritage Architecture", "Temple Visits", "Cultural Experience", "Traditional"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Startup Hub in HSR Layout",
    description: "Modern apartment in startup ecosystem. Co-working spaces, networking events, and proximity to tech incubators and venture capital firms.",
    price: 5000,
    location: {
      address: "HSR Layout Sector 1",
      city: "Bangalore",
      country: "India",
      coordinates: [77.6387, 12.9082]
    },
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["WiFi", "AC", "Startup Ecosystem", "Co-working", "Networking", "Tech Incubators"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Lake View Apartment in Ulsoor",
    description: "Serene apartment overlooking Ulsoor Lake. Perfect for morning walks, boating, and peaceful retreat from city hustle.",
    price: 4000,
    location: {
      address: "Ulsoor Lake Road",
      city: "Bangalore",
      country: "India",
      coordinates: [77.6094, 12.9853]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["WiFi", "AC", "Lake View", "Morning Walks", "Boating", "Peaceful"],
    maxGuests: 3,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Airport Executive Suite in Devanahalli",
    description: "Luxury suite near Bangalore Airport. Perfect for business travelers with airport shuttle, meeting rooms, and premium amenities.",
    price: 7000,
    location: {
      address: "Devanahalli",
      city: "Bangalore",
      country: "India",
      coordinates: [77.7081, 13.1986]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["WiFi", "AC", "Airport Shuttle", "Meeting Rooms", "Business Center", "Luxury"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Royal Mysore Palace Style in Jayanagar",
    description: "Apartment designed in Mysore Palace style with traditional Karnataka architecture, cultural programs, and authentic South Indian hospitality.",
    price: 5500,
    location: {
      address: "Jayanagar 4th Block",
      city: "Bangalore",
      country: "India",
      coordinates: [77.5833, 12.9279]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["WiFi", "AC", "Traditional Architecture", "Cultural Programs", "South Indian", "Heritage"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Goa Properties (6)
  {
    title: "Beachfront Villa in Calangute",
    description: "Stunning villa with direct beach access to Calangute Beach. Features infinity pool, ocean views, water sports, and beach shacks nearby.",
    price: 15000,
    location: {
      address: "Calangute Beach Road",
      city: "Goa",
      country: "India",
      coordinates: [73.7549, 15.5430]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Beach Access", "Infinity Pool", "Ocean View", "Water Sports", "Beach Shacks", "WiFi"],
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 4
  },
  {
    title: "Portuguese Heritage Home in Fontainhas",
    description: "Colorful Portuguese colonial house in Panaji's Latin Quarter. Features traditional architecture, art galleries, and cultural heritage walks.",
    price: 6000,
    location: {
      address: "Fontainhas, Panaji",
      city: "Goa",
      country: "India",
      coordinates: [73.8278, 15.4909]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Heritage Architecture", "Art Galleries", "Cultural Walks", "Portuguese History", "WiFi", "AC"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Luxury Beach Resort in Anjuna",
    description: "Upscale resort near famous Anjuna Beach and flea market. Features spa services, beach parties, and hippie culture experience.",
    price: 12000,
    location: {
      address: "Anjuna Beach",
      city: "Goa",
      country: "India",
      coordinates: [73.7407, 15.5736]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Beach Access", "Spa Services", "Beach Parties", "Flea Market", "Hippie Culture", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Riverside Cottage in Old Goa",
    description: "Peaceful cottage near Mandovi River and UNESCO World Heritage churches. Perfect for history enthusiasts and spiritual seekers.",
    price: 4500,
    location: {
      address: "Old Goa",
      city: "Goa",
      country: "India",
      coordinates: [73.9125, 15.5057]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["River View", "UNESCO Churches", "Historical Sites", "Spiritual Experience", "WiFi", "AC"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Beach Shack Stay in Arambol",
    description: "Authentic beach shack experience in hippie paradise Arambol. Features drum circles, yoga sessions, and bohemian lifestyle.",
    price: 3000,
    location: {
      address: "Arambol Beach",
      city: "Goa",
      country: "India",
      coordinates: [73.7024, 15.6869]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["Beach Shack", "Drum Circles", "Yoga Sessions", "Bohemian Culture", "Hippie Paradise", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Casino Resort in Baga",
    description: "Luxury resort near Baga Beach with casino access, nightlife, and water sports. Perfect for entertainment and beach activities.",
    price: 10000,
    location: {
      address: "Baga Beach Road",
      city: "Goa",
      country: "India",
      coordinates: [73.7516, 15.5560]
    },
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Casino Access", "Nightlife", "Water Sports", "Beach Activities", "Entertainment", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3
  },

  // Rajasthan Properties (8)
  {
    title: "Royal Palace Suite in Jaipur",
    description: "Magnificent palace suite in Pink City with City Palace views. Features royal Rajasthani architecture, traditional furnishings, and cultural experiences.",
    price: 18000,
    location: {
      address: "Near City Palace, Jaipur",
      city: "Jaipur",
      country: "India",
      coordinates: [75.8267, 26.9260]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Royal Architecture", "Palace Views", "Traditional Decor", "Cultural Heritage", "WiFi", "AC"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Desert Camp in Jaisalmer",
    description: "Luxury desert camp with camel safaris, folk performances, and stargazing. Experience the golden city and Thar Desert adventure.",
    price: 9500,
    location: {
      address: "Sam Sand Dunes, Jaisalmer",
      city: "Jaisalmer",
      country: "India",
      coordinates: [70.9083, 26.9157]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Desert Experience", "Camel Safari", "Folk Performances", "Stargazing", "Traditional Food", "Cultural Shows"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Lake Palace View in Udaipur",
    description: "Romantic accommodation with Lake Pichola and Lake Palace views. Experience the Venice of the East with boat rides and sunset views.",
    price: 14000,
    location: {
      address: "Lake Pichola Road, Udaipur",
      city: "Udaipur",
      country: "India",
      coordinates: [73.6833, 24.5854]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Lake Views", "Palace Views", "Boat Rides", "Sunset Views", "Romantic Setting", "WiFi"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Blue City Haveli in Jodhpur",
    description: "Traditional haveli in Jodhpur's Blue City with Mehrangarh Fort views. Experience authentic Rajasthani culture and architecture.",
    price: 8500,
    location: {
      address: "Old City, Jodhpur",
      city: "Jodhpur",
      country: "India",
      coordinates: [73.0243, 26.2389]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Fort Views", "Traditional Haveli", "Blue City", "Cultural Immersion", "Rooftop Terrace", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Desert Oasis in Pushkar",
    description: "Peaceful retreat in holy city Pushkar with sacred lake views. Features camel safaris, spiritual experiences, and desert adventures.",
    price: 5500,
    location: {
      address: "Pushkar Lake Road",
      city: "Pushkar",
      country: "India",
      coordinates: [74.5515, 26.4899]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Sacred Lake", "Camel Safari", "Spiritual Experience", "Desert Adventure", "Holy City", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Hill Station Resort in Mount Abu",
    description: "Rajasthan's only hill station with Nakki Lake views and Dilwara Jain temples. Cool climate retreat from desert heat.",
    price: 7500,
    location: {
      address: "Nakki Lake Road, Mount Abu",
      city: "Mount Abu",
      country: "India",
      coordinates: [72.7081, 24.5925]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Hill Station", "Lake Views", "Jain Temples", "Cool Climate", "Desert Retreat", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Heritage Hotel in Bikaner",
    description: "Restored palace hotel in Bikaner with camel breeding farm visits and desert culture. Experience royal hospitality and desert life.",
    price: 9000,
    location: {
      address: "Bikaner Fort Area",
      city: "Bikaner",
      country: "India",
      coordinates: [73.3119, 28.0229]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Palace Hotel", "Camel Farm", "Desert Culture", "Royal Hospitality", "Fort Views", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3
  },
  {
    title: "Ranthambore Safari Lodge",
    description: "Luxury eco-lodge near Ranthambore National Park. Perfect for tiger safaris, wildlife photography, and nature experiences.",
    price: 12000,
    location: {
      address: "Ranthambore Road, Sawai Madhopur",
      city: "Sawai Madhopur",
      country: "India",
      coordinates: [76.3794, 26.0173]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Tiger Safari", "Wildlife Photography", "Eco-Lodge", "Nature Experience", "National Park", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Kerala Properties (6)
  {
    title: "Backwater Houseboat in Alleppey",
    description: "Traditional Kerala houseboat floating through serene backwaters. Experience coconut groves, paddy fields, and village life with authentic cuisine.",
    price: 12000,
    location: {
      address: "Vembanad Lake, Alleppey",
      city: "Alleppey",
      country: "India",
      coordinates: [76.3388, 9.4981]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Backwater Views", "Traditional Houseboat", "Local Cuisine", "Village Life", "Coconut Groves", "Peaceful"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Hill Station Cottage in Munnar",
    description: "Charming cottage surrounded by tea plantations in Munnar hills. Perfect for nature lovers seeking tranquility and cool mountain air.",
    price: 5500,
    location: {
      address: "Tea Garden Road, Munnar",
      city: "Munnar",
      country: "India",
      coordinates: [77.0593, 10.0889]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Tea Plantations", "Hill Station", "Nature Walks", "Cool Climate", "Mountain Air", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Spice Plantation Stay in Thekkady",
    description: "Eco-friendly stay in spice plantations near Periyar Wildlife Sanctuary. Experience spice tours, elephant rides, and wildlife spotting.",
    price: 6500,
    location: {
      address: "Thekkady, Periyar",
      city: "Thekkady",
      country: "India",
      coordinates: [77.1642, 9.5916]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Spice Plantations", "Wildlife Sanctuary", "Elephant Rides", "Spice Tours", "Eco-Friendly", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Beach Resort in Kovalam",
    description: "Luxury beach resort with Ayurvedic spa and lighthouse views. Perfect for beach relaxation and traditional Kerala treatments.",
    price: 9000,
    location: {
      address: "Lighthouse Beach, Kovalam",
      city: "Kovalam",
      country: "India",
      coordinates: [76.9786, 8.4004]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Beach Access", "Ayurvedic Spa", "Lighthouse Views", "Traditional Treatments", "Beach Resort", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Heritage Home in Fort Kochi",
    description: "Colonial heritage home in historic Fort Kochi with Chinese fishing nets and spice market access. Experience cultural fusion.",
    price: 7500,
    location: {
      address: "Fort Kochi",
      city: "Kochi",
      country: "India",
      coordinates: [76.2673, 9.9312]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Heritage Home", "Chinese Fishing Nets", "Spice Markets", "Cultural Fusion", "Colonial History", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Ayurvedic Wellness Resort in Varkala",
    description: "Clifftop resort in Varkala with Ayurvedic treatments and beach access. Perfect for wellness retreats and spiritual healing.",
    price: 8500,
    location: {
      address: "Varkala Cliff",
      city: "Varkala",
      country: "India",
      coordinates: [76.7066, 8.7379]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["Clifftop Location", "Ayurvedic Treatments", "Beach Access", "Wellness Retreat", "Spiritual Healing", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Additional Indian Cities (12)
  {
    title: "Yoga Ashram in Rishikesh",
    description: "Authentic ashram on Ganges banks with daily yoga, meditation, and spiritual teachings. Experience the yoga capital of the world.",
    price: 3500,
    location: {
      address: "Laxman Jhula, Rishikesh",
      city: "Rishikesh",
      country: "India",
      coordinates: [78.2676, 30.0869]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Yoga Classes", "Meditation", "Ganges Views", "Spiritual Teachings", "Vegetarian Meals", "Ashram Life"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Taj Mahal View Hotel in Agra",
    description: "Heritage hotel with iconic Taj Mahal views. Experience Mughal grandeur with marble architecture and cultural tours.",
    price: 11000,
    location: {
      address: "Taj Ganj, Agra",
      city: "Agra",
      country: "India",
      coordinates: [78.0421, 27.1750]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Taj Mahal Views", "Heritage Hotel", "Mughal Architecture", "Cultural Tours", "Marble Decor", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Spiritual Ghat Stay in Varanasi",
    description: "Traditional accommodation overlooking sacred Ganges ghats. Witness daily aarti ceremonies and ancient spiritual rituals.",
    price: 4500,
    location: {
      address: "Dashashwamedh Ghat, Varanasi",
      city: "Varanasi",
      country: "India",
      coordinates: [83.0047, 25.3176]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Ganges Views", "Ghat Access", "Aarti Ceremonies", "Spiritual Rituals", "Cultural Immersion", "Traditional"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Golden Temple Heritage Stay in Amritsar",
    description: "Accommodation near Golden Temple with langar meals and Sikh cultural experiences. Experience spiritual heart of Sikhism.",
    price: 4500,
    location: {
      address: "Near Golden Temple, Amritsar",
      city: "Amritsar",
      country: "India",
      coordinates: [74.8723, 31.6340]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Golden Temple Views", "Langar Meals", "Sikh Culture", "Spiritual Experience", "Cultural Heritage", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Colonial Hill Station in Shimla",
    description: "British-era cottage in Queen of Hills with Himalayan views. Experience colonial charm with mountain railways and cool climate.",
    price: 7500,
    location: {
      address: "The Mall Road, Shimla",
      city: "Shimla",
      country: "India",
      coordinates: [77.1734, 31.1048]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Himalayan Views", "Colonial Architecture", "Mountain Railway", "Cool Climate", "Mall Road", "WiFi"],
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Tea Estate Bungalow in Darjeeling",
    description: "Working tea estate with Kanchenjunga views. Experience tea plucking, processing, and world's finest Darjeeling tea tasting.",
    price: 8500,
    location: {
      address: "Happy Valley Tea Estate, Darjeeling",
      city: "Darjeeling",
      country: "India",
      coordinates: [88.2636, 27.0410]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Tea Estate", "Kanchenjunga Views", "Tea Tasting", "Tea Processing", "Mountain Views", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Coffee Plantation Stay in Coorg",
    description: "Aromatic coffee plantation homestay with spice gardens and misty hills. Experience coffee processing and Karnataka culture.",
    price: 6000,
    location: {
      address: "Madikeri Coffee Estate, Coorg",
      city: "Coorg",
      country: "India",
      coordinates: [75.7382, 12.4244]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Coffee Plantation", "Spice Gardens", "Coffee Processing", "Hill Views", "Karnataka Culture", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Adventure Base in Manali",
    description: "Mountain retreat perfect for Himalayan adventures. Trekking, river rafting, paragliding, and snow activities base camp.",
    price: 7000,
    location: {
      address: "Old Manali Road",
      city: "Manali",
      country: "India",
      coordinates: [77.1892, 32.2396]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Himalayan Views", "Adventure Sports", "Trekking Base", "River Rafting", "Paragliding", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Royal Heritage in Mysore",
    description: "Palace-era hotel near Mysore Palace with royal architecture and traditional Karnataka hospitality. Experience royal grandeur.",
    price: 9500,
    location: {
      address: "Near Mysore Palace",
      city: "Mysore",
      country: "India",
      coordinates: [76.6394, 12.2958]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Palace Views", "Royal Architecture", "Karnataka Culture", "Heritage Experience", "Traditional Decor", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "French Colonial Villa in Pondicherry",
    description: "Restored French colonial villa in White Town with Auroville proximity. Experience French India with peaceful courtyards.",
    price: 8000,
    location: {
      address: "French Quarter, Pondicherry",
      city: "Pondicherry",
      country: "India",
      coordinates: [79.8083, 11.9416]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["French Architecture", "Colonial Heritage", "Auroville Access", "Peaceful Courtyard", "Cultural Fusion", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Temple Architecture Stay in Khajuraho",
    description: "Heritage accommodation near UNESCO World Heritage Khajuraho temples. Experience medieval Indian art and temple architecture.",
    price: 7000,
    location: {
      address: "Temple Road, Khajuraho",
      city: "Khajuraho",
      country: "India",
      coordinates: [79.9199, 24.8318]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["UNESCO Heritage", "Temple Views", "Medieval Art", "Cultural Heritage", "Architecture Tours", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },
  {
    title: "Himalayan Monastery in Leh Ladakh",
    description: "Traditional Ladakhi monastery stay with Buddhist culture immersion. Experience meditation, high altitude, and Himalayan landscapes.",
    price: 5500,
    location: {
      address: "Leh Monastery Road",
      city: "Leh",
      country: "India",
      coordinates: [77.5770, 34.1526]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Monastery Experience", "Buddhist Culture", "Himalayan Views", "Meditation", "High Altitude", "Cultural Immersion"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
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
      name: 'Rajesh Kumar',
      email: 'rajesh@stayfinder.in',
      password: 'Host123!',
      isHost: true
    });
    
    const hostUser2 = new User({
      name: 'Priya Sharma',
      email: 'priya@stayfinder.in',
      password: 'Host123!',
      isHost: true
    });
    
    const hostUser3 = new User({
      name: 'Arjun Singh',
      email: 'arjun@stayfinder.in',
      password: 'Host123!',
      isHost: true
    });
    
    const guestUser = new User({
      name: 'Amit Patel',
      email: 'amit@stayfinder.in',
      password: 'Guest123!',
      isHost: false
    });
    
    const guestUser2 = new User({
      name: 'Sneha Gupta',
      email: 'sneha@stayfinder.in',
      password: 'Guest123!',
      isHost: false
    });
    
    await hostUser.save();
    await hostUser2.save();
    await hostUser3.save();
    await guestUser.save();
    await guestUser2.save();
    
    console.log('Created test users');
    
    // Create sample listings with rotating hosts
    const hosts = [hostUser._id, hostUser2._id, hostUser3._id];
    const listings = await Promise.all(
      indianListings.map((listingData, index) => {
        const listing = new Listing({
          ...listingData,
          host: hosts[index % hosts.length]
        });
        return listing.save();
      })
    );
    
    console.log(`Created ${listings.length} Indian listings`);
    
    // Create sample bookings
    const sampleBookings = [
      {
        listing: listings[0]._id,
        guest: guestUser._id,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        totalPrice: listings[0].price * 3,
        status: 'confirmed'
      },
      {
        listing: listings[15]._id,
        guest: guestUser2._id,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        totalPrice: listings[15].price * 4,
        status: 'confirmed'
      },
      {
        listing: listings[30]._id,
        guest: guestUser._id,
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        totalPrice: listings[30].price * 4,
        status: 'pending'
      },
      {
        listing: listings[45]._id,
        guest: guestUser2._id,
        startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        totalPrice: listings[45].price * 4,
        status: 'confirmed'
      }
    ];
    
    await Promise.all(
      sampleBookings.map(bookingData => {
        const booking = new Booking(bookingData);
        return booking.save();
      })
    );
    
    console.log('Created sample bookings');
    
    console.log('\n🎉 STAYFINDER INDIA DATABASE SEEDED SUCCESSFULLY!');
    console.log('═'.repeat(70));
    console.log('📊 STATISTICS:');
    console.log(`   🏠 Total Properties: ${listings.length}`);
    console.log(`   👥 Total Users: 5 (3 hosts, 2 guests)`);
    console.log(`   📅 Total Bookings: ${sampleBookings.length}`);
    console.log('\n🔐 TEST ACCOUNTS:');
    console.log('   🏠 Host 1: rajesh@stayfinder.in / Host123!');
    console.log('   🏠 Host 2: priya@stayfinder.in / Host123!');
    console.log('   🏠 Host 3: arjun@stayfinder.in / Host123!');
    console.log('   👤 Guest 1: amit@stayfinder.in / Guest123!');
    console.log('   👤 Guest 2: sneha@stayfinder.in / Guest123!');
    console.log('\n🇮🇳 FEATURED DESTINATIONS (60 PROPERTIES):');
    console.log('   🏙️  Mumbai (10) - Sea views, heritage, tech hubs');
    console.log('   🏛️  Delhi (10) - Heritage, luxury, diplomatic areas');
    console.log('   💻 Bangalore (8) - Tech hubs, gardens, heritage');
    console.log('   🏖️  Goa (6) - Beaches, Portuguese heritage, nightlife');
    console.log('   🏰 Rajasthan (8) - Palaces, deserts, forts, lakes');
    console.log('   🌴 Kerala (6) - Backwaters, hills, spices, beaches');
    console.log('   🕉️  Spiritual (4) - Rishikesh, Varanasi, Amritsar');
    console.log('   🏔️  Mountains (4) - Shimla, Darjeeling, Manali, Leh');
    console.log('   🏛️  Heritage (4) - Agra, Khajuraho, Mysore, Pondicherry');
    console.log('\n💰 PRICE RANGE:');
    console.log('   💵 Budget: ₹2,500 - ₹5,000 (Student hostels, ashrams)');
    console.log('   💴 Mid-range: ₹5,000 - ₹10,000 (Heritage, hill stations)');
    console.log('   💸 Luxury: ₹10,000+ (Palaces, beach resorts, villas)');
    console.log('\n🎯 PROPERTY TYPES:');
    console.log('   🏰 Heritage Properties: Palaces, havelis, colonial homes');
    console.log('   🏖️  Beach Resorts: Goa, Kerala coastal properties');
    console.log('   🏔️  Mountain Retreats: Hill stations, tea estates');
    console.log('   🕉️  Spiritual Stays: Ashrams, monastery experiences');
    console.log('   💼 Business Hotels: IT hubs, airport proximity');
    console.log('   🎨 Cultural Experiences: Art districts, heritage areas');
    console.log('═'.repeat(70));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();