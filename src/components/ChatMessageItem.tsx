import React, { useState } from 'react';
import { Message } from '../types';
import { FinBotAvatar } from './FinBotAvatar';
import { DynamicChartRenderer } from './DynamicChartRenderer';
import { Volume2, Copy, Check, Mic, User } from 'lucide-react';
import { voiceService } from '../utils/speech';
import { formatTextForSpeech } from '../utils/chartParser';

interface Props {
  message: Message;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
}

export const ChatMessageItem: React.FC<Props> = ({ message, isSpeaking, onSpeak }) => {
  const isBot = message.role === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVoicePlay = () => {
    const speechText = message.voiceSummary || formatTextForSpeech(message.cleanText);
    onSpeak(speechText);
  };

  // Format text into structured paragraphs and lists
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Headers (e.g. ### Header or **Header**)
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-2 mb-1">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-700 leading-relaxed my-0.5">
            {renderInlineMarkdown(content)}
          </li>
        );
      }

      // Numbered lists (e.g. 1. Item)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-sm text-slate-700 leading-relaxed">
            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center mt-0.5">
              {numMatch[1]}
            </span>
            <div className="flex-1">{renderInlineMarkdown(numMatch[2])}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="text-sm text-slate-700 leading-relaxed my-1">
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  // Basic inline formatting for **bold** and `code`
  const renderInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-800 rounded font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {isBot ? (
        <FinBotAvatar isSpeaking={isSpeaking} size="md" />
      ) : (
        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
          {message.isVoiceInput ? <Mic className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4" />}
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] md:max-w-[78%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-600">{isBot ? 'FinBot' : 'You'}</span>
          {message.isVoiceInput && (
            <span className="flex items-center gap-0.5 text-emerald-600 text-[10px] font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
              <Mic className="w-2.5 h-2.5" /> Spoken Input
            </span>
          )}
          <span>
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(message.timestamp)}
          </span>
        </div>

        <div
          className={`rounded-2xl p-4 transition-all shadow-xs ${
            isBot
              ? 'bg-white border border-slate-200/80 text-slate-800'
              : 'bg-emerald-600 text-white shadow-emerald-500/10'
          }`}
        >
          {isBot ? (
            <div>
              {renderFormattedText(message.cleanText)}

              {/* Render dynamic interactive visual chart if present */}
              {message.chartPayload && (
                <DynamicChartRenderer payload={message.chartPayload} />
              )}
            </div>
          ) : (
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Message Action Bar for FinBot responses */}
        {isBot && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <button
              onClick={handleVoicePlay}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Speak summary in Voice Mode"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voice Playback</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
