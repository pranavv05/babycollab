const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testApiKey() {
  const apiKey = 'AIzaSyBScpDcBYdiRBX5-4eggXB4dC9-tHTz7kk'; // Use the same API key
  const ai = new GoogleGenerativeAI(apiKey);
  
  try {
    // Try to initialize a simple model
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    console.log('Model initialized successfully');
    
    // Try to generate a simple response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello, world!" }] }]
    });
    
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApiKey().catch(console.error);