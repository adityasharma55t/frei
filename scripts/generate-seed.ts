/**
 * One-off generator for the static seed JSON files under src/data/.
 * Run with: npm run generate-seed
 *
 * This is NOT part of the runtime server — it just produces the JSON
 * files that the API reads at boot. Re-run and re-commit if you want
 * to regenerate/expand the seed data.
 */
import * as fs from 'fs';
import * as path from 'path';
import type { City, Airport, Hotel, Attraction, Flight, CabinClass } from '../src/types';

const OUT_DIR = path.join(__dirname, '..', 'src', 'data');

// ---------------------------------------------------------------------------
// Cities (id doubles as lowercase IATA code for the city's main airport)
// ---------------------------------------------------------------------------
type CitySeed = City & { airportName: string };

const CITIES: CitySeed[] = [
  // --- India ---
  { id: 'bom', name: 'Mumbai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 19.076, lng: 72.8777, image: 'https://cdn.frei.app/cities/bom.jpg', airportName: 'Chhatrapati Shivaji Maharaj International Airport' },
  { id: 'del', name: 'Delhi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 28.6139, lng: 77.2090, image: 'https://cdn.frei.app/cities/del.jpg', airportName: 'Indira Gandhi International Airport' },
  { id: 'blr', name: 'Bengaluru', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 12.9716, lng: 77.5946, image: 'https://cdn.frei.app/cities/blr.jpg', airportName: 'Kempegowda International Airport' },
  { id: 'hyd', name: 'Hyderabad', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 17.3850, lng: 78.4867, image: 'https://cdn.frei.app/cities/hyd.jpg', airportName: 'Rajiv Gandhi International Airport' },
  { id: 'maa', name: 'Chennai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 13.0827, lng: 80.2707, image: 'https://cdn.frei.app/cities/maa.jpg', airportName: 'Chennai International Airport' },
  { id: 'ccu', name: 'Kolkata', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 22.5726, lng: 88.3639, image: 'https://cdn.frei.app/cities/ccu.jpg', airportName: 'Netaji Subhas Chandra Bose International Airport' },
  { id: 'pnq', name: 'Pune', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 18.5204, lng: 73.8567, image: 'https://cdn.frei.app/cities/pnq.jpg', airportName: 'Pune Airport' },
  { id: 'amd', name: 'Ahmedabad', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 23.0225, lng: 72.5714, image: 'https://cdn.frei.app/cities/amd.jpg', airportName: 'Sardar Vallabhbhai Patel International Airport' },
  { id: 'jai', name: 'Jaipur', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 26.9124, lng: 75.7873, image: 'https://cdn.frei.app/cities/jai.jpg', airportName: 'Jaipur International Airport' },
  { id: 'goi', name: 'Goa', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 15.2993, lng: 74.1240, image: 'https://cdn.frei.app/cities/goi.jpg', airportName: 'Manohar International Airport' },
  { id: 'cok', name: 'Kochi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 9.9312, lng: 76.2673, image: 'https://cdn.frei.app/cities/cok.jpg', airportName: 'Cochin International Airport' },
  { id: 'lko', name: 'Lucknow', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 26.8467, lng: 80.9462, image: 'https://cdn.frei.app/cities/lko.jpg', airportName: 'Chaudhary Charan Singh International Airport' },
  { id: 'ixc', name: 'Chandigarh', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 30.7333, lng: 76.7794, image: 'https://cdn.frei.app/cities/ixc.jpg', airportName: 'Chandigarh Airport' },
  { id: 'gau', name: 'Guwahati', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 26.1445, lng: 91.7362, image: 'https://cdn.frei.app/cities/gau.jpg', airportName: 'Lokpriya Gopinath Bordoloi International Airport' },
  { id: 'bbi', name: 'Bhubaneswar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 20.2961, lng: 85.8245, image: 'https://cdn.frei.app/cities/bbi.jpg', airportName: 'Biju Patnaik International Airport' },
  { id: 'idr', name: 'Indore', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 22.7196, lng: 75.8577, image: 'https://cdn.frei.app/cities/idr.jpg', airportName: 'Devi Ahilya Bai Holkar Airport' },
  { id: 'nag', name: 'Nagpur', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 21.1458, lng: 79.0882, image: 'https://cdn.frei.app/cities/nag.jpg', airportName: 'Dr. Babasaheb Ambedkar International Airport' },
  { id: 'vns', name: 'Varanasi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 25.3176, lng: 82.9739, image: 'https://cdn.frei.app/cities/vns.jpg', airportName: 'Lal Bahadur Shastri Airport' },
  { id: 'atq', name: 'Amritsar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 31.6340, lng: 74.8723, image: 'https://cdn.frei.app/cities/atq.jpg', airportName: 'Sri Guru Ram Dass Jee International Airport' },
  { id: 'sxr', name: 'Srinagar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata', lat: 34.0837, lng: 74.7973, image: 'https://cdn.frei.app/cities/sxr.jpg', airportName: 'Sheikh ul-Alam International Airport' },

  // --- International ---
  { id: 'dxb', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708, image: 'https://cdn.frei.app/cities/dxb.jpg', airportName: 'Dubai International Airport' },
  { id: 'sin', name: 'Singapore', country: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198, image: 'https://cdn.frei.app/cities/sin.jpg', airportName: 'Singapore Changi Airport' },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', timezone: 'Asia/Bangkok', lat: 13.7563, lng: 100.5018, image: 'https://cdn.frei.app/cities/bkk.jpg', airportName: 'Suvarnabhumi Airport' },
  { id: 'dps', name: 'Bali', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Makassar', lat: -8.3405, lng: 115.0920, image: 'https://cdn.frei.app/cities/dps.jpg', airportName: 'Ngurah Rai International Airport' },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur', lat: 3.1390, lng: 101.6869, image: 'https://cdn.frei.app/cities/kul.jpg', airportName: 'Kuala Lumpur International Airport' },
  { id: 'lhr', name: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London', lat: 51.5072, lng: -0.1276, image: 'https://cdn.frei.app/cities/lhr.jpg', airportName: 'Heathrow Airport' },
  { id: 'cdg', name: 'Paris', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522, image: 'https://cdn.frei.app/cities/cdg.jpg', airportName: 'Charles de Gaulle Airport' },
  { id: 'jfk', name: 'New York', country: 'United States', countryCode: 'US', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060, image: 'https://cdn.frei.app/cities/jfk.jpg', airportName: 'John F. Kennedy International Airport' },
  { id: 'hnd', name: 'Tokyo', country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo', lat: 35.6762, lng: 139.6503, image: 'https://cdn.frei.app/cities/hnd.jpg', airportName: 'Haneda Airport' },
  { id: 'syd', name: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093, image: 'https://cdn.frei.app/cities/syd.jpg', airportName: 'Sydney Kingsford Smith Airport' },
  { id: 'fco', name: 'Rome', country: 'Italy', countryCode: 'IT', timezone: 'Europe/Rome', lat: 41.9028, lng: 12.4964, image: 'https://cdn.frei.app/cities/fco.jpg', airportName: 'Leonardo da Vinci–Fiumicino Airport' },
  { id: 'ist', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', timezone: 'Europe/Istanbul', lat: 41.0082, lng: 28.9784, image: 'https://cdn.frei.app/cities/ist.jpg', airportName: 'Istanbul Airport' },
  { id: 'doh', name: 'Doha', country: 'Qatar', countryCode: 'QA', timezone: 'Asia/Qatar', lat: 25.2854, lng: 51.5310, image: 'https://cdn.frei.app/cities/doh.jpg', airportName: 'Hamad International Airport' },
  { id: 'hkg', name: 'Hong Kong', country: 'China', countryCode: 'HK', timezone: 'Asia/Hong_Kong', lat: 22.3193, lng: 114.1694, image: 'https://cdn.frei.app/cities/hkg.jpg', airportName: 'Hong Kong International Airport' },
  { id: 'icn', name: 'Seoul', country: 'South Korea', countryCode: 'KR', timezone: 'Asia/Seoul', lat: 37.5665, lng: 126.9780, image: 'https://cdn.frei.app/cities/icn.jpg', airportName: 'Incheon International Airport' },
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', timezone: 'Europe/Amsterdam', lat: 52.3676, lng: 4.9041, image: 'https://cdn.frei.app/cities/ams.jpg', airportName: 'Amsterdam Airport Schiphol' },
  { id: 'mle', name: 'Male', country: 'Maldives', countryCode: 'MV', timezone: 'Indian/Maldives', lat: 4.1755, lng: 73.5093, image: 'https://cdn.frei.app/cities/mle.jpg', airportName: 'Velana International Airport' },
  { id: 'ktm', name: 'Kathmandu', country: 'Nepal', countryCode: 'NP', timezone: 'Asia/Kathmandu', lat: 27.7172, lng: 85.3240, image: 'https://cdn.frei.app/cities/ktm.jpg', airportName: 'Tribhuvan International Airport' },
  { id: 'cmb', name: 'Colombo', country: 'Sri Lanka', countryCode: 'LK', timezone: 'Asia/Colombo', lat: 6.9271, lng: 79.8612, image: 'https://cdn.frei.app/cities/cmb.jpg', airportName: 'Bandaranaike International Airport' },
  { id: 'sfo', name: 'San Francisco', country: 'United States', countryCode: 'US', timezone: 'America/Los_Angeles', lat: 37.7749, lng: -122.4194, image: 'https://cdn.frei.app/cities/sfo.jpg', airportName: 'San Francisco International Airport' },
];

const cities: City[] = CITIES.map(({ airportName, ...c }) => c);

const airports: Airport[] = CITIES.map((c) => ({
  code: c.id.toUpperCase(),
  name: c.airportName,
  cityId: c.id,
  lat: c.lat,
  lng: c.lng,
}));

// ---------------------------------------------------------------------------
// Hotels (2-4 per city)
// ---------------------------------------------------------------------------
const HOTEL_TEMPLATES = [
  { suffix: 'Grand Hotel', stars: 5, amenities: ['Pool', 'Spa', 'Free WiFi', 'Breakfast included', 'Airport shuttle'] },
  { suffix: 'Palace Residency', stars: 4, amenities: ['Free WiFi', 'Breakfast included', 'Gym', 'Room service'] },
  { suffix: 'Boutique Inn', stars: 3, amenities: ['Free WiFi', 'Rooftop cafe'] },
  { suffix: 'Comfort Stay', stars: 3.5, amenities: ['Free WiFi', 'Breakfast included', 'Parking'] },
];

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const hotels: Hotel[] = [];
CITIES.forEach((c, ci) => {
  const count = 2 + (ci % 3); // 2-4 hotels per city
  for (let i = 0; i < count; i++) {
    const tmpl = HOTEL_TEMPLATES[i % HOTEL_TEMPLATES.length];
    const rand = seededRand(ci * 13 + i * 7);
    const id = `${c.id}-${tmpl.suffix.toLowerCase().replace(/\s+/g, '-')}`;
    hotels.push({
      id,
      name: `The ${c.name} ${tmpl.suffix}`,
      cityId: c.id,
      starRating: tmpl.stars,
      userRating: Math.round((3.8 + rand * 1.1) * 10) / 10,
      pricePerNight: Math.round((2200 + tmpl.stars * 1800 + rand * 3000) / 100) * 100,
      currency: 'INR',
      amenities: tmpl.amenities,
      image: `https://cdn.frei.app/hotels/${id}.jpg`,
      address: `${tmpl.suffix}, ${c.name}, ${c.country}`,
    });
  }
});

// ---------------------------------------------------------------------------
// Attractions (4-6 per city) — real landmarks for well-known cities,
// category-templated for the rest.
// ---------------------------------------------------------------------------
const KNOWN_ATTRACTIONS: Record<string, Array<{ name: string; category: Attraction['category']; description: string }>> = {
  bom: [
    { name: 'Gateway of India', category: 'landmark', description: 'Iconic waterfront arch monument overlooking the Arabian Sea.' },
    { name: 'Marine Drive', category: 'landmark', description: 'Sweeping promenade along the coast, popular at sunset.' },
    { name: 'Elephanta Caves', category: 'landmark', description: 'Ancient rock-cut cave temples on an island, a UNESCO site.' },
    { name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', category: 'museum', description: 'Leading museum of art, archaeology and natural history.' },
    { name: 'Colaba Causeway Market', category: 'shopping', description: 'Bustling street market for clothing, jewelry and souvenirs.' },
  ],
  del: [
    { name: 'Red Fort', category: 'landmark', description: 'Mughal-era fortress and UNESCO World Heritage Site.' },
    { name: 'Qutub Minar', category: 'landmark', description: 'Towering 13th-century minaret of red sandstone and marble.' },
    { name: 'Humayun\'s Tomb', category: 'landmark', description: 'Grand Mughal garden-tomb that inspired the Taj Mahal.' },
    { name: 'National Museum', category: 'museum', description: 'Extensive collection spanning Indian art and history.' },
    { name: 'Chandni Chowk', category: 'food', description: 'Historic market famous for street food and spices.' },
  ],
  blr: [
    { name: 'Lalbagh Botanical Garden', category: 'nature', description: 'Historic botanical garden with a glass house and lake.' },
    { name: 'Bangalore Palace', category: 'landmark', description: 'Tudor-style palace with Gothic interiors.' },
    { name: 'Cubbon Park', category: 'nature', description: 'Green expanse in the heart of the city.' },
    { name: 'UB City', category: 'shopping', description: 'Upscale mall and dining district.' },
    { name: 'Toit Brewpub', category: 'nightlife', description: 'Popular craft brewery and live-music venue.' },
  ],
  hyd: [
    { name: 'Charminar', category: 'landmark', description: 'Iconic 16th-century mosque and monument.' },
    { name: 'Golconda Fort', category: 'landmark', description: 'Sprawling hilltop fort known for its acoustics.' },
    { name: 'Ramoji Film City', category: 'adventure', description: 'One of the world\'s largest film studio complexes with tours.' },
    { name: 'Hussain Sagar Lake', category: 'nature', description: 'Heart-shaped lake with a giant Buddha statue.' },
    { name: 'Laad Bazaar', category: 'shopping', description: 'Historic bazaar famous for bangles and pearls.' },
  ],
  maa: [
    { name: 'Marina Beach', category: 'nature', description: 'One of the longest urban beaches in the world.' },
    { name: 'Kapaleeshwarar Temple', category: 'landmark', description: 'Vividly sculpted Dravidian-style Shiva temple.' },
    { name: 'Fort St. George', category: 'landmark', description: 'First English fortress in India, now a museum.' },
    { name: 'Government Museum', category: 'museum', description: 'One of the oldest museums in India.' },
  ],
  ccu: [
    { name: 'Victoria Memorial', category: 'landmark', description: 'Grand marble monument set in landscaped gardens.' },
    { name: 'Howrah Bridge', category: 'landmark', description: 'Iconic cantilever bridge over the Hooghly river.' },
    { name: 'Indian Museum', category: 'museum', description: 'Largest and oldest museum in India.' },
    { name: 'College Street', category: 'shopping', description: 'Historic street lined with bookshops and cafes.' },
  ],
  goi: [
    { name: 'Baga Beach', category: 'nature', description: 'Lively beach known for water sports and shacks.' },
    { name: 'Basilica of Bom Jesus', category: 'landmark', description: 'UNESCO-listed baroque church in Old Goa.' },
    { name: 'Fort Aguada', category: 'landmark', description: '17th-century Portuguese fort with a lighthouse.' },
    { name: 'Anjuna Flea Market', category: 'shopping', description: 'Famous weekly market for handicrafts and clothing.' },
    { name: 'Tito\'s Lane', category: 'nightlife', description: 'Buzzing strip of clubs and bars in Baga.' },
  ],
  jai: [
    { name: 'Amber Fort', category: 'landmark', description: 'Majestic hilltop fort with mirrored halls.' },
    { name: 'Hawa Mahal', category: 'landmark', description: 'Iconic pink sandstone "Palace of Winds".' },
    { name: 'City Palace', category: 'landmark', description: 'Former royal residence with museums and courtyards.' },
    { name: 'Jantar Mantar', category: 'landmark', description: 'UNESCO-listed astronomical observatory.' },
    { name: 'Johari Bazaar', category: 'shopping', description: 'Famous market for jewelry and gemstones.' },
  ],
  dxb: [
    { name: 'Burj Khalifa', category: 'landmark', description: 'The world\'s tallest building, with an observation deck.' },
    { name: 'Dubai Mall', category: 'shopping', description: 'One of the largest shopping malls in the world.' },
    { name: 'Palm Jumeirah', category: 'landmark', description: 'Iconic man-made palm-shaped island.' },
    { name: 'Desert Safari Dubai', category: 'adventure', description: 'Dune bashing, camel rides and a Bedouin camp dinner.' },
    { name: 'Dubai Marina Walk', category: 'nightlife', description: 'Waterfront promenade with restaurants and bars.' },
  ],
  sin: [
    { name: 'Gardens by the Bay', category: 'nature', description: 'Futuristic nature park with the Supertree Grove.' },
    { name: 'Marina Bay Sands SkyPark', category: 'landmark', description: 'Rooftop observation deck with skyline views.' },
    { name: 'Sentosa Island', category: 'adventure', description: 'Resort island with beaches and theme parks.' },
    { name: 'Chinatown Singapore', category: 'food', description: 'Historic district with hawker stalls and temples.' },
    { name: 'Clarke Quay', category: 'nightlife', description: 'Riverside dining and nightlife precinct.' },
  ],
  bkk: [
    { name: 'Grand Palace', category: 'landmark', description: 'Ornate former royal residence and Wat Phra Kaew.' },
    { name: 'Wat Arun', category: 'landmark', description: 'Riverside "Temple of Dawn" with a towering spire.' },
    { name: 'Chatuchak Weekend Market', category: 'shopping', description: 'One of the world\'s largest weekend markets.' },
    { name: 'Khao San Road', category: 'nightlife', description: 'Famous backpacker street with bars and street food.' },
  ],
  dps: [
    { name: 'Uluwatu Temple', category: 'landmark', description: 'Clifftop temple with sunset Kecak fire dances.' },
    { name: 'Tegallalang Rice Terraces', category: 'nature', description: 'Iconic tiered rice paddies near Ubud.' },
    { name: 'Kuta Beach', category: 'nature', description: 'Popular surf beach with a lively boardwalk.' },
    { name: 'Tanah Lot', category: 'landmark', description: 'Sea temple perched on an offshore rock formation.' },
    { name: 'Ubud Monkey Forest', category: 'nature', description: 'Sacred sanctuary home to long-tailed macaques.' },
  ],
  lhr: [
    { name: 'Tower of London', category: 'landmark', description: 'Historic castle housing the Crown Jewels.' },
    { name: 'British Museum', category: 'museum', description: 'World-renowned museum of human history and culture.' },
    { name: 'Buckingham Palace', category: 'landmark', description: 'The King\'s official London residence.' },
    { name: 'Camden Market', category: 'shopping', description: 'Eclectic market known for food stalls and crafts.' },
    { name: 'West End Theatre District', category: 'nightlife', description: 'Home to London\'s famous musicals and shows.' },
  ],
  cdg: [
    { name: 'Eiffel Tower', category: 'landmark', description: 'The wrought-iron icon of Paris.' },
    { name: 'Louvre Museum', category: 'museum', description: 'The world\'s most-visited art museum, home to the Mona Lisa.' },
    { name: 'Notre-Dame Cathedral', category: 'landmark', description: 'Gothic masterpiece on the Île de la Cité.' },
    { name: 'Montmartre', category: 'landmark', description: 'Artsy hilltop district crowned by Sacré-Cœur.' },
    { name: 'Le Marais', category: 'food', description: 'Historic quarter packed with bistros and boutiques.' },
  ],
  jfk: [
    { name: 'Statue of Liberty', category: 'landmark', description: 'Iconic neoclassical statue on Liberty Island.' },
    { name: 'Central Park', category: 'nature', description: 'Sprawling urban park in the heart of Manhattan.' },
    { name: 'Metropolitan Museum of Art', category: 'museum', description: 'One of the world\'s largest and finest art museums.' },
    { name: 'Times Square', category: 'nightlife', description: 'Neon-lit hub of Broadway and entertainment.' },
    { name: 'Brooklyn Bridge', category: 'landmark', description: 'Historic suspension bridge with skyline views.' },
  ],
  hnd: [
    { name: 'Senso-ji Temple', category: 'landmark', description: 'Tokyo\'s oldest and most iconic Buddhist temple.' },
    { name: 'Shibuya Crossing', category: 'landmark', description: 'The world\'s busiest pedestrian scramble crossing.' },
    { name: 'Tokyo Skytree', category: 'landmark', description: 'Tallest structure in Japan with panoramic views.' },
    { name: 'Tsukiji Outer Market', category: 'food', description: 'Famed market for fresh seafood and street food.' },
    { name: 'Akihabara', category: 'shopping', description: 'Electronics and anime/manga culture district.' },
  ],
  syd: [
    { name: 'Sydney Opera House', category: 'landmark', description: 'Iconic performing arts venue on the harbour.' },
    { name: 'Sydney Harbour Bridge', category: 'landmark', description: 'Steel arch bridge with a famous climb experience.' },
    { name: 'Bondi Beach', category: 'nature', description: 'Famous beach known for surfing and the coastal walk.' },
    { name: 'Taronga Zoo', category: 'adventure', description: 'Harbourside zoo with native Australian wildlife.' },
  ],
  fco: [
    { name: 'Colosseum', category: 'landmark', description: 'Ancient amphitheatre and symbol of Rome.' },
    { name: 'Vatican Museums', category: 'museum', description: 'Home to the Sistine Chapel and vast papal art collections.' },
    { name: 'Trevi Fountain', category: 'landmark', description: 'Baroque fountain famed for its coin-tossing tradition.' },
    { name: 'Roman Forum', category: 'landmark', description: 'Ruins of the ancient city\'s civic core.' },
  ],
  ist: [
    { name: 'Hagia Sophia', category: 'landmark', description: 'Byzantine-era domed monument turned mosque.' },
    { name: 'Blue Mosque', category: 'landmark', description: 'Ottoman mosque famed for its blue tiled interior.' },
    { name: 'Grand Bazaar', category: 'shopping', description: 'One of the world\'s oldest and largest covered markets.' },
    { name: 'Bosphorus Cruise', category: 'adventure', description: 'Scenic boat tour between Europe and Asia.' },
  ],
};

const GENERIC_ATTRACTION_TEMPLATES: Array<{ suffix: string; category: Attraction['category']; description: string }> = [
  { suffix: 'City Landmark', category: 'landmark', description: 'A well-known historic landmark in the city centre.' },
  { suffix: 'Heritage Museum', category: 'museum', description: 'Local museum showcasing regional history and culture.' },
  { suffix: 'Central Park', category: 'nature', description: 'Green public park popular with locals and visitors.' },
  { suffix: 'Old Town Market', category: 'shopping', description: 'Traditional market street for local crafts and goods.' },
  { suffix: 'Riverside Promenade', category: 'nature', description: 'Scenic walkway along the water, popular at sunset.' },
  { suffix: 'Night Bazaar', category: 'nightlife', description: 'Evening market and food street popular after dark.' },
  { suffix: 'Food Street', category: 'food', description: 'A lane packed with local eateries and street food stalls.' },
];

const attractions: Attraction[] = [];
CITIES.forEach((c, ci) => {
  const known = KNOWN_ATTRACTIONS[c.id] ?? [];
  const targetCount = 4 + (ci % 3); // 4-6 attractions per city
  const list = [...known];
  let gi = 0;
  while (list.length < targetCount) {
    const tmpl = GENERIC_ATTRACTION_TEMPLATES[gi % GENERIC_ATTRACTION_TEMPLATES.length];
    // avoid exact duplicate categories where a known one already covers it, when possible
    if (!list.some((a) => a.name === `${c.name} ${tmpl.suffix}`)) {
      list.push({ name: `${c.name} ${tmpl.suffix}`, category: tmpl.category, description: tmpl.description });
    }
    gi++;
    if (gi > 20) break; // safety
  }
  list.slice(0, targetCount).forEach((a, ai) => {
    const rand = seededRand(ci * 31 + ai * 11);
    const id = `${a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    attractions.push({
      id,
      name: a.name,
      cityId: c.id,
      category: a.category,
      rating: Math.round((4.0 + rand * 0.9) * 10) / 10,
      description: a.description,
      image: `https://cdn.frei.app/attractions/${id}.jpg`,
    });
  });
});

// ---------------------------------------------------------------------------
// Flights
// ---------------------------------------------------------------------------
const INDIAN_HUBS = ['bom', 'del', 'blr', 'hyd', 'maa', 'ccu'];
const INDIAN_SPOKES = CITIES.filter((c) => c.countryCode === 'IN' && !INDIAN_HUBS.includes(c.id)).map((c) => c.id);
const INTL = CITIES.filter((c) => c.countryCode !== 'IN').map((c) => c.id);

const DOMESTIC_AIRLINES = [
  { name: 'IndiGo', code: '6E' },
  { name: 'Air India', code: 'AI' },
  { name: 'Vistara', code: 'UK' },
  { name: 'SpiceJet', code: 'SG' },
  { name: 'Akasa Air', code: 'QP' },
];
const INTL_AIRLINES = [
  { name: 'Emirates', code: 'EK' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Air India', code: 'AI' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'Thai Airways', code: 'TG' },
  { name: 'Cathay Pacific', code: 'CX' },
  { name: 'ANA', code: 'NH' },
  { name: 'Qantas', code: 'QF' },
];
const CABINS: CabinClass[] = ['economy', 'economy', 'economy', 'premium_economy', 'business'];

function haversineKm(a: City, b: City): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

const cityById = new Map(CITIES.map((c) => [c.id, c]));
const FLIGHT_DATE = '2026-07-24';
let routeCounter = 0;
const flights: Flight[] = [];

function addFlight(fromId: string, toId: string, seedOffset: number) {
  const from = cityById.get(fromId)!;
  const to = cityById.get(toId)!;
  const distanceKm = haversineKm(from, to);
  const isDomestic = from.countryCode === 'IN' && to.countryCode === 'IN';
  const pool = isDomestic ? DOMESTIC_AIRLINES : INTL_AIRLINES;
  const rand = seededRand(seedOffset);
  const airline = pool[Math.floor(rand * pool.length)];
  const cabin = CABINS[Math.floor(seededRand(seedOffset * 3) * CABINS.length)];
  const durationMinutes = Math.max(45, Math.round((distanceKm / 800) * 60 + 30));
  const depHour = 5 + Math.floor(seededRand(seedOffset * 7) * 17); // 05:00-22:00
  const depMinute = Math.floor(seededRand(seedOffset * 11) * 4) * 15;
  const departure = new Date(`${FLIGHT_DATE}T${String(depHour).padStart(2, '0')}:${String(depMinute).padStart(2, '0')}:00+05:30`);
  const arrival = new Date(departure.getTime() + durationMinutes * 60000);
  const basePrice = isDomestic ? 2800 + distanceKm * 3.2 : 9000 + distanceKm * 5.5;
  const price = Math.round((basePrice * (0.85 + rand * 0.4)) / 50) * 50;
  const flightNumber = `${airline.code}-${1000 + (routeCounter % 8999)}`;
  routeCounter++;
  flights.push({
    id: `${flightNumber}-${FLIGHT_DATE.replace(/-/g, '')}`,
    airline: airline.name,
    airlineCode: airline.code,
    flightNumber,
    fromAirport: from.id.toUpperCase(),
    toAirport: to.id.toUpperCase(),
    departureTime: departure.toISOString(),
    arrivalTime: arrival.toISOString(),
    durationMinutes,
    stops: distanceKm > 6000 && rand > 0.6 ? 1 : 0,
    price,
    currency: 'INR',
    cabinClass: cabin,
    seatsAvailable: 4 + Math.floor(rand * 60),
  });
}

// a) hub <-> hub full mesh
for (let i = 0; i < INDIAN_HUBS.length; i++) {
  for (let j = i + 1; j < INDIAN_HUBS.length; j++) {
    addFlight(INDIAN_HUBS[i], INDIAN_HUBS[j], i * 100 + j);
    addFlight(INDIAN_HUBS[j], INDIAN_HUBS[i], j * 100 + i + 1);
  }
}

// b) spokes <-> BOM and DEL
INDIAN_SPOKES.forEach((spoke, si) => {
  ['bom', 'del'].forEach((hub, hi) => {
    addFlight(hub, spoke, 1000 + si * 10 + hi);
    addFlight(spoke, hub, 1000 + si * 10 + hi + 5);
  });
});

// c) BOM/DEL/BLR/MAA <-> every international city
['bom', 'del', 'blr', 'maa'].forEach((hub, hi) => {
  INTL.forEach((intl, ii) => {
    addFlight(hub, intl, 5000 + hi * 200 + ii);
    addFlight(intl, hub, 5000 + hi * 200 + ii + 100);
  });
});

// d) a handful of international <-> international connector routes
const INTL_CONNECTORS: Array<[string, string]> = [
  ['dxb', 'lhr'], ['sin', 'bkk'], ['dxb', 'sin'], ['lhr', 'jfk'], ['cdg', 'jfk'],
  ['hnd', 'icn'], ['hnd', 'hkg'], ['dxb', 'doh'], ['sin', 'syd'], ['ams', 'jfk'],
];
INTL_CONNECTORS.forEach(([a, b], idx) => {
  addFlight(a, b, 9000 + idx * 2);
  addFlight(b, a, 9000 + idx * 2 + 1);
});

// ---------------------------------------------------------------------------
// Empty bookings store (populated at runtime)
// ---------------------------------------------------------------------------
const bookings: unknown[] = [];

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });
function write(name: string, data: unknown) {
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2));
  console.log(`wrote ${name} (${Array.isArray(data) ? data.length : 'n/a'} records)`);
}

write('cities.json', cities);
write('airports.json', airports);
write('hotels.json', hotels);
write('attractions.json', attractions);
write('flights.json', flights);
write('bookings.json', bookings);

console.log('Seed data generation complete.');
