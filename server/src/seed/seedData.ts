import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import Listing from '../models/Listing';
import Booking from '../models/Booking';

dotenv.config();

const indianListings = [
  // Mumbai Properties
  {
    title: "Luxury Sea View Apartment in Bandra",
    description: "Experience the vibrant energy of Mumbai from this stunning 3BHK apartment with panoramic views of the Arabian Sea. Located in the heart of Bandra West, this modern home features contemporary furnishings, a fully equipped kitchen, and access to premium amenities including a swimming pool and gym.",
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
    amenities: ["WiFi", "AC", "Kitchen", "Swimming Pool", "Gym", "Security", "Parking", "Sea View"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },
  {
    title: "Cozy Studio in Colaba",
    description: "Perfect for solo travelers or couples, this charming studio apartment is located in the historic Colaba district. Walking distance to Gateway of India, Taj Hotel, and vibrant street markets. Features modern amenities with a touch of Mumbai's colonial heritage.",
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
    amenities: ["WiFi", "AC", "Kitchenette", "Near Gateway of India", "Historic Location"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },
  {
    title: "Modern 2BHK in Powai",
    description: "Contemporary apartment in Mumbai's IT hub with lake views and modern amenities. Perfect for business travelers and families. Close to Hiranandani Gardens and major tech companies.",
    price: 5500,
    location: {
      address: "Hiranandani Gardens",
      city: "Mumbai",
      country: "India",
      coordinates: [72.9081, 19.1197]
    },
    images: [
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["WiFi", "AC", "Kitchen", "Lake View", "Business Center", "Gym"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Delhi Properties
  {
    title: "Heritage Haveli in Old Delhi",
    description: "Step back in time in this beautifully restored traditional haveli in the heart of Old Delhi. Experience authentic Mughal architecture with modern comforts. Walking distance to Red Fort, Jama Masjid, and Chandni Chowk market.",
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
    amenities: ["WiFi", "AC", "Traditional Architecture", "Courtyard", "Near Red Fort", "Cultural Experience"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },
  {
    title: "Luxury Villa in Greater Kailash",
    description: "Spacious independent villa in one of Delhi's most prestigious neighborhoods. Features a private garden, modern amenities, and easy access to shopping districts and restaurants.",
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
    amenities: ["WiFi", "AC", "Private Garden", "Parking", "Security", "Kitchen", "Luxury Furnishing"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4
  },
  {
    title: "Modern Apartment in Connaught Place",
    description: "Prime location apartment in the heart of New Delhi. Perfect for business travelers with easy access to metro, shopping, and dining. Modern amenities with classic Delhi charm.",
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

  // Bangalore Properties
  {
    title: "Tech Hub Apartment in Koramangala",
    description: "Modern apartment in Bangalore's Silicon Valley. Perfect for tech professionals with high-speed internet, co-working spaces nearby, and vibrant nightlife. Close to major IT companies.",
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
    description: "Spacious villa surrounded by lush gardens in Bangalore's IT corridor. Features traditional South Indian architecture with modern amenities. Perfect for families and long stays.",
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

  // Goa Properties
  {
    title: "Beachfront Villa in North Goa",
    description: "Wake up to the sound of waves in this stunning beachfront villa. Features direct beach access, infinity pool, and panoramic ocean views. Perfect for beach lovers and water sports enthusiasts.",
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
    amenities: ["Beach Access", "Infinity Pool", "Ocean View", "Water Sports", "WiFi", "AC"],
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 4
  },
  {
    title: "Portuguese Heritage Home in Old Goa",
    description: "Experience Goa's rich Portuguese heritage in this beautifully preserved colonial home. Features traditional architecture, antique furnishings, and peaceful courtyard gardens.",
    price: 6000,
    location: {
      address: "Old Goa Heritage Area",
      city: "Goa",
      country: "India",
      coordinates: [73.9125, 15.5057]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Heritage Architecture", "Courtyard", "Antique Furnishing", "Cultural Experience", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Jaipur Properties
  {
    title: "Royal Palace Suite in Pink City",
    description: "Live like royalty in this magnificent palace suite in Jaipur's historic Pink City. Features traditional Rajasthani architecture, royal furnishings, and views of the City Palace.",
    price: 18000,
    location: {
      address: "Near City Palace",
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
    title: "Desert Camp Experience near Jaipur",
    description: "Unique desert camping experience with luxury tents, camel rides, and traditional Rajasthani entertainment. Perfect for adventure seekers and cultural enthusiasts.",
    price: 9500,
    location: {
      address: "Pushkar Road",
      city: "Jaipur",
      country: "India",
      coordinates: [75.7873, 26.9124]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Desert Experience", "Camel Rides", "Cultural Shows", "Luxury Tents", "Traditional Food"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Kerala Properties
  {
    title: "Backwater Houseboat in Alleppey",
    description: "Float through Kerala's serene backwaters in this traditional houseboat. Experience the tranquil beauty of coconut groves, paddy fields, and local village life.",
    price: 12000,
    location: {
      address: "Vembanad Lake",
      city: "Alleppey",
      country: "India",
      coordinates: [76.3388, 9.4981]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Backwater Views", "Traditional Houseboat", "Local Cuisine", "Nature Experience", "Peaceful"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },
  {
    title: "Hill Station Cottage in Munnar",
    description: "Escape to the cool hills of Munnar in this charming cottage surrounded by tea plantations. Perfect for nature lovers and those seeking tranquility.",
    price: 5500,
    location: {
      address: "Tea Garden Road",
      city: "Munnar",
      country: "India",
      coordinates: [77.0593, 10.0889]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Tea Plantation Views", "Hill Station", "Nature Walks", "Cool Climate", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Udaipur Properties
  {
    title: "Lake Palace View Room in Udaipur",
    description: "Romantic accommodation with stunning views of Lake Pichola and the famous Lake Palace. Experience the Venice of the East with traditional Rajasthani hospitality.",
    price: 14000,
    location: {
      address: "Lake Pichola Road",
      city: "Udaipur",
      country: "India",
      coordinates: [73.6833, 24.5854]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Lake Views", "Palace Views", "Romantic Setting", "Traditional Architecture", "WiFi", "AC"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },

  // Rishikesh Properties
  {
    title: "Yoga Retreat Ashram in Rishikesh",
    description: "Find inner peace at this authentic yoga ashram on the banks of the holy Ganges. Includes daily yoga sessions, meditation, and vegetarian meals.",
    price: 3500,
    location: {
      address: "Laxman Jhula Road",
      city: "Rishikesh",
      country: "India",
      coordinates: [78.2676, 30.0869]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Yoga Classes", "Meditation", "Ganges Views", "Vegetarian Meals", "Spiritual Experience"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1
  },

  // Agra Properties
  {
    title: "Taj Mahal View Hotel in Agra",
    description: "Wake up to views of the iconic Taj Mahal from this heritage hotel. Experience the grandeur of Mughal architecture while enjoying modern comforts.",
    price: 11000,
    location: {
      address: "Taj Ganj",
      city: "Agra",
      country: "India",
      coordinates: [78.0421, 27.1750]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["Taj Mahal Views", "Heritage Hotel", "Mughal Architecture", "Cultural Experience", "WiFi", "AC"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Varanasi Properties
  {
    title: "Ganges Ghat Heritage Stay in Varanasi",
    description: "Experience the spiritual heart of India with this traditional accommodation overlooking the sacred Ganges ghats. Witness daily aarti ceremonies and ancient rituals.",
    price: 4500,
    location: {
      address: "Dashashwamedh Ghat",
      city: "Varanasi",
      country: "India",
      coordinates: [83.0047, 25.3176]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Ganges Views", "Ghat Access", "Spiritual Experience", "Traditional Architecture", "Cultural Immersion"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },

  // Hampi Properties
  {
    title: "Heritage Stay in Hampi Ruins",
    description: "Stay amidst the UNESCO World Heritage ruins of Hampi. Experience the grandeur of the Vijayanagara Empire with comfortable modern amenities.",
    price: 6500,
    location: {
      address: "Hampi Bazaar",
      city: "Hampi",
      country: "India",
      coordinates: [76.4740, 15.3350]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["UNESCO Heritage Site", "Ancient Ruins", "Historical Experience", "Rock Formations", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Shimla Properties
  {
    title: "Colonial Cottage in Shimla Hills",
    description: "Charming British-era cottage in the Queen of Hills. Enjoy cool mountain air, colonial architecture, and panoramic Himalayan views.",
    price: 7500,
    location: {
      address: "The Mall Road",
      city: "Shimla",
      country: "India",
      coordinates: [77.1734, 31.1048]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Mountain Views", "Colonial Architecture", "Cool Climate", "Himalayan Views", "WiFi", "Fireplace"],
    maxGuests: 5,
    bedrooms: 3,
    bathrooms: 2
  },

  // Darjeeling Properties
  {
    title: "Tea Estate Bungalow in Darjeeling",
    description: "Stay in a working tea estate with stunning views of Kanchenjunga. Experience tea plucking, processing, and enjoy the world's finest Darjeeling tea.",
    price: 8500,
    location: {
      address: "Happy Valley Tea Estate",
      city: "Darjeeling",
      country: "India",
      coordinates: [88.2636, 27.0410]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Tea Estate", "Mountain Views", "Tea Tasting", "Kanchenjunga Views", "Cool Climate", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Pushkar Properties
  {
    title: "Desert Oasis in Pushkar",
    description: "Peaceful retreat in the holy city of Pushkar. Features traditional Rajasthani architecture, camel safaris, and proximity to the sacred Pushkar Lake.",
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
    amenities: ["Sacred Lake Views", "Camel Safari", "Traditional Architecture", "Spiritual Experience", "Desert Location"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Coorg Properties
  {
    title: "Coffee Plantation Stay in Coorg",
    description: "Immerse yourself in the aromatic world of coffee in this plantation homestay. Experience coffee processing, spice gardens, and misty hill views.",
    price: 6000,
    location: {
      address: "Madikeri Coffee Estate",
      city: "Coorg",
      country: "India",
      coordinates: [75.7382, 12.4244]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Coffee Plantation", "Spice Gardens", "Hill Views", "Nature Walks", "Fresh Coffee", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Manali Properties
  {
    title: "Himalayan Retreat in Manali",
    description: "Adventure base camp in the heart of Himachal Pradesh. Perfect for trekking, river rafting, and experiencing the majestic Himalayas.",
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
    amenities: ["Himalayan Views", "Adventure Sports", "Trekking Base", "River Rafting", "Mountain Air", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },

  // Mysore Properties
  {
    title: "Royal Heritage Hotel in Mysore",
    description: "Experience the grandeur of the Mysore Palace era in this heritage hotel. Features royal architecture, traditional decor, and proximity to the famous Mysore Palace.",
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
    amenities: ["Royal Architecture", "Palace Views", "Heritage Experience", "Traditional Decor", "Cultural Tours", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Kochi Properties
  {
    title: "Spice Route Heritage Home in Kochi",
    description: "Historic home in the spice trading capital of India. Experience the confluence of cultures with Dutch, Portuguese, and local Kerala influences.",
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
    amenities: ["Heritage Architecture", "Spice Gardens", "Cultural Fusion", "Fort Kochi", "Chinese Fishing Nets", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Jodhpur Properties
  {
    title: "Blue City Haveli in Jodhpur",
    description: "Traditional haveli in the heart of the Blue City. Experience authentic Rajasthani culture with stunning views of Mehrangarh Fort.",
    price: 8500,
    location: {
      address: "Old City, Near Clock Tower",
      city: "Jodhpur",
      country: "India",
      coordinates: [73.0243, 26.2389]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Fort Views", "Traditional Haveli", "Blue City Experience", "Cultural Immersion", "Rooftop Terrace", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },

  // Amritsar Properties
  {
    title: "Golden Temple Heritage Stay in Amritsar",
    description: "Experience the spiritual heart of Sikhism with accommodation near the Golden Temple. Includes langar meals and cultural experiences.",
    price: 4500,
    location: {
      address: "Near Golden Temple",
      city: "Amritsar",
      country: "India",
      coordinates: [74.8723, 31.6340]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Golden Temple Views", "Spiritual Experience", "Langar Meals", "Cultural Heritage", "Sikh Culture", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },

  // Ooty Properties
  {
    title: "Colonial Hill Station Bungalow in Ooty",
    description: "Charming British-era bungalow in the Queen of Hill Stations. Surrounded by tea gardens, eucalyptus forests, and cool mountain air.",
    price: 6500,
    location: {
      address: "Botanical Garden Road",
      city: "Ooty",
      country: "India",
      coordinates: [76.6950, 11.4064]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Hill Station", "Tea Gardens", "Colonial Architecture", "Cool Climate", "Botanical Gardens", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Leh-Ladakh Properties
  {
    title: "Himalayan Monastery Stay in Leh",
    description: "Unique opportunity to stay in a traditional Ladakhi monastery. Experience Buddhist culture, meditation, and breathtaking Himalayan landscapes.",
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
  },

  // Ranthambore Properties
  {
    title: "Wildlife Safari Lodge near Ranthambore",
    description: "Luxury eco-lodge on the edge of Ranthambore National Park. Perfect base for tiger safaris and wildlife photography.",
    price: 12000,
    location: {
      address: "Ranthambore Road",
      city: "Sawai Madhopur",
      country: "India",
      coordinates: [76.3794, 26.0173]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Wildlife Safari", "Tiger Reserve", "Eco-Lodge", "Nature Photography", "Jungle Views", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Pondicherry Properties
  {
    title: "French Colonial Villa in Pondicherry",
    description: "Experience French India in this beautifully restored colonial villa. Features French architecture, peaceful courtyards, and proximity to Auroville.",
    price: 8000,
    location: {
      address: "French Quarter",
      city: "Pondicherry",
      country: "India",
      coordinates: [79.8083, 11.9416]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["French Architecture", "Colonial Heritage", "Peaceful Courtyard", "Near Auroville", "Cultural Fusion", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Khajuraho Properties
  {
    title: "Heritage Stay near Khajuraho Temples",
    description: "Accommodation near the famous UNESCO World Heritage Khajuraho temples. Experience medieval Indian art and architecture.",
    price: 7000,
    location: {
      address: "Temple Road",
      city: "Khajuraho",
      country: "India",
      coordinates: [79.9199, 24.8318]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["UNESCO Heritage Site", "Temple Views", "Medieval Architecture", "Cultural Heritage", "Art History", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Mahabalipuram Properties
  {
    title: "Beach Resort near Shore Temple",
    description: "Beachfront accommodation near the ancient Shore Temple. Combine beach relaxation with UNESCO World Heritage site exploration.",
    price: 9000,
    location: {
      address: "Shore Temple Road",
      city: "Mahabalipuram",
      country: "India",
      coordinates: [80.1932, 12.6269]
    },
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
    ],
    amenities: ["Beach Access", "Shore Temple Views", "UNESCO Heritage", "Ancient Architecture", "Beach Activities", "WiFi"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3
  },

  // Gangtok Properties
  {
    title: "Himalayan View Lodge in Gangtok",
    description: "Spectacular views of Kanchenjunga from this mountain lodge in Sikkim's capital. Perfect base for exploring Buddhist monasteries and mountain treks.",
    price: 6500,
    location: {
      address: "MG Marg",
      city: "Gangtok",
      country: "India",
      coordinates: [88.6138, 27.3389]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Kanchenjunga Views", "Buddhist Monasteries", "Mountain Treks", "Himalayan Culture", "Cool Climate", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Aurangabad Properties
  {
    title: "Heritage Hotel near Ajanta Ellora",
    description: "Luxury accommodation near the world-famous Ajanta and Ellora caves. Experience ancient Buddhist and Hindu rock-cut architecture.",
    price: 8500,
    location: {
      address: "Ajanta Ellora Road",
      city: "Aurangabad",
      country: "India",
      coordinates: [75.3433, 19.8762]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"
    ],
    amenities: ["UNESCO Heritage Sites", "Ancient Caves", "Rock-cut Architecture", "Buddhist Heritage", "Cultural Tours", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Kodaikanal Properties
  {
    title: "Lake View Cottage in Kodaikanal",
    description: "Peaceful cottage overlooking Kodai Lake in the Princess of Hill Stations. Perfect for romantic getaways and nature lovers.",
    price: 5500,
    location: {
      address: "Lake Road",
      city: "Kodaikanal",
      country: "India",
      coordinates: [77.4890, 10.2381]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["Lake Views", "Hill Station", "Cool Climate", "Nature Walks", "Romantic Setting", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Mount Abu Properties
  {
    title: "Hill Station Resort in Mount Abu",
    description: "Rajasthan's only hill station offering cool respite from desert heat. Features Dilwara Jain temples and scenic Nakki Lake.",
    price: 7500,
    location: {
      address: "Nakki Lake Road",
      city: "Mount Abu",
      country: "India",
      coordinates: [72.7081, 24.5925]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg"
    ],
    amenities: ["Hill Station", "Nakki Lake", "Dilwara Temples", "Cool Climate", "Jain Architecture", "WiFi"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2
  },

  // Madurai Properties
  {
    title: "Temple City Heritage Stay in Madurai",
    description: "Traditional accommodation in the temple city of Madurai. Experience the magnificent Meenakshi Temple and vibrant Tamil culture.",
    price: 5000,
    location: {
      address: "Near Meenakshi Temple",
      city: "Madurai",
      country: "India",
      coordinates: [78.1198, 9.9252]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
    ],
    amenities: ["Meenakshi Temple", "Tamil Culture", "Traditional Architecture", "Temple City", "Cultural Heritage", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1
  },

  // Bhubaneswar Properties
  {
    title: "Temple Architecture Stay in Bhubaneswar",
    description: "Explore the temple city of Bhubaneswar with its 1000+ temples. Experience Kalinga architecture and Odissi dance culture.",
    price: 4500,
    location: {
      address: "Old Town",
      city: "Bhubaneswar",
      country: "India",
      coordinates: [85.8245, 20.2961]
    },
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    amenities: ["Ancient Temples", "Kalinga Architecture", "Odissi Dance", "Cultural Heritage", "Temple City", "WiFi"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2
  },

  // Guwahati Properties
  {
    title: "Brahmaputra River Lodge in Guwahati",
    description: "Gateway to Northeast India with views of the mighty Brahmaputra River. Experience Assamese culture and cuisine.",
    price: 5500,
    location: {
      address: "Brahmaputra Riverfront",
      city: "Guwahati",
      country: "India",
      coordinates: [91.7362, 26.1445]
    },
    images: [
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    amenities: ["River Views", "Assamese Culture", "Northeast Gateway", "Traditional Cuisine", "Cultural Experience", "WiFi"],
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
    await guestUser.save();
    await guestUser2.save();
    
    console.log('Created test users');
    
    // Create sample listings with alternating hosts
    const listings = await Promise.all(
      indianListings.map((listingData, index) => {
        const listing = new Listing({
          ...listingData,
          host: index % 2 === 0 ? hostUser._id : hostUser2._id
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
        listing: listings[5]._id,
        guest: guestUser2._id,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        totalPrice: listings[5].price * 4,
        status: 'confirmed'
      },
      {
        listing: listings[10]._id,
        guest: guestUser._id,
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        totalPrice: listings[10].price * 4,
        status: 'pending'
      }
    ];
    
    await Promise.all(
      sampleBookings.map(bookingData => {
        const booking = new Booking(bookingData);
        return booking.save();
      })
    );
    
    console.log('Created sample bookings');
    
    console.log('\n🎉 Indian StayFinder Database seeded successfully!');
    console.log('═'.repeat(60));
    console.log('📊 STATISTICS:');
    console.log(`   🏠 Total Listings: ${listings.length}`);
    console.log(`   👥 Total Users: 4 (2 hosts, 2 guests)`);
    console.log(`   📅 Total Bookings: ${sampleBookings.length}`);
    console.log('\n🔐 TEST ACCOUNTS:');
    console.log('   🏠 Host 1: rajesh@stayfinder.in / Host123!');
    console.log('   🏠 Host 2: priya@stayfinder.in / Host123!');
    console.log('   👤 Guest 1: amit@stayfinder.in / Guest123!');
    console.log('   👤 Guest 2: sneha@stayfinder.in / Guest123!');
    console.log('\n🇮🇳 FEATURED DESTINATIONS:');
    console.log('   🏙️  Mumbai, Delhi, Bangalore');
    console.log('   🏖️  Goa, Kerala Backwaters');
    console.log('   🏰 Rajasthan (Jaipur, Udaipur, Jodhpur)');
    console.log('   🏔️  Himalayas (Manali, Shimla, Leh)');
    console.log('   🕉️  Spiritual (Varanasi, Rishikesh, Amritsar)');
    console.log('   🏛️  Heritage (Agra, Khajuraho, Hampi)');
    console.log('═'.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();