require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return;
  }
  
  if (!apiKey.startsWith('AIza')) {
    console.error('Invalid GEMINI_API_KEY format');
    return;
  }
  
  try {
    console.log('Initializing GoogleGenerativeAI client...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with gemini-2.5-flash which should be available
    console.log('Testing with gemini-2.5-flash model...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Say hello in 3 different languages";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('API test successful!');
    console.log('Response:', text);
  } catch (error) {
    console.error('API test failed:', error.message);
    console.error('Error details:', error);
    
    // Try with another model
    try {
      console.log('\nTrying with gemini-2.0-flash model...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = "Say hello in 3 different languages";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('API test successful!');
      console.log('Response:', text);
    } catch (error2) {
      console.error('Second API test failed:', error2.message);
    }
  }
}

testAvailableModels();