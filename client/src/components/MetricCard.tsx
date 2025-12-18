import { Card } from "./ui/card";
import { Users, Megaphone, ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  icon: "users" | "Shout";
}

export function MetricCard({ title, value, change, isPositive, subtitle, icon }: MetricCardProps) {
  const Icon = icon === "users" ? Users : Megaphone;
  
  return (
    <Card className="p-5 shadow-xl shadow-gray-200/50 border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300 group" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 text-gray-600">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            icon === "users" 
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100" 
              : "bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100"
          } transition-all`}>
            <Icon className={`w-4.5 h-4.5 ${
              icon === "users" ? "text-indigo-600" : "text-emerald-600"
            }`} />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-lg ${
          isPositive 
            ? 'bg-emerald-50 text-emerald-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {isPositive ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
          {change}
        </div>
      </div>
      <div className="mt-3">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{value}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </Card>
  );
}