import React from 'react';
import { PieChart, BarChart3, LineChart, ShieldAlert, Sparkles, BookOpen, Clock } from 'lucide-react';

interface Props {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickPromptBar: React.FC<Props> = ({ onSelectPrompt }) => {
  const prompts = [
    {
      label: '💸 Categorize Expenses & Leaks (Pie Chart)',
      prompt:
        'Please categorize my monthly expenses (Rent ₹22,000, Groceries ₹8,500, Swiggy/Zomato ₹4,800, Electricity ₹2,400, OTT Subscriptions ₹1,199, Shopping ₹3,500), identify any spending leaks, and generate a dynamic Pie / Doughnut Chart in rupees.',
      icon: <PieChart className="w-3 h-3 text-emerald-600" />,
    },
    {
      label: '📊 50/30/20 Budget Bar Chart',
      prompt:
        'Help me construct a monthly budget for a ₹75,000 income. Generate a dynamic Bar Chart comparing my 50/30/20 target budget versus actual spending in rupees.',
      icon: <BarChart3 className="w-3 h-3 text-indigo-600" />,
    },
    {
      label: '📈 Compound Interest & SIP Line Chart',
      prompt:
        'Simulate compound interest starting at ₹50,000 with ₹5,000 monthly SIP savings at 12% expected annual return over 10 years. Generate a dynamic Line Chart showing savings growth in rupees over time.',
      icon: <LineChart className="w-3 h-3 text-sky-600" />,
    },
    {
      label: '🧮 EMI Loan Formula',
      prompt:
        'Calculate the monthly EMI for a ₹10,00,000 car/home loan at 8.5% interest for 5 years. Show me the step-by-step formula and total interest in rupees.',
      icon: <Sparkles className="w-3 h-3 text-amber-600" />,
    },
    {
      label: '📖 Explain SIP (8th-Grade)',
      prompt:
        'Explain SIP (Systematic Investment Plan) to me using a simple 8th-grade level analogy and real-world Indian mutual fund example.',
      icon: <BookOpen className="w-3 h-3 text-violet-600" />,
    },
    {
      label: '🛡️ Scam & Phishing Radar',
      prompt:
        'Analyze this bank SMS for phishing red flags: "URGENT from SBI: Your YONO account will be blocked today due to pending PAN/KYC. Update immediately at http://sbi-pan-update.xyz/login to avoid suspension."',
      icon: <ShieldAlert className="w-3 h-3 text-rose-600" />,
    },
    {
      label: '📅 Urgent Bill Schedule',
      prompt:
        'I have ₹2,450 electricity bill due in 2 days, ₹12,500 credit card due in 4 days, and ₹1,179 broadband due in 9 days. Organize them into an urgent-first schedule with a cashflow plan in rupees.',
      icon: <Clock className="w-3 h-3 text-amber-600" />,
    },
  ];

  return (
    <div className="py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 w-max">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">
          Quick Prompts:
        </span>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.prompt)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg transition-colors border border-slate-200/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
          >
            {p.icon}
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
