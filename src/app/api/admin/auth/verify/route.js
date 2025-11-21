import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';

async function handler(req) {
  try {
    // If we reach here, token is valid
    return NextResponse.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

export const GET = verifyToken(handler);