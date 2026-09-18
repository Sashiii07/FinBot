import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Volume2 } from 'lucide-react';
import { voiceService } from '../utils/speech';

interface Props {
  onSendMessage: (text: string, isVoiceInput?: boolean) => void;
  isLoading: boolean;
  voiceMode: boolean;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

export const ChatInput: React.FC<Props> = ({
  onSendMessage,
  isLoading,
  voiceMode,
  isListening,
  setIsListening,
}) => {
  const [inputText, setInputText] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isLoading) return;

    onSendMessage(textToSend, false);
    setInputText('');
    setInterimTranscript('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      if (interimTranscript.trim()) {
        onSendMessage(interimTranscript.trim(), true);
        setInterimTranscript('');
      }
    } else {
      setIsListening(true);
      setInterimTranscript('');

      const started = voiceService.startListening(
        (transcript) => {
          setInterimTranscript(transcript);
          setInputText(transcript);
        },
        {
          onStart: () => {
            setIsListening(true);
          },
          onEnd: () => {
            setIsListening(false);
          },
          onError: (err) => {
            console.warn('Speech recognition error:', err);
            setIsListening(false);
          },
        }
      );

      if (!started) {
        setIsListening(false);
        // Fallback demo prompt if SpeechRecognition is blocked in iframe
        const sampleSpoken = 'FinBot, categorize my expenses and check for money leaks.';
        setInputText(sampleSpoken);
        setTimeout(() => {
          onSendMessage(sampleSpoken, true);
        }, 500);
      }
    }
  };

  return (
    <div className="bg-white border-t border-slate-200/80 p-3 shadow-lg rounded-t-2xl">
      {/* Listening Status Banner */}
      {isListening && (
        <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between animate-pulse text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
            <span className="font-semibold">Listening... Speak your financial question now</span>
          </div>
          <button
            onClick={toggleListening}
            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold cursor-pointer hover:bg-rose-700"
          >
            Done Speaking
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
        {/* Voice Input Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 shadow-2xs ${
            isListening
              ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
              : voiceMode
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title={isListening ? 'Stop listening' : 'Click to speak question via Voice Mode'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className={`w-5 h-5 ${voiceMode ? 'text-emerald-600' : 'text-slate-600'}`} />
          )}
        </button>

        {/* Text Input Area */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to voice...'
                : voiceMode
                ? 'Ask FinBot anything in Voice Mode (Voice responses active)...'
                : 'Ask FinBot about expenses, budgets, EMI, jargon, scams, or bills...'
            }
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none max-h-32 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`p-2.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 flex items-center justify-center ${
            inputText.trim() && !isLoading
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>Never says "No" • Answers every query with empathetic clarity</span>
        </div>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
};
