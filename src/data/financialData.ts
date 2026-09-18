import { ExpenseItem, GoalItem, BillItem, JargonTerm } from '../types';

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Apartment Rent / EMI',
    amount: 22000,
    category: 'Housing',
    date: '2026-09-01',
    isRecurring: true,
  },
  {
    id: 'exp-2',
    title: 'Grocery & Kirana Store',
    amount: 8500,
    category: 'Food & Dining',
    date: '2026-09-04',
    isRecurring: false,
  },
  {
    id: 'exp-3',
    title: 'Swiggy, Zomato & Weekend Dining',
    amount: 4800,
    category: 'Food & Dining',
    date: '2026-09-12',
    isLeak: true,
    leakReason: 'High frequency takeout; exceeds dining budget threshold (₹2,000 leak)',
  },
  {
    id: 'exp-4',
    title: 'Electricity & Water Utility',
    amount: 2400,
    category: 'Utilities',
    date: '2026-09-08',
    isRecurring: true,
  },
  {
    id: 'exp-5',
    title: 'Cult.fit Gym Membership (Zero Visits)',
    amount: 1800,
    category: 'Subscriptions',
    date: '2026-09-05',
    isRecurring: true,
    isLeak: true,
    leakReason: 'Recurring charge with zero check-ins in last 60 days',
  },
  {
    id: 'exp-6',
    title: 'Hotstar + Netflix + Prime OTT Bundles',
    amount: 1199,
    category: 'Subscriptions',
    date: '2026-09-10',
    isRecurring: true,
    isLeak: true,
    leakReason: 'Duplicate streaming subscriptions (₹799/month leak)',
  },
  {
    id: 'exp-7',
    title: 'Metro Smart Card & Auto Commute',
    amount: 2500,
    category: 'Transport',
    date: '2026-09-02',
    isRecurring: true,
  },
  {
    id: 'exp-8',
    title: 'Impulse Myntra & Amazon Flash Sales',
    amount: 3500,
    category: 'Shopping',
    date: '2026-09-14',
    isLeak: true,
    leakReason: 'Unplanned late-night purchases flagged as discretionary leak',
  },
];

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Emergency Safety Cushion',
    targetAmount: 300000,
    currentAmount: 180000,
    targetDate: '2026-12-31',
    monthlyRequired: 25000,
    iconName: 'ShieldCheck',
  },
  {
    id: 'goal-2',
    title: 'Goa & Ladakh Road Trip',
    targetAmount: 75000,
    currentAmount: 45000,
    targetDate: '2026-11-15',
    monthlyRequired: 15000,
    iconName: 'Plane',
  },
  {
    id: 'goal-3',
    title: 'Electric Vehicle Down Payment',
    targetAmount: 150000,
    currentAmount: 65000,
    targetDate: '2027-04-30',
    monthlyRequired: 12000,
    iconName: 'Car',
  },
];

export const INITIAL_BILLS: BillItem[] = [
  {
    id: 'bill-1',
    title: 'Electricity Bill (State Discom)',
    amount: 2450,
    dueDate: '2026-09-20',
    isPaid: false,
    urgency: 'high',
  },
  {
    id: 'bill-2',
    title: 'Credit Card Statement Balance',
    amount: 12500,
    dueDate: '2026-09-22',
    isPaid: false,
    urgency: 'high',
  },
  {
    id: 'bill-3',
    title: 'Airtel / Jio Fiber Broadband',
    amount: 1179,
    dueDate: '2026-09-27',
    isPaid: false,
    urgency: 'medium',
  },
  {
    id: 'bill-4',
    title: 'Health Insurance Premium',
    amount: 3200,
    dueDate: '2026-10-02',
    isPaid: false,
    urgency: 'low',
  },
];

