// Test script to check if environment variables are loaded correctly
require('dotenv').config();

console.log('Environment variables test:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY.length);
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT SET');