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

// Serve static assets
app.use(express.static(path.join(__dirname, "src", "frontend")));
app.use(express.static(path.join(__dirname, "src", "frontend", "html")));

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Landing page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "frontend", "html", "landing.html"));
});

// API routes
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Enhanced AI Chat endpoint with education context
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    let systemPrompt = `You are a professional Personal Financial Advisor and Educational Content Creator for FinSecure app.`;

    // Customize prompt based on context
    switch(context) {
      case 'course_generation':
        systemPrompt += `

Create comprehensive financial literacy course content. When asked about a course topic:

1. Create an engaging, actionable course title (max 50 characters)
2. Write a compelling description (max 120 characters) that explains practical benefits
3. List 3-4 specific learning outcomes that students will achieve

Focus on:
- Beginner-friendly content that builds confidence
- Practical, actionable strategies people can implement immediately
- Real-world applications and examples
- Current financial trends and best practices for 2024

Format your response clearly with:
Title: [course title]
Description: [practical description]
Learning Outcomes:
• [outcome 1]
• [outcome 2] 
• [outcome 3]

Topic: ${message}`;
        break;

      case 'article_generation':
        systemPrompt += `

Create engaging financial article content. When asked about an article topic:

1. Create a compelling, clickable title (max 60 characters)
2. Write an engaging preview/summary (max 150 characters) that makes readers want to learn more
3. List key insights the article would cover

Focus on:
- Current financial trends and market developments
- Practical advice people can use today  
- Common mistakes to avoid
- Expert insights and data-driven recommendations
- Relevance to 2024 economic conditions

Format your response clearly with:
Title: [engaging title]
Preview: [compelling summary]
Key Insights:
• [insight 1]
• [insight 2]
• [insight 3]

Topic: ${message}`;
        break;

      case 'video_recommendations':
        systemPrompt += `

Recommend high-quality YouTube channels and specific videos for financial literacy education.

Focus on:
- Well-established, credible financial educators
- Channels with consistent, accurate content
- Videos that are beginner-friendly but comprehensive
- Diverse perspectives on personal finance topics

Suggest specific channel names and video topics that would be most valuable for someone learning financial literacy.

Request: ${message}`;
        break;

      default:
        systemPrompt += `

Your role:
- Provide accurate, personalized financial advice
- Help with budgeting, investing, saving, and financial planning
- Educate users about financial literacy and security best practices
- Be encouraging, professional, and easy to understand

Guidelines:
- Always prioritize user financial security and safety
- Provide actionable, specific advice
- Explain financial concepts in simple terms
- Keep responses concise but informative (2-3 sentences usually)
- Use a friendly but professional tone

Current context: ${context || "General financial consultation"}

User question: ${message}`;
    }

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    res.json({
      message: aiMessage,
      timestamp: new Date().toISOString(),
      context: context
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Enhanced fallback responses based on context
    const fallbackResponses = {
      course_generation: generateCourseFallback(req.body.message),
      article_generation: generateArticleFallback(req.body.message),
      video_recommendations: getVideoRecommendationsFallback(),
      investment: "I'd recommend starting with a diversified portfolio. Consider low-cost index funds for beginners - they offer broad market exposure with lower risk. What's your investment timeline and risk tolerance?",
      budget: "Let's create a budget using the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. What's your monthly after-tax income?",
      security: "For better security, enable two-factor authentication on all financial accounts, use unique strong passwords, and be cautious of phishing emails. What specific security concern do you have?",
      default: "I'm here to help with your financial and educational questions. Could you provide more details about what specific advice you're looking for?"
    };

    const context = req.body.context || 'default';
    const message = req.body.message.toLowerCase();
    
    let fallbackMessage = fallbackResponses[context] || fallbackResponses.default;
    
    if (!fallbackResponses[context]) {
      if (message.includes("invest") || message.includes("stock") || message.includes("portfolio")) {
        fallbackMessage = fallbackResponses.investment;
      } else if (message.includes("budget") || message.includes("expense") || message.includes("save")) {
        fallbackMessage = fallbackResponses.budget;
      } else if (message.includes("security") || message.includes("password") || message.includes("hack")) {
        fallbackMessage = fallbackResponses.security;
      }
    }

    res.json({
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      fallback: true,
      context: context
    });
  }
});

