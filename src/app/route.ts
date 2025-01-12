import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json', {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 30 // Revalidate every 30 seconds
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' }, 
      { status: 500 }
    );
  }
}