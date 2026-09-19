import { NextResponse } from 'next/server';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

const LOCAL_GEMS = [
  // MANALI
  {
    id: 'manali-1',
    hub: 'manali',
    name: 'Sethan Valley & Hampta Foothills',
    category: 'BUDDHIST IGLOO HAMLET',
    latitude: 32.2285,
    longitude: 77.2345,
    elevation: '2,700m',
    crowdLevel: 'LOW / QUIET',
    description: 'A quiet Buddhist settlement 14km above Manali, known for stargazing, apple orchards, and winter igloos.',
    bestFor: 'Milky Way photography, igloo stays, pine hiking',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'manali-2',
    hub: 'manali',
    name: 'Sajla Hidden Glacial Waterfall',
    category: 'ALPINE WATERFALL & SHRINE',
    latitude: 32.1750,
    longitude: 77.1700,
    elevation: '2,050m',
    crowdLevel: 'VERY LOW',
    description: 'A secluded waterfall tumbling through virgin deodar groves near the ancient wood-carved Vishnu temple.',
    bestFor: 'Nature walking, temple woodwork, pristine streams',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'manali-3',
    hub: 'manali',
    name: 'Soyal Ancient Wood Hamlet',
    category: 'HERITAGE VILLAGE',
    latitude: 32.1450,
    longitude: 77.1620,
    elevation: '1,980m',
    crowdLevel: 'VERY LOW',
    description: 'An untouched fairytale village deep inside dense pine woods featuring centuries-old Kath-Kuni timber homes.',
    bestFor: 'Kath-Kuni architecture study, forest bathing',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80'
  },
  // NAINITAL
  {
    id: 'nainital-1',
    hub: 'nainital',
    name: 'Pangot & Kilbury Bird Sanctuary',
    category: 'OAK CANOPY RIDGE',
    latitude: 29.4183,
    longitude: 79.4317,
    elevation: '2,150m',
    crowdLevel: 'LOW / SERENE',
    description: 'Dense oak-rhododendron cloud forest 15km past Naini Lake, shelter to over 250 species of Himalayan birds.',
    bestFor: 'Rare bird photography, forest walks, peak views',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'nainital-2',
    hub: 'nainital',
    name: 'Naukuchiatal Outer Lotus Wetland',
    category: 'SACRED LAKE BASIN',
    latitude: 29.3190,
    longitude: 79.5840,
    elevation: '1,220m',
    crowdLevel: 'LOW',
    description: 'The deep nine-cornered freshwater lake bordered by pine forests and quiet lotus-carpeted coves.',
    bestFor: 'Kayaking, silent lake walks, birdwatching',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80'
  },
  // RISHIKESH
  {
    id: 'rishikesh-1',
    hub: 'rishikesh',
    name: 'Kyarki & Neer Upper Ridge',
    category: 'MOUNTAIN PASS RIDGE',
    latitude: 30.1450,
    longitude: 78.3320,
    elevation: '1,450m',
    crowdLevel: 'VERY LOW',
    description: 'A hilltop ridge 25km above Tapovan offering breathtaking views of holy Ganga meandering through deep gorges.',
    bestFor: 'Ganga canyon views, sunset meditation, cooler weather',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'rishikesh-2',
    hub: 'rishikesh',
    name: 'Kunjapuri Sunset Alpine Crest',
    category: 'SACRED TEMPLE CREST',
    latitude: 30.1700,
    longitude: 78.3100,
    elevation: '1,676m',
    crowdLevel: 'LOW / TRANQUIL',
    description: 'High vantage ridge temple with 360° panoramas of Swargarohini, Bandarpunch, and the Doon valley below.',
    bestFor: 'Himalayan sunrise vista, quiet temple vibes',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  },
  // SHIMLA
  {
    id: 'shimla-1',
    hub: 'shimla',
    name: 'Fagu & Cheog Cedar Apple Valley',
    category: 'APPLE ORCHARD HAMLET',
    latitude: 31.0900,
    longitude: 77.2900,
    elevation: '2,450m',
    crowdLevel: 'VERY LOW',
    description: 'Rolling mist valleys, dense cedar ridges, and authentic apple orchards 22km beyond commercial Shimla.',
    bestFor: 'Cloud photography, apple tree walks, crisp mountain silence',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80'
  },
  // DHARAMSHALA
  {
    id: 'dharamshala-1',
    hub: 'dharamshala',
    name: 'Naddi Upper Dhauladhar Ridge',
    category: 'GLACIAL PEAK VIEWPOINT',
    latitude: 32.2530,
    longitude: 76.3120,
    elevation: '2,160m',
    crowdLevel: 'LOW',
    description: 'Face-to-face panoramic views of the soaring Dhauladhar snow wall rising directly out of green deodar slopes.',
    bestFor: 'Direct snow peak vistas, sunset over Kangra valley',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80'
  },
  // KASOL
  {
    id: 'kasol-1',
    hub: 'kasol',
    name: 'Kalga & Tulga Twin Hamlets',
    category: 'CAR-FREE APPLE VILLAGES',
    latitude: 31.9980,
    longitude: 77.4450,
    elevation: '2,300m',
    crowdLevel: 'LOW / PEACEFUL',
    description: 'Completely car-free wooden villages perched atop emerald forest terraces overlooking the Parvati valley.',
    bestFor: 'Apple orchard strolls, peaceful reading, mountain views',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '32.2396');
  const lng = parseFloat(searchParams.get('lng') || '77.1887');
  const place = (searchParams.get('place') || '').toLowerCase().trim();

  let matched = [...LOCAL_GEMS];

  if (place && place !== 'your live gps location' && place !== 'active sector') {
    const hubMatches = LOCAL_GEMS.filter(
      (g) =>
        g.hub.includes(place) ||
        place.includes(g.hub) ||
        g.name.toLowerCase().includes(place) ||
        g.description.toLowerCase().includes(place)
    );

    if (hubMatches.length > 0) {
      matched = hubMatches;
    }
  }

  const gemsWithDistance = matched
    .map((gem) => ({
      ...gem,
      distanceKm: calculateDistance(lat, lng, gem.latitude, gem.longitude),
    }))
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  return NextResponse.json({ success: true, gems: gemsWithDistance });
}