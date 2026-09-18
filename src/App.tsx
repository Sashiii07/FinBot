import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { Navbar } from './components/Navbar';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { QuickPromptBar } from './components/QuickPromptBar';
import { parseChartPayload, formatTextForSpeech } from './utils/chartParser';
import { voiceService } from './utils/speech';
import { ExpenseTrackerTool } from './components/tools/ExpenseTrackerTool';
import { BudgetBuilderTool } from './components/tools/BudgetBuilderTool';
import { GoalPlannerTool } from './components/tools/GoalPlannerTool';
import { CalculatorsTool } from './components/tools/CalculatorsTool';
import { JargonTranslatorTool } from './components/tools/JargonTranslatorTool';
import { ScamRadarTool } from './components/tools/ScamRadarTool';
import { BillTrackerTool } from './components/tools/BillTrackerTool';
import { Bot, Sparkles, MessageSquare, ArrowRight, ShieldAlert, PieChart, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_WELCOME_TEXT = `Hello there! I'm **FinBot**, your empathetic, ultra-efficient personal finance assistant working natively in **Indian Rupees (₹)**. 

**Voice Mode is active**, so whenever you speak with me, I will keep spoken answers warm, concise (2 to 3 sentences), and use natural rupee phrasing (e.g. *5,000 rupees*, *1 lakh rupees*).

### Indian Currency Standard & Dynamic Reasoning
- **Indian Rupees (₹) First**: All calculations, budgets, SIPs, loans, and charts default to Indian Rupees (₹ / INR / Lakhs / Crores).
- **Dynamic Reasoning**: I calculate and reason based *only* on the exact numbers, expenses, and goals you share in our chat.
- **Dynamic Visual Engine**: Request any visual breakdown, and I will generate interactive Pie, Bar, or Line charts formatted in rupees with Indian numbering (₹ / Lakhs).

### 7 Ways We Can Master Your Money:
1. **Expense Identification & Money Leaks**: Spot dining/takeout leaks and categorize your monthly spending in ₹.
2. **50/30/20 Monthly Budgeting**: Build balanced monthly budgets for your salary with dynamic Bar Charts.
3. **Goal & Target Planning**: Calculate exact monthly SIP/savings in rupees to reach your target dates.
4. **Calculators & Step-by-Step Formulas**: Compute EMI for home/car loans and compound interest on mutual funds/PPF.
5. **Jargon Translation (8th-Grade Level)**: Demystify complex Indian terms (SIP, EMI, CIBIL score, FD/PPF, liquidity).
6. **Scam & Phishing Radar**: Scan suspicious bank messages (SBI YONO SMS, electricity disconnection threats, fake UPI job scams).
7. **Bill & Deadline Tracking**: Organize your upcoming electricity, credit card, and broadband bills into an urgent-first schedule.

Share your salary, expenses, or questions, and let's optimize your finances in rupees!`;

export default function App() {
  const parsedInitial = parseChartPayload(INITIAL_WELCOME_TEXT);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'bot',
      content: INITIAL_WELCOME_TEXT,
      cleanText: parsedInitial.cleanText,
      chartPayload: parsedInitial.chartPayload,
      timestamp: new Date(),
      voiceSummary:
        'Hello there! I am FinBot, your empathetic personal finance assistant. Voice Mode is active and ready. What financial goal or question shall we tackle first?',
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>('chat');
  const [voiceMode, setVoiceMode] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle speaking
  const handleSpeakText = (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    voiceService.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  const handleToggleVoiceMode = () => {
    if (voiceMode) {
      handleStopSpeaking();
      setVoiceMode(false);
    } else {
      setVoiceMode(true);
      handleSpeakText('Voice Mode is now active. I am listening and ready.');
    }
  };

  // Send message to backend Gemini API
  const handleSendMessage = async (text: string, isVoiceInput = false) => {
    if (!text.trim() || isLoading) return;

    // Switch to chat view if in a sub-tool tab so user sees the answer
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      cleanText: text,
      timestamp: new Date(),
      isVoiceInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.role === 'bot' ? 'model' : 'user',
            text: m.content,
          })),
          voiceMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const rawReply: string =
        data.reply || "I'm right here with you! Let's explore your finances together.";

      const { cleanText, chartPayload } = parseChartPayload(rawReply);
      const voiceSummary = formatTextForSpeech(cleanText);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: rawReply,
        cleanText,
        chartPayload,
        timestamp: new Date(),
        voiceSummary,
      };

      setMessages((prev) => [...prev, botMessage]);

      // If voice mode is active, automatically speak the 2-3 sentence verbal summary
      if (voiceMode && voiceSummary) {
        handleSpeakText(voiceSummary);
      }

      // Celebrate compound interest or savings milestones with confetti
      if (/compound interest|congratulations|saved|goal reached/i.test(rawReply)) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'bot',
        content:
          "I am right here with you! I experienced a momentary glitch contacting the AI brain, but I'm ready to assist you. You can try asking again or explore the interactive calculators and scam radar tabs above.",
        cleanText:
          "I am right here with you! I experienced a momentary glitch, but I'm ready to assist you.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    handleStopSpeaking();
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'bot',
        content:
          "Conversation reset! I'm **FinBot**, ready to assist you with budgeting, expenses, calculators, jargon, scam detection, or bill scheduling. What would you like to explore?",
        cleanText:
          "Conversation reset! I'm FinBot, ready to assist you. What would you like to explore?",
        timestamp: new Date(),
        voiceSummary: 'Conversation reset. What financial goal would you like to work on next?',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* App Navigation & Voice Mode Header */}
      <Navbar
        voiceMode={voiceMode}
        onToggleVoiceMode={handleToggleVoiceMode}
        isSpeaking={isSpeaking}
        isListening={isListening}
        onStopSpeaking={handleStopSpeaking}
        onClearChat={handleClearChat}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        {/* Quick Prompt Bar (Always available) */}
        <QuickPromptBar onSelectPrompt={(prompt) => handleSendMessage(prompt, false)} />

        {/* Tab Content Display */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mt-2">
            {/* Chat Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-[460px] max-h-[calc(100vh-280px)] space-y-2">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  isSpeaking={isSpeaking}
                  onSpeak={handleSpeakText}
                />
              ))}

              {/* Loading indicator with pulse animation */}
              {isLoading && (
                <div className="flex items-center gap-3 my-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                    <span>FinBot is analyzing financial formulas and charts...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              voiceMode={voiceMode}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </div>
        ) : (
          /* Specialized Interactive Tool Views corresponding to 7 Core Goals */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2 flex-1">
            {/* Active Tool Left / Main Panel */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {activeTab === 'expenses' && '💸 Expense Identification & Money Leak Radar'}
                    {activeTab === 'budget' && '📊 Simple Monthly Budget Builder (50/30/20)'}
                    {activeTab === 'goals' && '🎯 Goal & Target Savings Planner'}
                    {activeTab === 'calculators' && '🧮 EMI Loan & Compound Interest Calculators'}
                    {activeTab === 'jargon' && '📖 8th-Grade Financial Jargon Translator'}
                    {activeTab === 'scams' && '🛡️ Scam & Phishing Analysis Radar'}
                    {activeTab === 'bills' && '📅 Urgent-First Bill & Deadline Tracker'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust variables below, test live calculations, or ask FinBot for a custom strategy.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Back to Chat</span>
                </button>
              </div>

              {activeTab === 'expenses' && (
                <ExpenseTrackerTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'budget' && (
                <BudgetBuilderTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'goals' && (
                <GoalPlannerTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'calculators' && (
                <CalculatorsTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'jargon' && (
                <JargonTranslatorTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'scams' && (
                <ScamRadarTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
              {activeTab === 'bills' && (
                <BillTrackerTool onAskFinBot={(prompt) => handleSendMessage(prompt, false)} />
              )}
            </div>

            {/* Companion FinBot Assistant Mini-Stream on the Right */}
            <div className="lg:col-span-4 flex flex-col bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <Bot className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  FinBot Companion
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto max-h-96 space-y-2 pr-1 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-slate-700">
                  <span className="font-bold text-emerald-900 block mb-1">
                    Empathetic Advisor Ready:
                  </span>
                  You are currently exploring this interactive tool. You can adjust the numbers and click the action buttons to have me generate dynamic visual charts or voice explanations immediately!
                </div>

                {/* Show recent user queries or quick prompt triggers */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Questions:
                  </span>
                  {activeTab === 'expenses' && (
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'FinBot, analyze my expenses and tell me how to cut dining out by 100 dollars without feeling deprived.'
                        )
                      }
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      "How can I cut dining out by $100 without feeling deprived?"
                    </button>
                  )}
                  {activeTab === 'budget' && (
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'FinBot, explain why the 50/30/20 rule is better than strict zero-based budgeting.'
                        )
                      }
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      "Why is 50/30/20 better than strict zero-based budgeting?"
                    </button>
                  )}
                  {activeTab === 'calculators' && (
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'FinBot, how much interest do I save if I pay an extra 100 dollars per month on my loan EMI?'
                        )
                      }
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      "How much interest do I save with an extra $100/mo EMI prepayment?"
                    </button>
                  )}
                  {activeTab === 'scams' && (
                    <button
                      onClick={() =>
                        handleSendMessage(
                          'FinBot, what should I do if I accidentally clicked a phishing link in an SMS?'
                        )
                      }
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      "What if I accidentally clicked a phishing link?"
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Full Voice & Chat Window</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
