import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartPayload } from '../types';
import { PieChart as PieIcon, BarChart3, TrendingUp, Info } from 'lucide-react';

interface Props {
  payload: ChartPayload;
}

function detectCurrencySymbol(payload: ChartPayload): string {
  const combined = `${payload.title} ${payload.datasets?.map((d) => d.label || '').join(' ') || ''}`;
  if (combined.includes('$')) return '$';
  if (combined.includes('€')) return '€';
  if (combined.includes('£')) return '£';
  if (combined.includes('¥')) return '¥';
  // Default to Indian Rupee
  return '₹';
}

const PALETTE = [
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#ec4899', // pink
];

export const DynamicChartRenderer: React.FC<Props> = ({ payload }) => {
  const { chartType, title, labels, datasets } = payload;
  const currencySymbol = detectCurrencySymbol(payload);

  if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
    return null;
  }

  // Format data for Recharts
  const formattedData = labels.map((label, index) => {
    const item: Record<string, any> = { name: label };
    datasets.forEach((ds) => {
      item[ds.label || 'Amount'] = ds.data[index] ?? 0;
    });
    return item;
  });

  const primaryDataset = datasets[0];
  const totalAmount = primaryDataset?.data?.reduce((acc, curr) => acc + (Number(curr) || 0), 0) || 0;

  const renderIcon = () => {
    switch (chartType) {
      case 'pie':
        return <PieIcon className="w-4 h-4 text-emerald-600" />;
      case 'bar':
        return <BarChart3 className="w-4 h-4 text-indigo-600" />;
      case 'line':
        return <TrendingUp className="w-4 h-4 text-sky-600" />;
    }
  };

  const formatTooltipValue = (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    const formatted = num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    return currencySymbol ? `${currencySymbol}${formatted}` : formatted;
  };

  const formatAxisTick = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return val;
    let text = `${num}`;
    if (num >= 100000) {
      const l = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
      text = `${l}L`;
    } else if (num >= 1000) {
      text = `${(num / 1000).toFixed(0)}k`;
    }
    return currencySymbol ? `${currencySymbol}${text}` : text;
  };

  return (
    <div className="w-full my-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100/80">{renderIcon()}</div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
            <span className="text-xs font-medium text-slate-400 capitalize">
              Interactive {chartType} visualization
            </span>
          </div>
        </div>

        {totalAmount > 0 && chartType === 'pie' && (
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
              Total Sum
            </span>
            <span className="text-sm font-bold text-slate-800">
              {currencySymbol}{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Pie
                data={formattedData}
                dataKey={primaryDataset?.label || 'Amount'}
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {formattedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : chartType === 'bar' ? (
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={formatAxisTick}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              {datasets.length > 1 && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              {datasets.map((ds, idx) => (
                <Bar
                  key={ds.label || idx}
                  dataKey={ds.label || 'Amount'}
                  fill={PALETTE[idx % PALETTE.length]}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={formattedData} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={formatAxisTick}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {datasets.map((ds, idx) => (
                <Line
                  key={ds.label || idx}
                  type="monotone"
                  dataKey={ds.label || 'Amount'}
                  stroke={PALETTE[idx % PALETTE.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: PALETTE[idx % PALETTE.length] }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Dynamically rendered by FinBot Visual Engine
        </span>
        <span>{labels.length} data points</span>
      </div>
    </div>
  );
};