// Dedicated endpoint for generating course content
app.post("/api/education/courses", async (req, res) => {
  try {
    const { topics } = req.body;
    
    if (!topics || !Array.isArray(topics)) {
      return res.status(400).json({ error: "Topics array is required" });
    }

    const courses = [];
    
    for (const topic of topics) {
      try {
        const courseResponse = await fetch(`${req.protocol}://${req.get('host')}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: topic,
            context: 'course_generation'
          })
        });
        
        if (courseResponse.ok) {
          const data = await courseResponse.json();
          const courseContent = parseCourseContent(data.message, topic);
          courses.push({
            ...courseContent,
            topic: topic,
            progress: Math.floor(Math.random() * 100),
            icon: getCourseIcon(topic)
          });
        } else {
          courses.push(generateCourseFallback(topic));
        }
      } catch (error) {
        courses.push(generateCourseFallback(topic));
      }
    }

    res.json({
      courses: courses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Course generation error:", error);
    res.status(500).json({ error: "Failed to generate courses" });
  }
});

// Dedicated endpoint for generating article content
app.post("/api/education/articles", async (req, res) => {
  try {
    const { topics } = req.body;
    
    if (!topics || !Array.isArray(topics)) {
      return res.status(400).json({ error: "Topics array is required" });
    }

    const articles = [];
    
    for (const topic of topics) {
      try {
        const articleResponse = await fetch(`${req.protocol}://${req.get('host')}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: topic,
            context: 'article_generation'
          })
        });
        
        if (articleResponse.ok) {
          const data = await articleResponse.json();
          const articleContent = parseArticleContent(data.message, topic);
          articles.push({
            ...articleContent,
            topic: topic,
            readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
            publishDate: getRecentDate(),
            views: `${(Math.random() * 20 + 5).toFixed(1)}K views`
          });
        } else {
          articles.push(generateArticleFallback(topic));
        }
      } catch (error) {
        articles.push(generateArticleFallback(topic));
      }
    }

    res.json({
      articles: articles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Article generation error:", error);
    res.status(500).json({ error: "Failed to generate articles" });
  }
});

