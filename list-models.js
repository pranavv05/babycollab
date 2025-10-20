const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = 'AIzaSyBScpDcBYdiRBX5-4eggXB4dC9-tHTz7kk'; // Use the same API key
  const ai = new GoogleGenerativeAI(apiKey);
  
  try {
    // This will list all available models
    const result = await ai.listModels();
    console.log('Available models:');
    result.models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName}`);
      if (model.description) {
        console.log(`  Description: ${model.description}`);
      }
      if (model.supportedGenerationMethods) {
        console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels().catch(console.error);