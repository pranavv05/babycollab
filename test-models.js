const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = 'AIzaSyBScpDcBYdiRBX5-4eggXB4dC9-tHTz7kk'; // Use the same API key
  const ai = new GoogleGenerativeAI(apiKey);
  
  // List of model names to test
  const modelNames = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'gemini-pro',
    'gemini-flash'
  ];
  
  console.log('Testing available models...');
  
  for (const name of modelNames) {
    try {
      const model = ai.getGenerativeModel({ model: name });
      console.log(`✓ Model ${name} is available`);
      
      // Try to generate a simple response to confirm it works
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: "Say hello" }] }]
      });
      
      console.log(`  Response: ${result.response.text()}`);
    } catch (error) {
      console.log(`✗ Model ${name} is not available: ${error.message}`);
    }
  }
}

testModels().catch(console.error);