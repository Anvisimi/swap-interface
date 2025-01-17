import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching prices from API...');
    const response = await fetch('https://interview.switcheo.com/prices.json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching to ensure fresh data
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);

    // Validate data structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid data structure received:', data);
      throw new Error('Invalid data structure received from API');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}