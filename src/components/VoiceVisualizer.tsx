import React from 'react';
import { motion } from 'motion/react';
import { Mic, Volume2 } from 'lucide-react';

interface Props {
  isSpeaking: boolean;
  isListening: boolean;
  voiceMode: boolean;
  onToggleVoiceMode: () => void;
  onStopSpeaking: () => void;
}

export const VoiceVisualizer: React.FC<Props> = ({
  isSpeaking,
  isListening,
  voiceMode,
  onToggleVoiceMode,
  onStopSpeaking,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Voice Mode Status Indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${voiceMode ? 'bg-emerald-400' : 'bg-slate-400'} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${voiceMode ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
        </span>
        <span>Voice Mode: {voiceMode ? 'Active' : 'Muted'}</span>
      </div>

      {/* Speaking wave animation */}
      {isSpeaking && (
        <button
          onClick={onStopSpeaking}
          title="Click to stop voice playback"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <div className="flex items-center gap-0.5 h-3">
            {[40, 90, 60, 100, 50, 75].map((height, i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-indigo-500 rounded-full"
                animate={{
                  height: [`${height * 0.2}%`, `${height}%`, `${height * 0.3}%`],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + i * 0.1,
                  ease: 'easeInOut',
                }}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold">Speaking...</span>
        </button>
      )}

      {/* Listening wave animation */}
      {isListening && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-pulse">
          <Mic className="w-3.5 h-3.5 text-rose-600" />
          <span className="text-[11px] font-semibold">Listening to you...</span>
        </div>
      )}
    </div>
  );
};
