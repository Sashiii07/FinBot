import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface Props {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FinBotAvatar: React.FC<Props> = ({ isSpeaking = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs border border-emerald-400/30 relative transition-transform ${
          isSpeaking ? 'ring-3 ring-emerald-400/40 ring-offset-2 scale-105' : ''
        }`}
      >
        <Bot className={iconSizes[size]} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <Sparkles className="w-2.5 h-2.5 text-amber-300 drop-shadow-xs" />
        </span>
      </div>
    </div>
  );
};
