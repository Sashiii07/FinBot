import React, { useState } from 'react';
import { ExpenseItem } from '../../types';
import { INITIAL_EXPENSES } from '../../data/financialData';
import { AlertTriangle, Plus, Sparkles, PieChart, CheckCircle2, TrendingDown } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const ExpenseTrackerTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Food & Dining');

  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const leakExpenses = expenses.filter((e) => e.isLeak);
  const totalLeaks = leakExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) return;

    const isPotentialLeak =
      newCategory === 'Food & Dining' && Number(newAmount) > 1500;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      amount: Number(newAmount),
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      isLeak: isPotentialLeak,
      leakReason: isPotentialLeak ? 'Frequent high-amount dining takeout flagged' : undefined,
    };

    setExpenses([newExpense, ...expenses]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleToggleLeak = (id: string) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, isLeak: !e.isLeak, leakReason: e.isLeak ? undefined : 'Flagged manually as spending leak' } : e
      )
    );
  };

  const handleRequestChart = () => {
    const categoriesMap: Record<string, number> = {};
    expenses.forEach((e) => {
      categoriesMap[e.category] = (categoriesMap[e.category] || 0) + e.amount;
    });

    const categorySummary = Object.entries(categoriesMap)
      .map(([cat, amt]) => `${cat}: ₹${amt.toLocaleString('en-IN')}`)
      .join(', ');

    onAskFinBot(
      `Please categorize my monthly expenses in Indian Rupees (${categorySummary}), identify high-spending patterns or money leaks, and generate a dynamic Pie / Doughnut Chart showing my expense breakdown by category.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Monthly Expenses
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              ₹{totalSpending.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={handleRequestChart}
            className="flex items-center gap-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Generate Chart</span>
          </button>
        </div>

        <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Identified Money Leaks</span>
            </div>
            <div className="text-2xl font-bold text-rose-800 mt-0.5">
              ₹{totalLeaks.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-rose-600 ml-1.5">
                ({Math.round((totalLeaks / totalSpending) * 100 || 0)}% of budget)
              </span>
            </div>
          </div>
          <button
            onClick={() =>
              onAskFinBot(
                `FinBot, I have ${leakExpenses.length} identified money leaks totaling ₹${totalLeaks.toLocaleString('en-IN')} (such as unused subscriptions and excessive takeout). What simple habits can I swap to plug these leaks in my monthly budget?`
              )
            }
            className="flex items-center gap-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Plug Leaks</span>
          </button>
        </div>
      </div>

      {/* Quick Add Expense Form */}
      <form onSubmit={handleAddExpense} className="flex flex-wrap sm:flex-nowrap gap-2 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <input
          type="text"
          placeholder="Expense title (e.g. Swiggy order, Metro pass)"
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
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as any)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="Food & Dining">Food & Dining</option>
          <option value="Housing">Housing</option>
          <option value="Utilities">Utilities</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Expenses List */}
      <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden max-h-72 overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className={`p-3 flex items-center justify-between transition-colors ${
              expense.isLeak ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <button
                onClick={() => handleToggleLeak(expense.id)}
                title={expense.isLeak ? 'Mark as normal expense' : 'Flag as spending leak'}
                className="mt-0.5 text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                {expense.isLeak ? (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-slate-300 hover:text-emerald-500" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{expense.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {expense.category}
                  </span>
                  {expense.isLeak && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                      Money Leak
                    </span>
                  )}
                </div>
                {expense.leakReason && (
                  <p className="text-xs text-rose-600 mt-0.5">{expense.leakReason}</p>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className={`text-sm font-bold ${expense.isLeak ? 'text-rose-600' : 'text-slate-900'}`}>
                ₹{expense.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block">{expense.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
