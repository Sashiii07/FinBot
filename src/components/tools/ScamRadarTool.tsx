import React, { useState } from 'react';
import { SAMPLE_SCAMS } from '../../data/financialData';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface Props {
  onAskFinBot: (prompt: string) => void;
}

export const ScamRadarTool: React.FC<Props> = ({ onAskFinBot }) => {
  const [suspiciousText, setSuspiciousText] = useState(SAMPLE_SCAMS[0].snippet);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [detectedFlags, setDetectedFlags] = useState<string[]>([]);
  const [safeActions, setSafeActions] = useState<string[]>([]);

  const handleScanLocally = () => {
    const flags: string[] = [];
    const actions: string[] = [];
    const text = suspiciousText.toLowerCase();

    if (/urgent|immediately|within \d+ (minutes|hours)|permanently closed|frozen/i.test(text)) {
      flags.push('Artificial Urgency: Creates panic to force an impulsive reaction.');
    }
    if (/http|bit\.ly|\.xyz|\.top|\.ru|click here|verify-login/i.test(text)) {
      flags.push('Suspicious Link: Unofficial domain mimicking a genuine banking portal.');
    }
    if (/ssn|cvv|pin|otp|password|debit card number/i.test(text)) {
      flags.push('Sensitive Credential Harvesting: Legitimate institutions never request PINs or passwords.');
    }
    if (/refund|lottery|won|cashier check|wire transfer/i.test(text)) {
      flags.push('Too-Good-To-Be-True Incentive: Overpayment or unsolicited prize bait.');
    }

    if (flags.length === 0) {
      flags.push('Unrecognized sender or unfamiliar phrasing detected.');
    }

    actions.push('DO NOT click any link or reply with verification codes or PINs.');
    actions.push('Call your financial institution directly using the official phone number on your card.');
    actions.push('Forward the message to 7726 (SPAM) to alert your cellular provider.');

    setDetectedFlags(flags);
    setSafeActions(actions);
    setIsAnalyzed(true);
  };

  const handleAskFinBotDeepScan = () => {
    onAskFinBot(
      `FinBot, please perform a deep Scam & Phishing Analysis on this suspicious message:\n"${suspiciousText}"\n\nExplicitly highlight all red flags and provide immediate step-by-step safe actions to secure my accounts.`
    );
  };

  return (
    <div className="space-y-4">
      {/* Sample Badges */}
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Try a suspicious sample alert:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCAMS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSuspiciousText(sample.snippet);
                setIsAnalyzed(false);
              }}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs space-y-2.5">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Paste Suspicious SMS, Email, or Bank Notification</span>
        </label>
        <textarea
          rows={3}
          value={suspiciousText}
          onChange={(e) => {
            setSuspiciousText(e.target.value);
            setIsAnalyzed(false);
          }}
          placeholder="Paste message here (e.g. Your card is locked, click this link immediately)..."
          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            onClick={handleScanLocally}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Instant Threat Scan</span>
          </button>

          <button
            onClick={handleAskFinBotDeepScan}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Deep AI Evaluation with FinBot</span>
          </button>
        </div>
      </div>

      {/* Scan Results */}
      {isAnalyzed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Red Flags */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Red Flags Identified ({detectedFlags.length})</span>
            </div>
            <ul className="space-y-1.5">
              {detectedFlags.map((flag, idx) => (
                <li key={idx} className="text-xs text-rose-900 flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Actions */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recommended Safe Actions</span>
            </div>
            <ul className="space-y-1.5">
              {safeActions.map((action, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
