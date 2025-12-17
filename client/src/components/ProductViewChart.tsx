import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const data = [
  { name: "Day 1", value: 6.5 },
  { name: "Day 2", value: 8.2 },
  { name: "Day 3", value: 5.8 },
  { name: "Day 4", value: 7.1 },
  { name: "Day 5", value: 10.2 },
  { name: "Day 6", value: 6.9 },
  { name: "Day 7", value: 8.5 },
];

export function ProductViewChart() {
  return (
    <Card className="p-6 shadow-xl shadow-gray-200/50 border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">Product view</h3>
          <p className="text-xs text-gray-500 mt-0.5">Revenue from product views</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-36 h-9 text-sm bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors" style={{ borderRadius: 'var(--radius-lg)' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ borderRadius: 'var(--radius-lg)' }}>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative">
        <div className="absolute top-6 left-6 z-10">
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">$10.2m</div>
          <div className="text-xs text-gray-500 mt-1">Peak revenue</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={50}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value === 10.2 
                    ? "url(#emeraldGradient)" 
                    : "#e5e7eb"
                  } 
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}