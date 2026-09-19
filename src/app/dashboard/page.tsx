'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { QRCodeSVG } from 'qrcode.react';
import {
  Mountain,
  Volume2,
  VolumeX,
  PhoneCall,
  Radio,
  QrCode,
  AlertOctagon,
  AlertTriangle,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Search,
  Loader2,
  Map as MapIcon,
  ShieldAlert,
  Car,
  MessageSquare,
  Camera,
  Trash2,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Star,
  MapPin
} from 'lucide-react';

const HazardMap = dynamic(() => import('@/components/HazardMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-xs font-mono text-slate-500 border border-slate-200">
      <Mountain className="w-8 h-8 text-slate-300 animate-pulse mb-2" />
      <span>INITIALIZING HIMALAYAN GIS TERRAIN TELEMETRY...</span>
    </div>
  ),
});

interface HiddenGem {
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

interface HazardZone {
  id: string;
  name: string;
  hazardType: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  alertMessage: string;
  safeAlternate?: string;
}

interface GemFeedback {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  created_at: string;
}

interface WasteReport {
  id: string;
  description: string;
  imagePreview?: string;
  coordinates: string;
  timestamp: string;
  authority: string;
}

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

const HIMALAYAN_GEMS: HiddenGem[] = [
  // 1. MANALI
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
  // 2. NAINITAL
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
  // 3. RISHIKESH
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
  // 4. SHIMLA
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
    longDescription: 'Fagu overlooks the Giri valley and stands shrouded in clouds most afternoons. Unlike the commercial congestion of Mall Road, Cheog village features silent wooden paths and cozy farmstays.',
    bestFor: 'Cloud photography, apple tree walks, crisp mountain silence',
    localFood: 'Himachali Siddu & Mint Chutney',
    bestSeason: 'All Year (Snow in Jan-Feb)',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80'
  },
  // 5. DHARAMSHALA
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
  // 6. KASOL
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
    longDescription: 'Accessible only by a 20-minute gentle uphill walk through ancient pine trunks from Barshaini, Kalga offers serene apple orchards, wooden cottages, and freedom from vehicle noise.',
    bestFor: 'Apple orchard strolls, peaceful reading, mountain views',
    localFood: 'Fresh Honey-Ginger Lemon Tea, Siddu',
    bestSeason: 'April to November',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'
  }
];

const FAMOUS_HUBS: Record<string, { lat: number; lng: number; name: string }> = {
  manali: { lat: 32.2396, lng: 77.1887, name: 'Manali Valley Sector' },
  nainital: { lat: 29.3919, lng: 79.4542, name: 'Nainital Lake District' },
  rishikesh: { lat: 30.0869, lng: 78.2676, name: 'Rishikesh Ganga Corridor' },
  shimla: { lat: 31.1048, lng: 77.1734, name: 'Shimla Ridge Sector' },
  dharamshala: { lat: 32.2190, lng: 76.3234, name: 'Dharamshala Dhauladhar Range' },
  kasol: { lat: 32.0100, lng: 77.3150, name: 'Kasol Parvati River Valley' },
};

