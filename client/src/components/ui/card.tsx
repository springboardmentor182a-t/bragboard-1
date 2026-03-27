import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div {...props} className={clsx("bg-white shadow-md rounded-xl p-6 relative", className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div {...props} className={clsx("mb-4", className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div {...props} className={clsx("mt-2", className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={clsx("text-xl font-bold text-gray-900", className)}>{children}</h2>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={clsx("text-sm text-gray-500", className)}>{children}</p>
);
