import React, { useState } from 'react';
import { BillItem } from '../../types';
import { INITIAL_BILLS } from '../../data/financialData';
import { CalendarClock, AlertCircle, CheckCircle, Clock, Plus, Sparkles } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const BillTrackerTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [bills, setBills] = useState<BillItem[]>(INITIAL_BILLS);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState('');

  // Sort urgent first
  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const unpaidBills = bills.filter((b) => !b.isPaid);
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const handleTogglePaid = (id: string) => {
    setBills(
      bills.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b))
    );
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || !newDate) return;

    const diffDays = Math.ceil(
      (new Date(newDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const urgency = diffDays <= 3 ? 'high' : diffDays <= 7 ? 'medium' : 'low';

    const newBill: BillItem = {
      id: `bill-${Date.now()}`,
      title: newTitle.trim(),
      amount: Number(newAmount),
      dueDate: newDate,
      isPaid: false,
      urgency,
    };

    setBills([...bills, newBill]);
    setNewTitle('');
    setNewAmount('');
    setNewDate('');
  };

  const handleAskSchedule = () => {
    const listSummary = unpaidBills
      .map((b) => `${b.title}: ₹${b.amount.toLocaleString('en-IN')} (Due: ${b.dueDate})`)
      .join('; ');
    onAskFinBot(
      `FinBot, here are my upcoming bills:\n${listSummary}\nTotal unpaid: ₹${totalUnpaid.toLocaleString('en-IN')}. Please organize these into an urgent-first schedule and give me a safe cashflow strategy to avoid late fees.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Urgent Bills Due Soon</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            ₹{totalUnpaid.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400 ml-1.5">
              ({unpaidBills.length} unpaid items)
            </span>
          </div>
        </div>

        <button
          onClick={handleAskSchedule}
          className="flex items-center gap-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
          <span>Organize Urgent-First Schedule</span>
        </button>
      </div>

      {/* Add Bill Form */}
      <form onSubmit={handleAddBill} className="flex flex-wrap sm:flex-nowrap gap-2 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <input
          type="text"
          placeholder="Bill title (e.g. BESCOM Power, Credit Card, Wifi)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="w-24 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Bills List - Urgent First */}
      <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden max-h-72 overflow-y-auto">
        {sortedBills.map((bill) => (
          <div
            key={bill.id}
            className={`p-3 flex items-center justify-between transition-colors ${
              bill.isPaid ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTogglePaid(bill.id)}
                className="cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors"
                title={bill.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
              >
                {bill.isPaid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-emerald-500" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      bill.isPaid ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {bill.title}
                  </span>

                  {!bill.isPaid && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        bill.urgency === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : bill.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {bill.urgency === 'high'
                        ? 'Urgent'
                        : bill.urgency === 'medium'
                        ? 'Upcoming'
                        : 'Scheduled'}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <CalendarClock className="w-3 h-3 text-slate-400" />
                  Due: {bill.dueDate}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  bill.isPaid ? 'text-slate-400' : 'text-slate-900'
                }`}
              >
                ₹{bill.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {bill.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
