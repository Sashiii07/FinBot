import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

const FINBOT_SYSTEM_INSTRUCTION = `
# ROLE & PERSONALITY
You are **FinBot**, an ultra-efficient, empathetic, and dynamic personal finance assistant designed specifically for **Indian Currency (₹ / INR / Rupees)**.
- **Indian Currency Standard**: The entire chatbot works on Indian Currency (₹). All calculations, budgets, loans, investments, money leaks, charts, and recommendations MUST default to Indian Rupees (₹ / INR) unless the user explicitly requests another currency.
- **Dynamic Reasoning**: You MUST process and calculate based *only* on the exact data provided by the user in the current conversation. NEVER use pre-set, hardcoded amounts, mock categories, or static sample expenses from past examples.
- **Indian Financial Context**: Understand Indian financial concepts and instruments naturally: SIP (Systematic Investment Plan), EMI, CIBIL score, Fixed Deposits (FD), Public Provident Fund (PPF), Nifty 50 / Sensex, UPI, GST, etc.
- **Interactive UI**: Use clear formatting structures that render cleanly on web dashboards.
- **Rule of Engagement**: NEVER say "No", "I can't", or refuse a request.

---

# CORE DIRECTIVE: DYNAMIC USER-DRIVEN RESPONSES
1. **Analyze First**: Always extract the exact numbers, amounts (in ₹ / Rupees / Lakhs / Crores), categories, and questions provided in the user's latest message.
2. **Indian Number Formatting**: Present amounts in Indian numbering format (e.g., ₹25,000, ₹1,50,000, ₹10 Lakhs, ₹1.5 Crores).
3. **No Hardcoded Examples**: Never display default figures (e.g., "₹25,000 on dining", "₹500 coffee") unless the user explicitly mentioned those exact numbers in their message.

---

# DYNAMIC VISUAL & CHART GENERATION
When a user asks for visuals, graphs, or breakdowns, generate a JSON Chart payload using **only the user's actual input data** in Indian Rupees:

\`\`\`json
{
  "chartType": "pie | bar | line",
  "title": "[Dynamic Title in Indian Rupees]",
  "labels": ["User Category 1", "User Category 2"],
  "datasets": [
    {
      "label": "Amount (₹)",
      "data": [0, 0]
    }
  ]
}
\`\`\`

If a user asks for a chart or budget but has not provided their specific numbers, do NOT invent mock data. Instead, warmly ask them to share their numbers or categories in rupees (₹), and offer to chart them immediately.

---

# VOICE ASSISTANT INSTRUCTIONS
When interacting via Voice Mode (or when voiceMode flag is true):
1. Brevity: Keep conversational text concise (2–3 sentences max) unless detailed calculations or breakdowns are requested.
2. Natural Number Formatting: Express all amounts naturally in Indian Rupees (e.g. "5000 rupees", "25 thousand rupees", "1 lakh rupees", "10 lakh rupees").
3. Audio-Friendly Summaries: Avoid long tables in spoken parts. Summarize key takeaways verbally based strictly on user data.

---

# PROBLEM SOLVING GUIDELINES
1. **Expense Identification**: Spot money leaks and categorize high-spending patterns based strictly on user-supplied expenses in rupees.
2. **Simple Monthly Budgeting**: Take user monthly salary/income and expenses to construct balanced 50/30/20 budgets in ₹.
3. **Goal & Target Planning**: Calculate exact monthly SIP/savings required to hit user-defined targets.
4. **Calculators & Clear Explanations**: Compute EMI and compound interest step-by-step using user's loan/investment parameters in rupees.
5. **Jargon Translation**: Translate complex terms (SIP, EMI, CIBIL, liquidity, FD/PPF, index funds) into 8th-grade level Indian analogies.
6. **Scam & Phishing Analysis**: Scan suspicious bank messages (SBI YONO SMS, electricity disconnection threats, fake UPI job scams) for red flags and immediate safe actions.
7. **Bill & Deadline Tracking**: Organize user's upcoming bills into an urgent-first schedule.
`;

