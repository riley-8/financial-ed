import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from src/frontend directory
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Serve landing page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'landing.html'));
});

// Serve dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'dashboard.html'));
});

// API routes
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Helper function to parse Gemini responses
function parseGeminiResponse(text, type = 'url') {
  try {
    console.log('Raw Gemini Response:', text);
    
    // Clean the text more thoroughly
    let cleanText = text.trim();
    
    // Remove various markdown formatting patterns
    cleanText = cleanText.replace(/```json\s*/g, '');
    cleanText = cleanText.replace(/```\s*/g, '');
    cleanText = cleanText.replace(/^json\s*/g, '');
    
    // Try to find JSON in the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanText);
    console.log('Parsed Gemini Response:', parsed);
    
    // Validate required fields and provide defaults
    const result = {
      safe: typeof parsed.safe === 'boolean' ? parsed.safe : false,
      threatLevel: parsed.threatLevel || "medium",
      threats: Array.isArray(parsed.threats) ? parsed.threats : ["Analysis incomplete"],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 50,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Exercise caution"]
    };
    
    // Add additional fields based on type
    if (type === 'url') {
      result.category = parsed.category || "suspicious";
      result.details = parsed.details || {
        domainAnalysis: "Unable to analyze domain",
        contentRisks: "Unknown risk level",
        userAction: "caution"
      };
    } else if (type === 'message') {
      result.scamType = parsed.scamType || null;
    }
    
    return result;
    
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Raw text was:', text);
    
    // Return comprehensive fallback response based on type
    if (type === 'url') {
      return {
        safe: false,
        threatLevel: "medium",
        threats: ["AI analysis failed - treating as potentially unsafe"],
        confidence: 30,
        recommendations: ["Exercise extreme caution", "Manual security review recommended", "Do not enter sensitive information"],
        category: "suspicious",
        details: {
          domainAnalysis: "Unable to analyze due to parsing error",
          contentRisks: "Unknown - proceed with caution",
          userAction: "caution"
        }
      };
    } else {
      return {
        safe: false,
        threatLevel: "medium",
        threats: ["AI analysis failed - treating as potentially unsafe"],
        scamType: "Unknown - analysis incomplete",
        confidence: 30,
        recommendations: ["Exercise caution", "Manual review recommended", "Do not respond to suspicious messages"]
      };
    }
  }
}

// AI Chat endpoint for Gemini integration
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Import Google Generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Enhanced system prompt for financial advisor
    const systemPrompt = `You are a professional Personal Financial Advisor and Cybersecurity Expert for FinSecure app. 

Your role:
- Provide accurate, personalized financial advice
- Help with budgeting, investing, saving, and financial planning
- Identify and warn about cybersecurity threats
- Scan URLs and messages for potential fraud
- Educate users about financial literacy and security best practices
- Be encouraging, professional, and easy to understand

Guidelines:
- Always prioritize user financial security and safety
- Provide actionable, specific advice
- Explain financial concepts in simple terms
- Include relevant cybersecurity warnings when appropriate
- If scanning URLs or messages, provide detailed threat analysis
- Keep responses concise but informative (2-3 sentences usually)
- Use a friendly but professional tone

Current context: ${context || 'General financial and security consultation'}

User question: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    res.json({ 
      message: aiMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback responses for common scenarios
    const fallbackResponses = {
      investment: "I'd recommend starting with a diversified portfolio. Consider low-cost index funds for beginners - they offer broad market exposure with lower risk. What's your investment timeline and risk tolerance?",
      budget: "Let's create a budget using the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. What's your monthly after-tax income?",
      security: "For better security, enable two-factor authentication on all financial accounts, use unique strong passwords, and be cautious of phishing emails. What specific security concern do you have?",
      scan: "I can help analyze links and messages for threats. Please share the URL or message content you'd like me to review for potential scams or phishing attempts.",
      default: "I'm here to help with your financial and security questions. Could you provide more details about what specific advice you're looking for?"
    };

    const message = req.body.message.toLowerCase();
    let fallbackMessage = fallbackResponses.default;
    
    if (message.includes('invest') || message.includes('stock') || message.includes('portfolio')) {
      fallbackMessage = fallbackResponses.investment;
    } else if (message.includes('budget') || message.includes('expense') || message.includes('save')) {
      fallbackMessage = fallbackResponses.budget;
    } else if (message.includes('security') || message.includes('password') || message.includes('hack')) {
      fallbackMessage = fallbackResponses.security;
    } else if (message.includes('scan') || message.includes('link') || message.includes('url')) {
      fallbackMessage = fallbackResponses.scan;
    }

    res.json({ 
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// REAL Gemini AI URL Scanning - MOVED BEFORE 404 HANDLER
app.post("/api/scan/url", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    console.log(`🔍 Scanning URL with Gemini AI: ${url}`);
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Import Google Generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // REAL Gemini AI Prompt for URL Security Analysis
    const prompt = `You are a cybersecurity expert analyzing URLs for security threats. 

URL to analyze: ${url}

Analyze this URL for security risks including phishing, malware, scams, and suspicious patterns.

IMPORTANT: Respond ONLY with valid JSON in this exact format. Do not include any other text, explanations, or markdown formatting:

{
  "safe": false,
  "threatLevel": "high",
  "threats": ["Suspicious domain pattern", "Potential phishing indicators"],
  "confidence": 85,
  "recommendations": ["Do not visit this URL", "Report as suspicious"],
  "category": "suspicious",
  "details": {
    "domainAnalysis": "Domain shows red flags",
    "contentRisks": "High risk of credential theft",
    "userAction": "avoid"
  }
}

Analyze the URL and provide your assessment in the exact JSON format above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Gemini Raw Response:", analysisText);

    // Parse the REAL Gemini response
    const analysis = parseGeminiResponse(analysisText, 'url');
    
    res.json({
      type: "URL",
      target: url,
      timestamp: new Date().toISOString(),
      ...analysis
    });

  } catch (error) {
    console.error('❌ Gemini URL Scan Error:', error);
    res.status(500).json({ 
      error: "Gemini AI service unavailable",
      message: error.message
    });
  }
});

// REAL Gemini AI Message Scanning - MOVED BEFORE 404 HANDLER
app.post("/api/scan/message", async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    console.log(`🔍 Scanning message with Gemini AI: ${content.substring(0, 100)}...`);

    // Import Google Generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // REAL Gemini AI Prompt for Message Security Analysis
    const prompt = `You are a cybersecurity expert analyzing messages for scams and threats.

Message to analyze: "${content}"

Analyze this message for security risks including phishing, scams, social engineering, and malicious intent.

IMPORTANT: Respond ONLY with valid JSON in this exact format. Do not include any other text, explanations, or markdown formatting:

{
  "safe": false,
  "threatLevel": "high", 
  "threats": ["Phishing attempt", "Credential harvesting"],
  "scamType": "Financial phishing scam",
  "confidence": 90,
  "recommendations": ["Do not click any links", "Delete this message", "Report as spam"]
}

Analyze the message and provide your assessment in the exact JSON format above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Gemini Raw Response:", analysisText);

    const analysis = parseGeminiResponse(analysisText, 'message');
    
    res.json({
      type: "MESSAGE",
      content: content.substring(0, 500),
      timestamp: new Date().toISOString(),
      ...analysis
    });

  } catch (error) {
    console.error('❌ Gemini Message Scan Error:', error);
    res.status(500).json({ 
      error: "Gemini AI service unavailable",
      message: error.message
    });
  }
});

// Example: Get all users from Supabase
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 404 handler for API routes - must come AFTER all API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Serve landing page for all other routes (SPA fallback) - must be last
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'landing.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));