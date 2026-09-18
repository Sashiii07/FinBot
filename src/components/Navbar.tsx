import React from 'react';
import { FinBotAvatar } from './FinBotAvatar';
import { VoiceVisualizer } from './VoiceVisualizer';
import { Volume2, VolumeX, Mic, MicOff, Trash2, Shield, Sparkles } from 'lucide-react';

interface Props {
  voiceMode: boolean;
  onToggleVoiceMode: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  onStopSpeaking: () => void;
  onClearChat: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<Props> = ({
  voiceMode,
  onToggleVoiceMode,
  isSpeaking,
  isListening,
  onStopSpeaking,
  onClearChat,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Assistant Status */}
        <div className="flex items-center gap-3">
          <FinBotAvatar isSpeaking={isSpeaking} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight font-display">
                FinBot
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Personal Finance AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Empathetic, Ultra-Efficient & Interactive Financial Guidance
            </p>
          </div>
        </div>

        {/* Voice Mode Controller & Actions */}
        <div className="flex items-center gap-3">
          <VoiceVisualizer
            isSpeaking={isSpeaking}
            isListening={isListening}
            voiceMode={voiceMode}
            onToggleVoiceMode={onToggleVoiceMode}
            onStopSpeaking={onStopSpeaking}
          />

          {/* Voice Mode Toggle Switch */}
          <button
            onClick={onToggleVoiceMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              voiceMode
                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
            title={voiceMode ? 'Voice Mode Active: Spoken responses & concise numbers' : 'Enable Voice Mode'}
          >
            {voiceMode ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceMode ? 'Voice: ON' : 'Voice: OFF'}</span>
          </button>

          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5 border-t border-slate-100 text-xs no-scrollbar">
        {[
          { id: 'chat', label: '💬 Conversation & Visuals' },
          { id: 'expenses', label: '💸 Expense & Leaks' },
          { id: 'budget', label: '📊 50/30/20 Budgeter' },
          { id: 'goals', label: '🎯 Goals & Deadlines' },
          { id: 'calculators', label: '🧮 EMI & Compound' },
          { id: 'jargon', label: '📖 8th-Grade Jargon' },
          { id: 'scams', label: '🛡️ Scam Radar' },
          { id: 'bills', label: '📅 Urgent Bills' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
