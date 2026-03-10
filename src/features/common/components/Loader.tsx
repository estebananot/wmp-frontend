import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', color = 'indigo' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    indigo: 'border-indigo-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo}`} />
  );
};
