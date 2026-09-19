export interface HiddenGem {
  id: string;
  name: string;
  hub: string;
  category: string;
  latitude: number;
  longitude: number;
  elevation: string;
  crowdLevel: string;
  description: string;
  bestFor: string;
  image: string;
  longDescription: string;
  localFood: string;
  bestSeason: string;
  distanceKm?: number;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
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

export const HIMALAYAN_GEMS: HiddenGem[] = [
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
    longDescription: 'Sethan is an organic high-altitude hamlet perched on granite boulders overlooking the Dhauladhar range. Far removed from Mall Road honking, it offers pristine pine air, boulder climbing, and direct access to Hampta Pass.',
    bestFor: 'Milky Way photography, igloo stays, pine hiking',
    localFood: 'Fresh Siddu with Pure Ghee, Thukpa',
    bestSeason: 'All Year (Snow in Winter)',
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
    longDescription: 'Located 11 km south of Manali on the left bank road, Sajla is bypassed by most tourists. The foot trail goes through deodar forests to a natural glacial spray pool surrounded by traditional wooden cottages.',
    bestFor: 'Nature walking, temple woodwork, pristine streams',
    localFood: 'Local Pahadi Kadhi & Rice',
    bestSeason: 'March to November',
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
    longDescription: 'Soyal feels suspended in ancient times. It has no vehicle access inside the settlement; stone-paved lanes wander between wooden balconies, drying corn cobs, and babbling cold springs.',
    bestFor: 'Kath-Kuni architecture study, forest bathing',
    localFood: 'Lugdu tea, Babru bread',
    bestSeason: 'April to November',
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
    longDescription: 'Escaping the boating queues of Nainital, Pangot is a misty sanctuary looking directly toward snow-veiled peaks. Silent pine needle walking trails connect small eco-lodges with zero noise.',
    bestFor: 'Rare bird photography, forest walks, peak views',
    localFood: 'Kumaoni Gahat ke Paranthe, Buransh squash',
    bestSeason: 'October to June',
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
    longDescription: 'Far quieter than Bhimtal or Nainital, Naukuchiatal offers pedal boating through wild white water lilies, kayaking in crystal calm waters, and angling under green mountain cliffs.',
    bestFor: 'Kayaking, silent lake walks, birdwatching',
    localFood: 'Bhatt ki Churkani, Rice',
    bestSeason: 'All Year Round',
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
    description: 'A hilltop ridge 25km above Tapovan offering breathtaking views of holy Ganga meandering through deep Shiwalik gorges.',
    longDescription: 'While Rishikesh town is crowded with traffic, Kyarki village rests at cool high altitudes. Clear sunrise over misty Ganges valleys and authentic terrace millet farms create a serene meditation spot.',
    bestFor: 'Ganga canyon views, sunset meditation, cooler weather',
    localFood: 'Fresh Mandua flatbread & Gahat soup',
    bestSeason: 'September to May',
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
    longDescription: 'Perched high on a razor mountain spine, Kunjapuri offers the most dramatic Himalayan horizon visible near Rishikesh, perfect for spiritual solitude and sunrise photography.',
    bestFor: 'Himalayan sunrise vista, quiet temple vibes',
    localFood: 'Fresh Jhangora Khichdi',
    bestSeason: 'October to April',
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
    longDescription: 'Fagu overlooks the Giri valley and stands shrouded in clouds most afternoons. Unlike the commercial congestion of Shimla Mall Road, Cheog village features silent wooden paths and cozy farmstays.',
    bestFor: 'Cloud photography, apple tree walks, crisp mountain silence',
    localFood: 'Himachali Siddu & Mint Chutney',
    bestSeason: 'All Year (Snow in Jan-Feb)',
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
    longDescription: 'Located 4km past crowded McLeodGanj, Naddi village faces open Kangra Valley on one side and a sheer 4,000m vertical snow wall on the other. It has peaceful meditation lodges.',
    bestFor: 'Direct snow peak vistas, sunset over Kangra valley',
    localFood: 'Tibetan Tingmo & Spinach soup',
    bestSeason: 'March to June, September to December',
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
    longDescription: 'Accessible only by a 20-minute gentle uphill walk through ancient pine trunks from Barshaini, Kalga offers serene apple orchards, wooden cottages, and complete freedom from vehicle horns.',
    bestFor: 'Apple orchard strolls, peaceful reading, mountain views',
    localFood: 'Fresh Honey-Ginger Lemon Tea, Siddu',
    bestSeason: 'April to November',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  }
];