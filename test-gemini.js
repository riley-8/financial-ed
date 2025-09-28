// test-gemini.js - Simple test to verify your Gemini API key works
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGeminiAPI() {
    console.log("Testing Gemini API connection...");
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found in .env file");
        console.log("Please add GEMINI_API_KEY=your-api-key-here to your .env file");
        return;
    }
    
    console.log(`🔑 API Key found: ${apiKey.substring(0, 10)}...`);
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        
        console.log("📡 Sending test request to Gemini...");
        
        const result = await model.generateContent("Say hello and confirm you're working!");
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ Success! Gemini API is working:");
        console.log("📝 Response:", text);
        
    } catch (error) {
        console.error("❌ Error testing Gemini API:");
        console.error("Error details:", error.message);
        
        if (error.message.includes("API key not valid")) {
            console.log("\n🔧 Troubleshooting steps:");
            console.log("1. Go to https://aistudio.google.com/");
            console.log("2. Sign in and get a new API key");
            console.log("3. Update your .env file with: GEMINI_API_KEY=your-new-key");
            console.log("4. Restart your server");
        }
    }
}

// Run the test
testGeminiAPI();