export default function DashboardPage() {
  const { user } = useUser();

  const [activeView, setActiveView] = useState<'gems' | 'radar' | 'corridors' | 'yatriDesk'>('gems');
  const [currentPlaceName, setCurrentPlaceName] = useState<string>('Manali Valley Sector');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 32.2396, lng: 77.1887 });
  const [isLiveGps, setIsLiveGps] = useState<boolean>(false);

  const [nearbyGems, setNearbyGems] = useState<HiddenGem[]>(() => {
    return HIMALAYAN_GEMS.filter((g) => g.hub === 'manali')
      .map((gem) => ({
        ...gem,
        distanceKm: calculateDistance(32.2396, 77.1887, gem.latitude, gem.longitude),
      }))
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  });

  const [hazardZones] = useState<HazardZone[]>([
    {
      id: 'hz-1',
      name: 'Upper Ridge Unprotected Drop',
      hazardType: 'CLIFF_EDGE',
      latitude: 32.2410,
      longitude: 77.1895,
      radiusMeters: 100,
      alertMessage: 'Active drop-off boundary. Photography near road edge strictly prohibited.',
      safeAlternate: 'Official barricaded viewing platform 50m ahead.'
    }
  ]);

  const [greenPoints, setGreenPoints] = useState<number>(140);
  const [cliffBreach, setCliffBreach] = useState<HazardZone | null>(null);
  const [cliffDistanceMeters, setCliffDistanceMeters] = useState<number | null>(null);
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const [showEmergencySOS, setShowEmergencySOS] = useState<boolean>(false);
  const [showQRRegistration, setShowQRRegistration] = useState<boolean>(false);
  const [passCreated, setPassCreated] = useState<boolean>(true);
  const [destinationCorridor, setDestinationCorridor] = useState<string>('Sethan Valley & Hampta Foothills');

  // SELECTED GEM & COMMUNITY FEEDBACK (WITH PHOTO UPLOAD)
  const [selectedGem, setSelectedGem] = useState<HiddenGem | null>(null);
  const [gemFeedbacks, setGemFeedbacks] = useState<Record<string, GemFeedback[]>>({
    'manali-1': [
      {
        id: 'fb-1',
        user_name: 'Rohit Negi',
        rating: 5,
        comment: 'Sethan is completely peaceful. Night sky stargazing is unreal, zero commercial noise!',
        photoUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=60',
        created_at: '2 days ago'
      }
    ]
  });

  const [userComment, setUserComment] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const [feedbackPhotoBase64, setFeedbackPhotoBase64] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const feedbackFileInputRef = useRef<HTMLInputElement | null>(null);

  // Waste Reporting
  const [wasteText, setWasteText] = useState<string>('');
  const [wastePhotoBase64, setWastePhotoBase64] = useState<string | null>(null);
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [wasteReports, setWasteReports] = useState<WasteReport[]>([
    {
      id: 'MCD-8921',
      description: 'Plastic packaging & beverage bottles near pine trailhead',
      imagePreview: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&auto=format&fit=crop&q=60',
      coordinates: '32.2390° N, 77.1880° E',
      timestamp: '1 hour ago',
      authority: 'Municipal Sanitation Desk (Sector Cell)'
    }
  ]);

  // AUTO TRIGGER FOR GPS ON LOAD
  const requestLiveLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          setIsLiveGps(true);
          setCurrentPlaceName('Your Live GPS Position');

          setNearbyGems((prev) =>
            prev.map((g) => ({
              ...g,
              distanceKm: calculateDistance(lat, lng, g.latitude, g.longitude),
            })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
          );
        },
        (err) => {
          console.warn('GPS prompt response:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    requestLiveLocation();
  }, [requestLiveLocation]);

  // Siren Controls
  const playSiren = useCallback(() => {
    if (oscRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      setSirenActive(true);
    } catch (e) {}
  }, []);

  const stopSiren = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    setSirenActive(false);
  }, []);

  useEffect(() => {
    if (hazardZones.length === 0) return;

    let nearestHazard: HazardZone | null = null;
    let minDistance = Infinity;

    for (const hz of hazardZones) {
      const distKm = calculateDistance(userLocation.lat, userLocation.lng, hz.latitude, hz.longitude);
      const distM = distKm * 1000;

      if (distM < minDistance) {
        minDistance = distM;
        if (distM <= 100) {
          nearestHazard = hz;
        }
      }
    }

    if (nearestHazard) {
      setCliffBreach(nearestHazard);
      setCliffDistanceMeters(Math.round(minDistance));
      playSiren();
    } else {
      setCliffBreach(null);
      setCliffDistanceMeters(null);
    }
  }, [userLocation, hazardZones, playSiren]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    setIsSearching(true);

    const matchedHubKey = Object.keys(FAMOUS_HUBS).find((k) => query.includes(k) || k.includes(query));

    if (matchedHubKey) {
      const hubData = FAMOUS_HUBS[matchedHubKey];
      setUserLocation({ lat: hubData.lat, lng: hubData.lng });
      setCurrentPlaceName(hubData.name);

      const hubGems = HIMALAYAN_GEMS.filter(
        (g) => g.hub === matchedHubKey || g.name.toLowerCase().includes(query)
      )
        .map((gem) => ({
          ...gem,
          distanceKm: calculateDistance(hubData.lat, hubData.lng, gem.latitude, gem.longitude),
        }))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

      setNearbyGems(hubGems.length > 0 ? hubGems : HIMALAYAN_GEMS);
      setActiveView('gems');
      setIsSearching(false);
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const target = data[0];
          const newLat = parseFloat(target.lat);
          const newLng = parseFloat(target.lon);
          const name = target.display_name.split(',')[0].trim() || query;

          setUserLocation({ lat: newLat, lng: newLng });
          setCurrentPlaceName(name);

          const sorted = HIMALAYAN_GEMS.map((gem) => ({
            ...gem,
            distanceKm: calculateDistance(newLat, newLng, gem.latitude, gem.longitude),
          })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

          setNearbyGems(sorted);
          setActiveView('gems');
        } else {
          const sorted = HIMALAYAN_GEMS.map((gem) => ({
            ...gem,
            distanceKm: calculateDistance(userLocation.lat, userLocation.lng, gem.latitude, gem.longitude),
          })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
          setNearbyGems(sorted);
          setCurrentPlaceName(query);
          setActiveView('gems');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // OPEN IN GOOGLE MAPS DIRECT ROUTE
  const openInGoogleMaps = (gem: HiddenGem) => {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${gem.latitude},${gem.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // FEEDBACK PHOTO ATTACHMENT
  const handleFeedbackPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGem || !userComment.trim()) return;

    setSubmittingFeedback(true);
    const newFb: GemFeedback = {
      id: `fb-${Date.now()}`,
      user_name: user?.fullName || 'Verified Explorer',
      rating: userRating,
      comment: userComment,
      photoUrl: feedbackPhotoBase64 || undefined,
      created_at: 'Just now'
    };

    setTimeout(() => {
      setGemFeedbacks((prev) => ({
        ...prev,
        [selectedGem.id]: [newFb, ...(prev[selectedGem.id] || [])]
      }));

      setUserComment('');
      setFeedbackPhotoBase64(null);
      if (feedbackFileInputRef.current) feedbackFileInputRef.current.value = '';
      setGreenPoints((prev) => prev + 50);
      setSubmittingFeedback(false);
    }, 300);
  };

  // Waste Image Upload
  const handleWastePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWastePhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteText.trim()) return;

    setSubmittingReport(true);
    const newRep: WasteReport = {
      id: `MCD-${Math.floor(1000 + Math.random() * 9000)}`,
      description: wasteText,
      imagePreview: wastePhotoBase64 || undefined,
      coordinates: `${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E`,
      timestamp: 'Just now',
      authority: `${currentPlaceName.split(' ')[0]} Municipal Sanitation Desk`
    };

    setTimeout(() => {
      setWasteReports([newRep, ...wasteReports]);
      setWasteText('');
      setWastePhotoBase64(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setGreenPoints((prev) => prev + 35);
      setSubmittingReport(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">

      {/* 100M CLIFF WARNING POPUP */}
      {cliffBreach && (
        <div className="fixed inset-0 z-[3000] bg-rose-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rose-600 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 text-white rounded-2xl animate-pulse">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest font-mono">
                  PROXIMITY WARNING • {cliffDistanceMeters}m TO CLIFF EDGE
                </span>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  STOP! DANGEROUS CLIFF EDGE
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200">
              {cliffBreach.alertMessage} <strong>Edge selfie photography strictly prohibited.</strong>
            </p>

            {cliffBreach.safeAlternate && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-1">
                <div className="text-[11px] font-bold text-emerald-900 uppercase">
                  Safe Alternative Viewpoint:
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  {cliffBreach.safeAlternate}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={stopSiren}
                className="py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <VolumeX className="w-4 h-4" /> Mute Siren
              </button>
              <button
                onClick={() => {
                  stopSiren();
                  setCliffBreach(null);
                }}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                I am Stepping Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Telemetry Strip */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 text-xs text-slate-700 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900">Active Sector:</span>
            <span className="font-bold text-emerald-700">{currentPlaceName}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-[11px] text-slate-500">
              {nearbyGems.length} Safe High-Altitude Corridors Monitored
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <button
              onClick={requestLiveLocation}
              className={`px-2.5 py-1 rounded border flex items-center gap-1 transition ${
                isLiveGps
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>{isLiveGps ? 'GPS LOCKED' : 'SYNC LIVE GPS'}</span>
            </button>
            <div className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{greenPoints} Green Yatri Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Header with Search Bar */}
        <header className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <Link href="/" className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 shrink-0">
              <Mountain className="w-7 h-7" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yatri Setu</h1>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  GIS & COMMUNITY ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Try searching: Manali, Nainital, Rishikesh, Shimla, Dharamshala, Kasol
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full lg:max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search (Manali, Nainital, Rishikesh, Shimla)..."
                className="w-full pl-10 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 text-slate-900 transition font-medium"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition flex items-center gap-1.5 shrink-0 disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Fly Map</span>
            </button>
          </form>

          {/* Emergency Controls */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            <button
              onClick={sirenActive ? stopSiren : playSiren}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                sirenActive
                  ? 'bg-amber-500 text-black animate-pulse shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              {sirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              <span>{sirenActive ? 'Stop Alarm' : '100m Siren'}</span>
            </button>

            <button
              onClick={() => setShowEmergencySOS(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>112 SOS</span>
            </button>

            <div className="pl-2 border-l border-slate-200">
              <UserButton />
            </div>
          </div>
        </header>

        {/* 4 Tabs */}
        <nav className="bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveView('gems')}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'gems' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Offbeat Discovery ({nearbyGems.length})</span>
          </button>
          <button
            onClick={() => setActiveView('radar')}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'radar' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>GIS Hazard Radar</span>
          </button>
          <button
            onClick={() => setActiveView('corridors')}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'corridors' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Corridors & Fares</span>
          </button>
          <button
            onClick={() => setActiveView('yatriDesk')}
            className={`py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'yatriDesk' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Swachh Yatra & Pass</span>
          </button>
        </nav>

        {/* VIEW 1: OFFBEAT DISCOVERY */}
        {activeView === 'gems' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Unexplored Spots Near {currentPlaceName}</h2>
                <p className="text-xs text-slate-500">
                  Verified offbeat destinations sorted by distance. Click Explore for photos, Google Maps route, & community reviews.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full">
                {nearbyGems.length} Safe Spots Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyGems.map((gem) => (
                <div
                  key={gem.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={gem.image}
                      alt={gem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                      {gem.category} • {gem.elevation}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs font-mono font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-md">
                      ~{gem.distanceKm} km away
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{gem.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {gem.description}
                      </p>
                      <div className="pt-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                        <strong>Local Taste:</strong> {gem.localFood}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      <button
                        onClick={() => setSelectedGem(gem)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        Explore & Reviews <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* OPEN IN GOOGLE MAPS ON CARD */}
                      <button
                        onClick={() => openInGoogleMaps(gem)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 text-[11px] cursor-pointer bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Open in Map
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 2: GIS RADAR & SAFETY */}
        {activeView === 'radar' && (
          <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Geospatial Hazard Radar</h2>
                <p className="text-xs text-slate-500">
                  OpenStreetMap drop perimeters. 100m proximity triggers automatic siren.
                </p>
              </div>
              <button
                onClick={playSiren}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" /> Test 100m Cliff Siren
              </button>
            </div>

            <HazardMap
              userLocation={userLocation}
              hazardZones={hazardZones}
              hiddenGems={nearbyGems}
            />
          </section>
        )}

        {/* VIEW 3: CORRIDORS & FARES */}
        {activeView === 'corridors' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Valley Carrying Capacity</h3>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-950">Commercial City Corridor</span>
                  <span className="font-mono text-rose-800">92% FULL</span>
                </div>
                <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full w-[92%]"></div>
                </div>
                <p className="text-[11px] text-rose-700">Congested. 45+ min delay expected at entry checkposts.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-950">Outer Eco-Bypass Corridor</span>
                  <span className="font-mono text-emerald-800">22% SMOOTH</span>
                </div>
                <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[22%]"></div>
                </div>
                <p className="text-[11px] text-emerald-700">Open & smooth. Verified homestays ready.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Official Mountain Taxi Tariffs</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Shared Local Bolero / Sumo (Per Seat)</div>
                    <div className="text-[11px] text-slate-500">Bus Stand ⇄ Base Checkposts</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-slate-900">₹150</span>
                    <span className="block text-[9px] font-bold text-emerald-700">REGULATED</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Certified 4x4 Mountain Utility (Gypsy / 4WD)</div>
                    <div className="text-[11px] text-slate-500">Main Hub ⇄ Upper Alpine Hamlets</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-slate-900">₹2,200</span>
                    <span className="block text-[9px] font-bold text-emerald-700">GOVT CAPPED</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: DIGITAL PASS & SWACHH YATRA */}
        {activeView === 'yatriDesk' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Digital Yatri Pass Token</h3>
                  <p className="text-xs text-slate-500">Offline verifiable checkpost clearance QR</p>
                </div>
                <button
                  onClick={() => setShowQRRegistration(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> New Pass
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
                <QRCodeSVG
                  value={`YATRI-SETU-PASS:${user?.id || 'GUEST'}:${destinationCorridor}:VERIFIED`}
                  size={110}
                  level="M"
                />
                <div className="text-xs space-y-1.5">
                  <div className="text-sm font-bold text-slate-900">{destinationCorridor}</div>
                  <div className="text-slate-500">Tourist: {user?.fullName || 'Verified Explorer'}</div>
                  <span className="inline-block text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    OFFLINE VALIDATED • 24 HOURS
                  </span>
                </div>
              </div>
            </div>

            {/* SWACHH YATRA */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Swachh Yatra Incident Reporting</h3>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                    MCD DISPATCH
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Geo-tagged photo reports are directly routed to the <strong>Municipal Corporation Sanitation Desk</strong>.
                </p>
              </div>

              <form onSubmit={handleWasteSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Describe Waste / Issue</label>
                  <input
                    type="text"
                    required
                    value={wasteText}
                    onChange={(e) => setWasteText(e.target.value)}
                    placeholder="e.g. Plastic bottle dump near Sajla waterfall stream..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Capture or Upload Trash Photo
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWastePhotoUpload}
                      className="hidden"
                      id="waste-photo-upload"
                    />
                    <label
                      htmlFor="waste-photo-upload"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition text-xs"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>{wastePhotoBase64 ? 'Change Photo' : 'Select Trash Photo'}</span>
                    </label>

                    {wastePhotoBase64 && (
                      <div className="flex items-center gap-2">
                        <img
                          src={wastePhotoBase64}
                          alt="Trash preview"
                          className="h-10 w-10 object-cover rounded-lg border border-emerald-500 shadow-xs"
                        />
                        <span className="text-[11px] text-emerald-700 font-bold">Photo Attached ✓</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 
                    GPS Attached: {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                  </span>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition disabled:opacity-50 cursor-pointer text-xs"
                  >
                    {submittingReport ? 'Dispatching...' : 'Dispatch to MCD (+35 Pts)'}
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Dispatched Reports</span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {wasteReports.map((rep) => (
                    <div key={rep.id} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-slate-900">{rep.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{rep.timestamp}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        {rep.imagePreview && (
                          <img src={rep.imagePreview} alt="Incident" className="h-10 w-10 object-cover rounded-lg border border-slate-300 shrink-0" />
                        )}
                        <div>
                          <p className="text-slate-800 font-medium">{rep.description}</p>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold">{rep.coordinates}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* PLACE DETAIL MODAL (WITH OPEN IN MAP & COMMUNITY REVIEWS + PHOTO UPLOAD) */}
      {selectedGem && (
        <div className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                  {selectedGem.category} • {selectedGem.elevation}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedGem.name}</h2>
                <span className="text-xs text-emerald-700 font-mono font-bold">~{selectedGem.distanceKm} km from current coordinates</span>
              </div>
              <button onClick={() => setSelectedGem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-60 w-full rounded-2xl overflow-hidden relative shadow-inner">
                <img src={selectedGem.image} alt={selectedGem.name} className="w-full h-full object-cover" />
                
                {/* OPEN IN GOOGLE MAPS NAVIGATION BUTTON */}
                <button
                  onClick={() => openInGoogleMaps(selectedGem)}
                  className="absolute bottom-3 right-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xl cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Map (Live Route)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-medium">{selectedGem.longDescription}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div><strong>Best Season:</strong> {selectedGem.bestSeason}</div>
                  <div><strong>Local Taste:</strong> {selectedGem.localFood}</div>
                </div>
              </div>

              {/* COMMUNITY REVIEWS & FEEDBACK WITH PHOTO UPLOAD */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Traveler Experiences ({gemFeedbacks[selectedGem.id]?.length || 0})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {!gemFeedbacks[selectedGem.id] || gemFeedbacks[selectedGem.id].length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No community feedback yet. Be the first traveler to post!</p>
                  ) : (
                    gemFeedbacks[selectedGem.id].map((fb) => (
                      <div key={fb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{fb.user_name}</span>
                          <span className="text-amber-500 font-bold">{'★'.repeat(fb.rating)}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{fb.comment}</p>
                        {fb.photoUrl && (
                          <div className="pt-1">
                            <img
                              src={fb.photoUrl}
                              alt="Review attachment"
                              className="h-16 w-24 object-cover rounded-lg border border-slate-200"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* USER FEEDBACK FORM WITH PHOTO ATTACHMENT */}
                <form onSubmit={handleFeedbackSubmit} className="bg-slate-100 p-3.5 rounded-2xl space-y-2.5 text-xs">
                  <div className="font-bold text-slate-800 text-[11px]">Share Your Experience & Attach Travel Photo (+50 Points)</div>
                  
                  <input
                    type="text"
                    required
                    placeholder="Write your experience (e.g. pristine mountain stream, peaceful homestay)..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-emerald-600"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Photo Upload */}
                    <div className="flex items-center gap-2">
                      <input
                        ref={feedbackFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFeedbackPhotoUpload}
                        className="hidden"
                        id="review-photo-upload"
                      />
                      <label
                        htmlFor="review-photo-upload"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-50 text-[11px]"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{feedbackPhotoBase64 ? 'Photo Attached ✓' : 'Add Photo'}</span>
                      </label>
                      {feedbackPhotoBase64 && (
                        <img
                          src={feedbackPhotoBase64}
                          alt="Thumbnail preview"
                          className="h-7 w-7 object-cover rounded border border-emerald-500"
                        />
                      )}
                    </div>

                    {/* Rating and Submit */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setUserRating(num)}
                            className={`text-sm ${userRating >= num ? 'text-amber-500' : 'text-slate-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {submittingFeedback ? 'Posting...' : 'Post Review'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {showEmergencySOS && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase">SOS DISPATCH 112</span>
              </div>
              <button onClick={() => setShowEmergencySOS(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs space-y-1 text-slate-700">
              <div>SECTOR: <span className="font-bold text-slate-900">{currentPlaceName}</span></div>
              <div>COORDINATES: <span className="font-bold text-slate-900">{userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a href="tel:112" className="py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs">
                <PhoneCall className="w-4 h-4" /> CALL 112
              </a>
              <a href={`sms:112?body=SOS%20YATRI:%20Need%20help%20at%20${userLocation.lat}N,${userLocation.lng}E`} className="py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs">
                <Radio className="w-4 h-4 text-emerald-400" /> OFFLINE SMS
              </a>
            </div>
          </div>
        </div>
      )}

      {/* E-Pass Modal */}
      {showQRRegistration && (
        <div className="fixed inset-0 z-[1600] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Checkpost Digital Pass</h3>
              <button onClick={() => setShowQRRegistration(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tourist</label>
                <input type="text" readOnly value={user?.fullName || 'Verified Traveler'} className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination</label>
                <input type="text" value={destinationCorridor} onChange={(e) => setDestinationCorridor(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600" />
              </div>
            </div>
            <button
              onClick={() => {
                setPassCreated(true);
                setShowQRRegistration(false);
                setActiveView('yatriDesk');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Confirm Digital Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}