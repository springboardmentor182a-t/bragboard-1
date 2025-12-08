import React from "react";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  config?: any;
}

export function ChartContainer({ children, className = "" }: ChartContainerProps) {
  return <div className={`w-full h-full ${className}`}>{children}</div>;
}

// ---------- TOOLTIP ----------

export function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="p-2 bg-white rounded shadow text-sm border">
      <p className="font-semibold">{label}</p>
      {payload.map((item, i) => (
        <p key={i}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

export function ChartTooltipContent() {
  return null; // we don't need content as Recharts passes payload automatically
}
