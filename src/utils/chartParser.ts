import { ChartPayload } from '../types';

export function parseChartPayload(text: string): {
  cleanText: string;
  chartPayload: ChartPayload | null;
} {
  if (!text) {
    return { cleanText: '', chartPayload: null };
  }

  // Regex to match json code fence
  const codeFenceRegex = /```(?:json)?\s*(\{[\s\S]*?"chartType"[\s\S]*?\})\s*```/i;
  const match = text.match(codeFenceRegex);

  if (!match) {
    return { cleanText: text, chartPayload: null };
  }

  try {
    const rawJson = match[1];
    const parsed = JSON.parse(rawJson);

    if (
      parsed &&
      (parsed.chartType === 'pie' ||
        parsed.chartType === 'doughnut' ||
        parsed.chartType === 'bar' ||
        parsed.chartType === 'line') &&
      Array.isArray(parsed.labels) &&
      Array.isArray(parsed.datasets)
    ) {
      const normalizedChartType: 'pie' | 'bar' | 'line' =
        parsed.chartType === 'doughnut' ? 'pie' : parsed.chartType;

      const chartPayload: ChartPayload = {
        chartType: normalizedChartType,
        title: parsed.title || 'Financial Insight Chart',
        labels: parsed.labels.map((l: unknown) => String(l)),
        datasets: parsed.datasets.map((ds: { label?: string; data?: number[] }) => ({
          label: ds.label || 'Amount (₹)',
          data: Array.isArray(ds.data) ? ds.data.map(Number) : [],
        })),
      };

      // Remove the code fence from clean text
      const cleanText = text.replace(match[0], '').trim();

      return {
        cleanText,
        chartPayload,
      };
    }
  } catch (err) {
    console.warn('Failed to parse chart json payload:', err);
  }

  return { cleanText: text, chartPayload: null };
}

/**
 * Creates voice-friendly spoken summary:
 * 1. Strips markdown tables, links, code blocks, bold/italics
 * 2. Formats numbers naturally in user's detected currency (e.g. $45 -> 45 dollars, ₹5000 -> 5000 rupees)
 * 3. Keeps short (max 2-3 sentences)
 */
export function formatTextForSpeech(text: string): string {
  if (!text) return '';

  let speech = text;

  // Remove code blocks
  speech = speech.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  speech = speech.replace(/`([^`]+)`/g, '$1');
  // Remove markdown headers
  speech = speech.replace(/#{1,6}\s+/g, '');
  // Replace Indian currency symbols and notations with spoken words
  speech = speech.replace(/(?:₹|Rs\.?|INR)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakhs?|lac|lacs|crores?|cr)?/gi, (match, num, unit) => {
    return unit ? `${num} ${unit} rupees` : `${num} rupees`;
  });
  speech = speech.replace(/€\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 euros');
  speech = speech.replace(/£\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 pounds');
  speech = speech.replace(/\$\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 dollars');
  speech = speech.replace(/¥\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 yen');
  // Remove markdown bold/italics
  speech = speech.replace(/\*\*([^*]+)\*\*/g, '$1');
  speech = speech.replace(/\*([^*]+)\*/g, '$1');
  // Remove markdown bullet points
  speech = speech.replace(/^\s*[-*+]\s+/gm, '');
  // Remove multiple empty lines
  speech = speech.replace(/\n+/g, '. ');

  // Keep first 2-3 sentences for voice brevity rule
  const sentences = speech.split(/(?<=[.?!])\s+/).filter(Boolean);
  if (sentences.length > 3) {
    speech = sentences.slice(0, 3).join(' ');
  }

  return speech.trim();
}