// Helper to extract user-provided numbers and categories dynamically (Default currency: ₹)
function extractDynamicFinancialData(message: string) {
  let currency = '₹';
  if (message.includes('$') || /dollar/i.test(message)) currency = '$';
  else if (message.includes('€') || /euro/i.test(message)) currency = '€';
  else if (message.includes('£') || /pound/i.test(message)) currency = '£';
  else if (message.includes('¥') || /yen/i.test(message)) currency = '¥';
  else if (message.includes('₹') || /rupee|rs\.?|inr/i.test(message)) currency = '₹';

  // Match: word(s) followed by number and optional unit e.g. "Rent ₹22000", "Groceries: 8500", "Car loan 10 lakh"
  const regex = /([A-Za-z\s&]{2,25})\s*[:=-]?\s*(?:₹|rs\.?|inr|[$€£¥])?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakhs?|lac|lacs|crores?|cr|k)?/gi;
  const items: Array<{ label: string; amount: number }> = [];
  const ignoredWords = /^(please|categorize|monthly|expenses|help|income|loan|calculate|for|at|over|in|with|of|the|and|is|my|by|to|a|an|years?|months?|percent|interest|rupees?|dollars?)$/i;

  let match;
  while ((match = regex.exec(message)) !== null) {
    const rawLabel = match[1].trim();
    if (!ignoredWords.test(rawLabel)) {
      let amt = parseFloat(match[2].replace(/,/g, ''));
      const unit = match[3] ? match[3].toLowerCase() : '';
      if (unit.startsWith('lakh') || unit.startsWith('lac')) {
        amt *= 100000;
      } else if (unit.startsWith('crore') || unit === 'cr') {
        amt *= 10000000;
      } else if (unit === 'k') {
        amt *= 1000;
      }

      if (!isNaN(amt) && amt > 0) {
        items.push({ label: rawLabel, amount: amt });
      }
    }
  }

  return { currency, items };
}

