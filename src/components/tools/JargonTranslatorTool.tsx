import React, { useState } from 'react';
import { JargonTerm } from '../../types';
import { JARGON_DICTIONARY } from '../../data/financialData';
import { BookOpen, Sparkles, Volume2, Search, ArrowRight } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const JargonTranslatorTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<JargonTerm>(JARGON_DICTIONARY[0]);
  const [customTerm, setCustomTerm] = useState('');

  const filtered = JARGON_DICTIONARY.filter(
    (item) =>
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.explanation.toLowerCase().includes(search.toLowerCase()) ||
      item.analogy.toLowerCase().includes(search.toLowerCase())
  );

  const handleAskCustomTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTerm.trim()) return;
    onAskFinBot(
      `FinBot, explain the financial term "${customTerm.trim()}" using a friendly 8th-grade level analogy and simple real-world example so it's super easy to understand.`
    );
    setCustomTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Custom Input Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search financial terms (e.g. SIP, EMI, Liquidity)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <form onSubmit={handleAskCustomTerm} className="flex gap-1.5 shrink-0">
          <input
            type="text"
            placeholder="Ask about any term (e.g. ETF, Bull Market)"
            value={customTerm}
            onChange={(e) => setCustomTerm(e.target.value)}
            className="w-56 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
          >
            <span>Translate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Term List Buttons */}
        <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <button
              key={item.shortName}
              onClick={() => setSelectedTerm(item)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedTerm.shortName === item.shortName
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs font-semibold block">{item.term}</span>
                <span className="text-[11px] text-slate-400 font-normal">8th-Grade Analogy</span>
              </div>
              <Sparkles
                className={`w-3.5 h-3.5 ${
                  selectedTerm.shortName === item.shortName ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Selected Term Detail Card */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  8th-Grade Jargon Translation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedTerm.term}</h3>
              </div>
              <button
                onClick={() =>
                  onAskFinBot(
                    `FinBot, explain "${selectedTerm.term}" in Voice Mode using your friendly 8th-grade analogy.`
                  )
                }
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                title="Hear in voice mode"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hear Explanation</span>
              </button>
            </div>

            {/* Analogy Box */}
            <div className="my-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                The Kid-Friendly Analogy
              </span>
              <p className="text-xs text-amber-900 leading-relaxed italic">
                "{selectedTerm.analogy}"
              </p>
            </div>

            {/* Explanation */}
            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">What it really means:</span>
                <p className="leading-relaxed text-slate-600">{selectedTerm.explanation}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Real-life example:</span>
                <p className="leading-relaxed text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {selectedTerm.example}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Ask FinBot to translate any other confusing acronym anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
