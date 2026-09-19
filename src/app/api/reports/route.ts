import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { userId, description, latitude, longitude } = await req.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const insert = db.prepare(`
      INSERT INTO civic_reports (id, user_id, description, latitude, longitude)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      userId || 'GUEST',
      description,
      latitude || 32.2396,
      longitude || 77.1887
    );

    return NextResponse.json({ success: true, reportId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}