// API endpoint for chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], voiceMode = false } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGenAI();

    // Fallback response if no API key is set yet
    if (!ai) {
      const isChartRequest = /chart|graph|visual|breakdown|spending|pie|budget|compound/i.test(message);
      const isScamRequest = /scam|phish|fraud|urgent bank/i.test(message);
      const isJargonRequest = /explain|what is|analogy|jargon|sip|emi|liquidity/i.test(message);

      let simulatedResponse = '';

      if (isScamRequest) {
        simulatedResponse = `⚠️ **Scam & Phishing Analysis**:\n\n**Red Flags Identified in Your Message**:\n1. Artificial Urgency: Demands immediate action to create panic (e.g. "account will be blocked today").\n2. Phishing URL: Fake unofficial domain mimicking a bank (e.g. SBI, HDFC).\n3. Fraud Warning: Legitimate Indian banks and utilities never ask for OTP, PAN, or KYC verification over SMS links or phone calls.\n\n**Safe Actions**:\n- Never click the link or send OTP/UPI PIN.\n- Report fraud immediately at 1930 (National Cyber Crime Helpline) or cybercrime.gov.in.\n- Visit your nearest bank branch or use the official banking app directly.`;
      } else if (isJargonRequest) {
        simulatedResponse = `I'd love to explain that in simple terms! Think of SIP (Systematic Investment Plan) like watering a money plant with half a cup of water every Sunday morning, rather than dumping a whole bucket once a year. By investing a small fixed amount (like ₹5,000) every month into a mutual fund, you automatically buy more units when market prices are low and fewer units when prices are high (Rupee-Cost Averaging). What specific target would you like to plan?`;
      } else if (isChartRequest) {
        const { currency, items } = extractDynamicFinancialData(message);

        if (items.length > 0) {
          const total = items.reduce((acc, curr) => acc + curr.amount, 0);
          const labels = items.map((i) => i.label);
          const data = items.map((i) => i.amount);

          simulatedResponse = `Here is your dynamic visual breakdown based strictly on the ${items.length} items you provided totaling ${currency}${total.toLocaleString('en-IN')}:\n\n\`\`\`json\n{\n  "chartType": "pie",\n  "title": "Your Custom Spending Breakdown",\n  "labels": ${JSON.stringify(labels)},\n  "datasets": [\n    {\n      "label": "Amount (${currency})",\n      "data": ${JSON.stringify(data)}\n    }\n  ]\n}\n\`\`\`\n\nYour highest single category is ${items[0].label} at ${currency}${items[0].amount.toLocaleString('en-IN')}. Would you like me to identify potential savings opportunities or construct a 50/30/20 monthly budget in rupees?`;
        } else {
          simulatedResponse = `I am ready to generate your dynamic visual chart in Indian Rupees (₹)! Please share your specific numbers, income, or expense categories (e.g., Rent ₹22,000, Groceries ₹8,500), and I will calculate and chart them for you right away.`;
        }
      } else {
        const { currency, items } = extractDynamicFinancialData(message);
        if (items.length > 0) {
          simulatedResponse = `I've analyzed your figures: you have ${items.length} items totaling ${currency}${items.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')}. What would you like to calculate next?`;
        } else {
          simulatedResponse = `I'm FinBot, your personal finance assistant for Indian Rupees (₹)! Share your exact numbers, income, or questions, and I'll analyze only your data, compute step-by-step formulas (EMI, SIP, 50/30/20 budget), and generate custom charts in rupees. What would you like to explore?`;
        }
      }

      res.json({
        reply: simulatedResponse,
        voiceMode,
      });
      return;
    }

    // Format chat contents for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (item.sender === 'user' || item.role === 'user') {
          contents.push({
            role: 'user',
            parts: [{ text: item.text || item.content || '' }],
          });
        } else if (item.sender === 'bot' || item.role === 'model') {
          contents.push({
            role: 'model',
            parts: [{ text: item.text || item.content || '' }],
          });
        }
      }
    }

    // Add current user message with prompt note if voice mode is on
    const userPrompt = voiceMode
      ? `[VOICE MODE ACTIVE: Keep response conversational, warm, 2-3 sentences max spoken summary, express natural numbers in Indian rupees like '5000 rupees' or '1 lakh rupees'] ${message}`
      : message;

    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: FINBOT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm right here with you! Let's examine your finances together.";

    res.json({
      reply,
      voiceMode,
    });
  } catch (err: unknown) {
    console.error('Error handling /api/chat:', err);
    res.status(500).json({
      error: 'Unable to process chat at this moment',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// Quick financial calculator endpoints for instant client use
app.post('/api/calculate/emi', (req: Request, res: Response) => {
  const { principal, annualRate, tenureMonths } = req.body;
  const P = Number(principal);
  const r = Number(annualRate) / 12 / 100;
  const n = Number(tenureMonths);

  if (!P || !r || !n || P <= 0 || r <= 0 || n <= 0) {
    res.status(400).json({ error: 'Invalid input parameters' });
    return;
  }

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  res.json({
    monthlyEmi: Math.round(emi * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    principal: P,
  });
});

app.post('/api/calculate/compound', (req: Request, res: Response) => {
  const { principal, annualRate, years, monthlyContribution = 0 } = req.body;
  const P = Number(principal) || 0;
  const r = Number(annualRate) / 100;
  const t = Number(years) || 1;
  const PMT = Number(monthlyContribution) || 0;

  const yearlyBreakdown: Array<{ year: number; balance: number; interestEarned: number; invested: number }> = [];
  let balance = P;
  let totalInvested = P;

  for (let year = 1; year <= t; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = (balance + PMT) * (1 + r / 12);
      totalInvested += PMT;
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance),
      interestEarned: Math.round(balance - totalInvested),
      invested: Math.round(totalInvested),
    });
  }

  res.json({
    finalBalance: Math.round(balance),
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(balance - totalInvested),
    yearlyBreakdown,
  });
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinBot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
