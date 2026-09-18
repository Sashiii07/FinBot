import React, { useState } from 'react';
import { Calculator, TrendingUp, HelpCircle, LineChart, Check } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const CalculatorsTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [activeTab, setActiveTab] = useState<'emi' | 'compound'>('emi');

  // EMI State (Indian context: ₹10 Lakhs home/car loan at 8.5% for 5 years)
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

  // Compound Interest State (Indian SIP context: ₹25k initial + ₹5k monthly at 12% Nifty CAGR)
  const [initPrincipal, setInitPrincipal] = useState(25000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [growthRate, setGrowthRate] = useState(12);
  const [growthYears, setGrowthYears] = useState(10);

  // EMI Calculation
  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return { emi: P / n, totalPayment: P, totalInterest: 0 };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  };

  // Compound Interest Calculation
  const calculateCompound = () => {
    const P = initPrincipal;
    const PMT = monthlyDeposit;
    const r = growthRate / 100;
    const t = growthYears;

    let balance = P;
    let totalInvested = P;

    for (let yr = 1; yr <= t; yr++) {
      for (let m = 1; m <= 12; m++) {
        balance = (balance + PMT) * (1 + r / 12);
        totalInvested += PMT;
      }
    }

    return {
      finalBalance: Math.round(balance),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(balance - totalInvested),
    };
  };

  const emiResult = calculateEMI();
  const compoundResult = calculateCompound();

  const handleAskEmiExplanation = () => {
    onAskFinBot(
      `FinBot, explain the EMI calculation for a loan of ₹${loanAmount.toLocaleString('en-IN')} at ${interestRate}% interest over ${tenureYears} years (${
        tenureYears * 12
      } months). Break down the formula step-by-step and show how much total interest in Indian Rupees I will pay.`
    );
  };

  const handleAskCompoundChart = () => {
    onAskFinBot(
      `FinBot, simulate compound interest growth starting with ₹${initPrincipal.toLocaleString('en-IN')}, adding ₹${monthlyDeposit.toLocaleString('en-IN')} monthly SIP at an expected ${growthRate}% annual return over ${growthYears} years. Generate a dynamic Line Chart showing the compound interest and monthly savings growth in Indian Rupees over time, along with step-by-step formula explanations.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Sub tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('emi')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'emi'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>EMI Loan Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('compound')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'compound'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Compound Interest & SIP</span>
        </button>
      </div>

      {activeTab === 'emi' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Loan Principal Amount</span>
                <span className="text-emerald-700 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="10000000"
                step="25000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Annual Interest Rate (%)</span>
                <span className="text-emerald-700 font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="24"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Loan Tenure (Years)</span>
                <span className="text-emerald-700 font-bold">{tenureYears} Years ({tenureYears * 12} mo)</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Formula Note */}
            <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Formula:</span> EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1]
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                ₹{emiResult.emi.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Total Interest
                  </span>
                  <span className="text-base font-bold text-rose-600">
                    ₹{emiResult.totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Total Repayment
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    ₹{emiResult.totalPayment.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAskEmiExplanation}
              className="mt-4 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask FinBot for Step-by-Step Formula Breakdown</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compound Inputs */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Initial Deposit (₹)</span>
                <span className="text-indigo-700 font-bold">₹{initPrincipal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={initPrincipal}
                onChange={(e) => setInitPrincipal(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Monthly SIP Contribution (₹)</span>
                <span className="text-indigo-700 font-bold">₹{monthlyDeposit.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Annual Expected Return (%)</span>
                <span className="text-indigo-700 font-bold">{growthRate}%</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="0.5"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Time Horizon (Years)</span>
                <span className="text-indigo-700 font-bold">{growthYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={growthYears}
                onChange={(e) => setGrowthYears(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Compound Result Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Estimated Future Portfolio Value
              </span>
              <div className="text-3xl font-extrabold text-indigo-700 mt-1">
                ₹{compoundResult.finalBalance.toLocaleString('en-IN')}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Your Total Invested
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    ₹{compoundResult.totalInvested.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Wealth Gained (Interest)
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    +₹{compoundResult.totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAskCompoundChart}
              className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LineChart className="w-3.5 h-3.5 text-indigo-600" />
              <span>Generate SIP & Growth Line Chart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
