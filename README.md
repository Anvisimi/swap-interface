# Crypto Swap Interface

This is a Next.js application that implements a currency swap interface, developed as part of the Switcheo Code Challenge. The application is deployed on Vercel and can be accessed at https://swap-interface-ten.vercel.app/

## Features

- Real-time token price fetching from https://interview.switcheo.com/prices.json
- Interactive currency swap form
- Support for multiple token pairs
- Responsive design for various screen sizes

## Technology Stack

- Next.js
- React
- TypeScript
- Vercel (Deployment)

## Local Development

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## Deployment

The application is deployed on Vercel and can be found at:
- Deployment Dashboard: https://vercel.com/simran-aroras-projects
- Live Application: https://swap-interface-ten.vercel.app/

## Project Structure

Brief description of key directories and files:
- `/components` - React components including the swap interface
- `/pages` - Next.js pages and routing
- `/styles` - CSS and styling files
- `/utils` - Utility functions and helpers

## API Integration

The application integrates with Switcheo's price API endpoint (https://interview.switcheo.com/prices.json) to fetch real-time token prices.

