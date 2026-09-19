import { NextResponse } from 'next/server';

// In-memory feedback store (fail-safe without SQLite dependency crash)
let feedbackStore: Record<string, any[]> = {};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ success: true, feedbacks: [] });
  }

  const list = feedbackStore[placeId] || [];
  return NextResponse.json({ success: true, feedbacks: list });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { placeId, userName, rating, comment, photoUrl } = body;

    if (!placeId || !comment) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      user_name: userName || 'Verified Yatri',
      rating: rating || 5,
      comment,
      photo_url: photoUrl || null,
      created_at: new Date().toISOString(),
    };

    if (!feedbackStore[placeId]) {
      feedbackStore[placeId] = [];
    }
    feedbackStore[placeId].unshift(newFeedback);

    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}