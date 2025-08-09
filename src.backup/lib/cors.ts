/**
 * CORS Utility for API Routes
 * Handles Cross-Origin Resource Sharing headers
 */

import { NextResponse } from 'next/server';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleCors(response: NextResponse) {
  const headers = corsHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function corsResponse(data: any, status: number = 200) {
  const response = NextResponse.json(data, { status });
  return handleCors(response);
}

export function corsErrorResponse(error: string, status: number = 500) {
  const response = NextResponse.json({ error }, { status });
  return handleCors(response);
}

// Handle OPTIONS preflight requests
export function handleOptions() {
  const response = new NextResponse(null, { status: 200 });
  return handleCors(response);
}