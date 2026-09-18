import React, { useState } from 'react';
import { BarChart3, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const BudgetBuilderTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [needsSpending, setNeedsSpending] = useState(35000);
  const [wantsSpending, setWantsSpending] = useState(18000);
  const [savingsActual, setSavingsActual] = useState(16000);

  // 50/30/20 targets
  const targetNeeds = Math.round(monthlyIncome * 0.5);
  const targetWants = Math.round(monthlyIncome * 0.3);
  const targetSavings = Math.round(monthlyIncome * 0.2);

  const totalAllocated = needsSpending + wantsSpending + savingsActual;
  const remainingCash = monthlyIncome - totalAllocated;

  const handleGenerateBudgetChart = () => {
    onAskFinBot(
      `Based on my monthly income of ₹${monthlyIncome.toLocaleString('en-IN')} and current allocation (Needs: ₹${needsSpending.toLocaleString('en-IN')}, Wants: ₹${wantsSpending.toLocaleString('en-IN')}, Savings: ₹${savingsActual.toLocaleString('en-IN')}), construct a balanced monthly budget using the 50/30/20 rule and generate a dynamic Bar Chart comparing my Actual Spending vs 50/30/20 Target Budget in Indian Rupees.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Income Setting */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Monthly Take-Home Income
          </label>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            ₹{monthlyIncome.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="15000"
            max="500000"
            step="2000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-36 accent-emerald-600 cursor-pointer"
          />
          <button
            onClick={handleGenerateBudgetChart}
            className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Generate Budget Bar Chart</span>
          </button>
        </div>
      </div>

      {/* 50/30/20 Comparison Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 50% Needs */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700">50% Needs (Essential)</span>
            <span className="text-xs font-medium text-slate-400">Target: ₹{targetNeeds.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            ₹{needsSpending.toLocaleString('en-IN')}
            <span
              className={`text-xs font-semibold ml-1.5 ${
                needsSpending <= targetNeeds ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              ({Math.round((needsSpending / monthlyIncome) * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max={monthlyIncome}
            step="1000"
            value={needsSpending}
            onChange={(e) => setNeedsSpending(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Rent/EMI, utilities, groceries, school fees, transport
          </span>
        </div>

        {/* 30% Wants */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700">30% Wants (Discretionary)</span>
            <span className="text-xs font-medium text-slate-400">Target: ₹{targetWants.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            ₹{wantsSpending.toLocaleString('en-IN')}
            <span
              className={`text-xs font-semibold ml-1.5 ${
                wantsSpending <= targetWants ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              ({Math.round((wantsSpending / monthlyIncome) * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={monthlyIncome}
            step="1000"
            value={wantsSpending}
            onChange={(e) => setWantsSpending(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dining out, Swiggy, shopping, movies, vacations
          </span>
        </div>

        {/* 20% Savings */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700">20% Savings & Investments</span>
            <span className="text-xs font-medium text-slate-400">Target: ₹{targetSavings.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            ₹{savingsActual.toLocaleString('en-IN')}
            <span
              className={`text-xs font-semibold ml-1.5 ${
                savingsActual >= targetSavings ? 'text-emerald-600' : 'text-indigo-600'
              }`}
            >
              ({Math.round((savingsActual / monthlyIncome) * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={monthlyIncome}
            step="1000"
            value={savingsActual}
            onChange={(e) => setSavingsActual(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            SIPs, emergency fund, PPF, FD, extra debt prepayment
          </span>
        </div>
      </div>

      {/* Monthly Balance Verdict */}
      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between ${
          remainingCash >= 0
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/80 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {remainingCash >= 0 ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {remainingCash >= 0 ? 'Balanced Budget Surplus' : 'Budget Deficit Warning'}
            </div>
            <div className="text-xs font-medium opacity-90 mt-0.5">
              {remainingCash >= 0
                ? `You have ₹${remainingCash.toLocaleString('en-IN')} unallocated monthly cash. Great opportunity to increase your mutual fund SIP!`
                : `You are over budget by ₹${Math.abs(remainingCash).toLocaleString('en-IN')} this month. Consider adjusting discretionary spending.`}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            onAskFinBot(
              `FinBot, evaluate my monthly budget status: Income is ₹${monthlyIncome.toLocaleString('en-IN')}, Needs: ₹${needsSpending.toLocaleString('en-IN')}, Wants: ₹${wantsSpending.toLocaleString('en-IN')}, Savings: ₹${savingsActual.toLocaleString('en-IN')}, leaving a ${
                remainingCash >= 0 ? 'surplus' : 'deficit'
              } of ₹${Math.abs(remainingCash).toLocaleString('en-IN')}. What are 2 practical adjustments I can make to optimize my savings in rupees?`
            )
          }
          className="text-xs font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs shrink-0"
        >
          Get FinBot Advice
        </button>
      </div>
    </div>
  );
};
