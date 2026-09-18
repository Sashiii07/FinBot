export type Role = 'user' | 'bot';

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface ChartPayload {
  chartType: 'pie' | 'bar' | 'line';
  title: string;
  labels: string[];
  datasets: ChartDataset[];
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  cleanText: string;
  timestamp: Date;
  chartPayload?: ChartPayload | null;
  isVoiceInput?: boolean;
  voiceSummary?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Housing' | 'Food & Dining' | 'Utilities' | 'Transport' | 'Subscriptions' | 'Shopping' | 'Health' | 'Other';
  date: string;
  isRecurring?: boolean;
  isLeak?: boolean;
  leakReason?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyRequired: number;
  iconName?: string;
}

export interface BillItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  urgency: 'high' | 'medium' | 'low';
}

export interface JargonTerm {
  term: string;
  shortName: string;
  analogy: string;
  explanation: string;
  example: string;
}