export const JARGON_DICTIONARY: JargonTerm[] = [
  {
    term: 'SIP (Systematic Investment Plan)',
    shortName: 'SIP',
    analogy: 'Watering a money plant with half a cup of water every Sunday morning, instead of dumping a huge 50-litre tank once a year and washing the roots away.',
    explanation: 'A disciplined method where you invest a fixed amount into mutual funds at regular intervals (like ₹5,000 every month). It averages out market volatility automatically through Rupee-Cost Averaging.',
    example: 'Investing ₹5,000 every salary day into a Nifty 50 index fund rather than trying to time the highs and lows of Dalal Street.',
  },
  {
    term: 'EMI (Equated Monthly Installment)',
    shortName: 'EMI',
    analogy: 'Slicing a huge ₹1,20,000 laptop into 12 equal monthly slices of ₹10,000, so you do not have to pay the entire sum upfront in cash.',
    explanation: 'A fixed payment made by a borrower to a bank or lender on a fixed date each month. Each EMI includes both principal repayment and interest charges.',
    example: 'Repaying a car loan with a ₹12,000 monthly EMI for 5 years instead of paying ₹6,00,000 cash at the showroom.',
  },
  {
    term: 'CIBIL / Credit Score',
    shortName: 'Credit Score',
    analogy: 'A student report card for banks. If you pay your credit cards and EMIs on time, you get an A+ (750+ score) and banks offer you lower interest rates.',
    explanation: 'A three-digit number between 300 and 900 issued by bureaus like CIBIL that measures your creditworthiness and repayment history in India.',
    example: 'A CIBIL score of 780 gets you the cheapest home loan interest rate of 8.35% from SBI or HDFC.',
  },
  {
    term: 'Liquidity',
    shortName: 'Liquidity',
    analogy: 'Money in your UPI wallet or savings account is tap water—it flows instantly. Land, property, or a 5-year Fixed Deposit is an ice block in a deep freezer—it has value, but takes time to convert into cash.',
    explanation: 'How quickly and easily an investment or asset can be converted into spendable cash without losing its market value.',
    example: 'A liquid mutual fund or savings account is highly liquid (instant IMPS/UPI transfer), while real estate has low liquidity.',
  },
  {
    term: 'APY / Compounded Return (FD & PPF)',
    shortName: 'Compound Interest',
    analogy: 'Rolling a tiny snowball down a hill. As it rolls, new snow sticks to the old snow, so the snowball grows bigger and faster with every single turn.',
    explanation: 'The actual annual rate of return earned on investments when interest is reinvested to earn interest on interest (compounding).',
    example: 'At 7.5% annual compounding in a Fixed Deposit or PPF, ₹1,00,000 grows to ₹2,06,000 in 10 years without adding a single rupee.',
  },
  {
    term: 'Index Fund (Nifty 50)',
    shortName: 'Index Fund',
    analogy: 'Buying a fruit basket with a slice of every top fruit in the market, so even if one apple goes sour, your breakfast remains delicious.',
    explanation: 'A low-cost mutual fund that mirrors a market benchmark (like the Nifty 50 or BSE Sensex) to deliver the broad economic growth of India with very low expense ratios.',
    example: 'Investing in a Nifty 50 Index fund gives you instant ownership in India’s top 50 giants (TCS, Reliance, HDFC, Infosys, etc.).',
  },
];

export const SAMPLE_SCAMS = [
  {
    title: 'Urgent SBI YONO PAN KYC Freeze SMS',
    snippet: 'URGENT from SBI: Your YONO account will be blocked today due to pending PAN/KYC verification. Update immediately at http://sbi-pan-kyc-verify.xyz to avoid immediate account suspension.',
  },
  {
    title: 'Electricity Disconnection Warning Scam',
    snippet: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by electricity office because your previous month bill was not updated. Call Electricity Officer immediately at 98765-XXXXX.',
  },
  {
    title: 'Part-Time Telegram Video Liking Job Scam',
    snippet: 'Hi! Earn ₹3,000 to ₹5,000 daily working from home by liking YouTube videos and rating hotels. Deposit ₹2,000 registration fee and receive ₹3,500 return immediately in your UPI account.',
  },
];
