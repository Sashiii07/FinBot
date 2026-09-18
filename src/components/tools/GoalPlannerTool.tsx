import React, { useState } from 'react';
import { GoalItem } from '../../types';
import { INITIAL_GOALS } from '../../data/financialData';
import { Target, Calendar, Plus, Sparkles, TrendingUp, Check } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const GoalPlannerTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [newTitle, setNewTitle] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newCurrentAmount, setNewCurrentAmount] = useState('');
  const [newMonths, setNewMonths] = useState('6');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(newTargetAmount);
    const current = Number(newCurrentAmount) || 0;
    const months = Number(newMonths) || 1;

    if (!newTitle.trim() || target <= 0 || months <= 0) return;

    const remaining = Math.max(0, target - current);
    const monthlyRequired = Math.ceil(remaining / months);

    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const targetDate = d.toISOString().split('T')[0];

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate,
      monthlyRequired,
    };

    setGoals([...goals, newGoal]);
    setNewTitle('');
    setNewTargetAmount('');
    setNewCurrentAmount('');
  };

  const handleAskStrategy = (goal: GoalItem) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    onAskFinBot(
      `FinBot, help me plan my financial goal: "${goal.title}". My target is ₹${goal.targetAmount.toLocaleString('en-IN')}, and I currently have ₹${goal.currentAmount.toLocaleString('en-IN')} saved (leaving ₹${remaining.toLocaleString('en-IN')} needed). Target deadline is ${goal.targetDate}. Calculate my required monthly savings in Indian Rupees and suggest practical milestones to stay on track!`
    );
  };

  return (
    <div className="space-y-4">
      {/* Create New Goal Card */}
      <form
        onSubmit={handleAddGoal}
        className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>Add New Financial Target</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Goal (e.g. Wedding, Laptop, Down Payment)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Target Amount (₹)"
            value={newTargetAmount}
            onChange={(e) => setNewTargetAmount(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="Current Saved (₹)"
            value={newCurrentAmount}
            onChange={(e) => setNewCurrentAmount(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <div className="flex gap-2">
            <select
              value={newMonths}
              onChange={(e) => setNewMonths(e.target.value)}
              className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="3">In 3 Months</option>
              <option value="6">In 6 Months</option>
              <option value="12">In 12 Months</option>
              <option value="24">In 2 Years</option>
              <option value="36">In 3 Years</option>
            </select>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Active Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{goal.title}</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {progress}%
                  </span>
                </div>

                <div className="mt-2 text-xl font-extrabold text-slate-900">
                  ₹{goal.currentAmount.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400 font-semibold">
                      Required / Mo
                    </span>
                    <span className="font-bold text-emerald-700">
                      ₹{goal.monthlyRequired.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-slate-400 font-semibold">
                      Deadline
                    </span>
                    <span className="font-medium text-slate-700">{goal.targetDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAskStrategy(goal)}
                className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strategy Breakdown</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
