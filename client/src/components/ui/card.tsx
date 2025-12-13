import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className = "" }: CardProps) {
  return <p className={`text-gray-600 text-sm ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={className}>{children}</div>;
}
