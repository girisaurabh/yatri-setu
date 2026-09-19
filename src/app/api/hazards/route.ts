import { NextResponse } from 'next/server';

// Official verified SDRF / GSI Landslide & Cliff Blackspots
const VERIFIED_BLACKSPOTS = [
  {
    id: 'obs-1',
    name: 'Sunset Point Unfenced Ridge Edge',
    hazardType: 'CLIFF',
    latitude: 32.2432,
    longitude: 77.1892,
    radiusMeters: 100,
    safeAlternate: 'Use Timber Viewing Deck (120m south with safety railings)',
    alertMessage: 'Active frost erosion scree edge. 300ft vertical drop.'
  },
  {
    id: 'obs-2',
    name: 'NH-3 Ghat Sector Km 42',
    hazardType: 'LANDSLIDE',
    latitude: 32.2510,
    longitude: 77.1950,
    radiusMeters: 150,
    safeAlternate: 'Proceed at steady 25 km/h via inner hill lane. Do not halt.',
    alertMessage: 'Active rockfall sector under high soil moisture.'
  },
  {
    id: 'obs-3',
    name: 'Kasol Parvati River Slippery Boulder Bank',
    hazardType: 'RIVER_CLIFF',
    latitude: 32.0100,
    longitude: 77.3150,
    radiusMeters: 80,
    safeAlternate: 'Use pedestrian suspension bridge for photography.',
    alertMessage: 'Sudden dam surge risk and moss-covered wet boulders.'
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '32.2396');
  const lng = parseFloat(searchParams.get('lng') || '77.1887');

  try {
    // 0.1 degree box (~10 km bounding box)
    const bbox = `${lat - 0.08},${lng - 0.08},${lat + 0.08},${lng + 0.08}`;
    const overpassQuery = `
      [out:json][timeout:10];
      (
        node["natural"="cliff"](${bbox});
        node["waterway"="waterfall"](${bbox});
      );
      out body 8;
    `;

    const osmRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'text/plain' },
      cache: 'no-store',
    });

    let liveOsmHazards: any[] = [];
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      liveOsmHazards = (osmData.elements || []).map((el: any) => ({
        id: `osm-${el.id}`,
        name: el.tags?.name || (el.tags?.natural === 'cliff' ? 'Natural Unfenced Cliff' : 'Mountain Waterfall Drop'),
        hazardType: el.tags?.natural === 'cliff' ? 'CLIFF' : 'WATERFALL_DROP',
        latitude: el.lat,
        longitude: el.lon,
        radiusMeters: 100,
        safeAlternate: 'Keep minimum 20m distance from water/scree edge.',
        alertMessage: 'Natural steep terrain drop identified via OpenStreetMap GIS telemetry.'
      }));
    }

    // Combine verified blackspots + real-time OSM data
    const allHazards = [...VERIFIED_BLACKSPOTS, ...liveOsmHazards];
    return NextResponse.json({ success: true, hazards: allHazards });
  } catch (err: any) {
    // Fallback gracefully to verified blackspots if OSM times out
    return NextResponse.json({ success: true, hazards: VERIFIED_BLACKSPOTS });
  }
}