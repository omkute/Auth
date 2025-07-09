import { deleteSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await deleteSession();

    deleteSession()
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}