// Video recommendations endpoint
app.get("/api/education/videos", async (req, res) => {
  try {
    // Curated high-quality financial literacy videos
    const curatedVideos = [
      {
        title: "Personal Finance Basics in 10 Minutes",
        channel: "Ben Felix",
        videoId: "HQzoZfc3GwQ",
        duration: "10:15",
        views: "1.2M views",
        description: "Essential personal finance concepts everyone should know",
        category: "basics"
      },
      {
        title: "How to Build Wealth (Starting with $0)",
        channel: "The Plain Bagel",
        videoId: "T71ibcZAX3I",
        duration: "15:30", 
        views: "850K views",
        description: "Step-by-step guide to building wealth from nothing",
        category: "wealth-building"
      },
      {
        title: "Investing for Beginners - Complete Guide",
        channel: "Two Cents",
        videoId: "gFQNPmLKj1k",
        duration: "12:45",
        views: "2.1M views",
        description: "Everything beginners need to know about investing",
        category: "investing"
      },
      {
        title: "Emergency Fund: How Much Do You Need?",
        channel: "The Financial Diet",
        videoId: "eBuBhf-xgJ8", 
        duration: "8:20",
        views: "445K views",
        description: "Calculate the right emergency fund size for your situation",
        category: "savings"
      },
      {
        title: "Credit Score Explained Simply",
        channel: "Andrei Jikh",
        videoId: "HD4H0W2tOTM",
        duration: "11:55",
        views: "890K views", 
        description: "Understanding credit scores and how to improve them",
        category: "credit"
      },
      {
        title: "Budgeting Methods That Actually Work",
        channel: "Graham Stephan", 
        videoId: "czJBKCHUsEY",
        duration: "16:10",
        views: "760K views",
        description: "Practical budgeting strategies for real people",
        category: "budgeting"
      },
      {
        title: "Index Funds vs ETFs Explained",
        channel: "Ben Felix",
        videoId: "JVVPKzKF_yU",
        duration: "14:25",
        views: "920K views",
        description: "Compare index funds and ETFs for passive investing",
        category: "investing"
      },
      {
        title: "The Psychology of Money",
        channel: "The Swedish Investor",
        videoId: "4j_cOsgRY7w",
        duration: "19:45",
        views: "650K views",
        description: "Understanding behavioral finance and money mindset",
        category: "psychology"
      }
    ];

    // Add some randomization and filtering
    const selectedVideos = curatedVideos
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    res.json({
      videos: selectedVideos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Video recommendation error:", error);
    res.status(500).json({ error: "Failed to get video recommendations" });
  }
});

// Helper functions for content generation
function parseCourseContent(aiResponse, fallbackTopic) {
  try {
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    let title = fallbackTopic;
    let description = '';
    let outcomes = [];
    
    const titleMatch = aiResponse.match(/Title:?\s*(.+?)(?:\n|$)/i);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/['"]/g, '').substring(0, 50);
    }
    
    const descMatch = aiResponse.match(/Description:?\s*(.+?)(?:\n|$)/i);
    if (descMatch) {
      description = descMatch[1].trim().substring(0, 120);
    }
    
    const bulletRegex = /[•\-\*]\s*(.+)/g;
    let match;
    while ((match = bulletRegex.exec(aiResponse)) !== null && outcomes.length < 4) {
      outcomes.push(match[1].trim());
    }
    
    return {
      title: title || fallbackTopic,
      description: description || `Learn essential ${fallbackTopic.toLowerCase()} skills.`,
      outcomes: outcomes.length > 0 ? outcomes : ['Master key concepts', 'Apply practical strategies']
    };
  } catch (error) {
    return generateCourseFallback(fallbackTopic);
  }
}

function parseArticleContent(aiResponse, fallbackTopic) {
  try {
    const titleMatch = aiResponse.match(/Title:?\s*(.+?)(?:\n|$)/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/['"]/g, '').substring(0, 60) : fallbackTopic;
    
    const previewMatch = aiResponse.match(/(?:Preview|Summary):?\s*(.+?)(?:\n|$)/i);
    const preview = previewMatch ? previewMatch[1].trim().substring(0, 150) : `Essential insights about ${fallbackTopic.toLowerCase()}`;
    
    const insights = [];
    const bulletRegex = /[•\-\*]\s*(.+)/g;
    let match;
    while ((match = bulletRegex.exec(aiResponse)) !== null && insights.length < 3) {
      insights.push(match[1].trim());
    }
    
    return {
      title: title,
      preview: preview,
      insights: insights.length > 0 ? insights : ['Expert analysis', 'Practical tips']
    };
  } catch (error) {
    return generateArticleFallback(fallbackTopic);
  }
}

function generateCourseFallback(topic) {
  return {
    title: topic,
    description: `Learn essential ${topic.toLowerCase()} skills and strategies for better financial health.`,
    outcomes: [`Understand ${topic} fundamentals`, 'Apply key concepts', 'Make informed decisions'],
    progress: Math.floor(Math.random() * 100),
    icon: getCourseIcon(topic)
  };
}

function generateArticleFallback(topic) {
  return {
    title: topic,
    preview: `Essential insights about ${topic.toLowerCase()} for your financial success.`,
    insights: ['Current trends', 'Expert advice', 'Actionable strategies'],
    readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
    publishDate: getRecentDate(),
    views: `${(Math.random() * 20 + 5).toFixed(1)}K views`
  };
}

function getVideoRecommendationsFallback() {
  return "I recommend checking out channels like Ben Felix for evidence-based investing advice, The Plain Bagel for clear financial explanations, and Two Cents for comprehensive personal finance topics. These creators provide high-quality, beginner-friendly content.";
}

function getCourseIcon(topic) {
  const iconMap = {
    'Budgeting': 'fas fa-calculator',
    'Credit': 'fas fa-credit-card', 
    'Investment': 'fas fa-chart-line',
    'Emergency': 'fas fa-piggy-bank',
    'Debt': 'fas fa-hand-holding-usd',
    'Retirement': 'fas fa-umbrella',
    'Tax': 'fas fa-file-invoice-dollar',
    'Insurance': 'fas fa-shield-alt',
    'Real Estate': 'fas fa-home',
    'Cryptocurrency': 'fas fa-coins'
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (topic.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return 'fas fa-graduation-cap';
}

function getRecentDate() {
  const dates = [
    'Nov 28, 2024', 'Dec 1, 2024', 'Dec 5, 2024',
    'Dec 8, 2024', 'Dec 12, 2024', 'Dec 15, 2024'
  ];
  return dates[Math.floor(Math.random() * dates.length)];
}

// Helper function to parse Gemini responses (existing code)
function parseGeminiResponse(text, type = "url") {
  try {
    console.log("Raw Gemini Response:", text);

    let cleanText = text.trim();
    cleanText = cleanText.replace(/```json\s*/g, "");
    cleanText = cleanText.replace(/```\s*/g, "");
    cleanText = cleanText.replace(/^json\s*/g, "");

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanText);
    console.log("Parsed Gemini Response:", parsed);

    const result = {
      safe: typeof parsed.safe === "boolean" ? parsed.safe : false,
      threatLevel: parsed.threatLevel || "medium",
      threats: Array.isArray(parsed.threats)
        ? parsed.threats
        : ["Analysis incomplete"],
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 50,
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : ["Exercise caution"],
    };

    if (type === "url") {
      result.category = parsed.category || "suspicious";
      result.details = parsed.details || {
        domainAnalysis: "Unable to analyze domain",
        contentRisks: "Unknown risk level",
        userAction: "caution",
      };
    } else if (type === "message") {
      result.scamType = parsed.scamType || null;
    }

    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw text was:", text);

    if (type === "url") {
      return {
        safe: false,
        threatLevel: "medium",
        threats: ["AI analysis failed - treating as potentially unsafe"],
        confidence: 30,
        recommendations: [
          "Exercise extreme caution",
          "Manual security review recommended",
          "Do not enter sensitive information",
        ],
        category: "suspicious",
        details: {
          domainAnalysis: "Unable to analyze due to parsing error",
          contentRisks: "Unknown - proceed with caution",
          userAction: "caution",
        },
      };
    } else {
      return {
        safe: false,
        threatLevel: "medium",
        threats: ["AI analysis failed - treating as potentially unsafe"],
        scamType: "Unknown - analysis incomplete",
        confidence: 30,
        recommendations: [
          "Exercise caution",
          "Manual review recommended",
          "Do not respond to suspicious messages",
        ],
      };
    }
  }
}

// URL scanning (existing code)
app.post("/api/scan/url", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    console.log(`🔍 Scanning URL with Gemini AI: ${url}`);

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

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
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Gemini Raw Response:", analysisText);

    const analysis = parseGeminiResponse(analysisText, "url");

    res.json({
      type: "URL",
      target: url,
      timestamp: new Date().toISOString(),
      ...analysis,
    });
  } catch (error) {
    console.error("❌ Gemini URL Scan Error:", error);
    res.status(500).json({
      error: "Gemini AI service unavailable",
      message: error.message,
    });
  }
});

// Message scanning (existing code)
app.post("/api/scan/message", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    console.log(`🔍 Scanning message with Gemini AI: ${content.substring(0, 100)}...`);

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

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
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Gemini Raw Response:", analysisText);

    const analysis = parseGeminiResponse(analysisText, "message");

    res.json({
      type: "MESSAGE",
      content: content.substring(0, 500),
      timestamp: new Date().toISOString(),
      ...analysis,
    });
  } catch (error) {
    console.error("❌ Gemini Message Scan Error:", error);
    res.status(500).json({
      error: "Gemini AI service unavailable",
      message: error.message,
    });
  }
});

// Supabase users API (existing code)
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// API 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);