import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const variants = {
    // Primary button - Solid royal blue background, white text (visible in both modes)
    primary: 'bg-royal hover:bg-royal-light text-white shadow-md hover:shadow-lg transition-all duration-200',
    
    // Secondary button - White background with royal border (visible in light mode)
    secondary: 'bg-white hover:bg-royal text-royal border-2 border-royal hover:text-white hover:border-transparent shadow-md transition-all duration-200 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-royal',
    
    // Outline button - Transparent with royal border
    outline: 'bg-transparent border-2 border-royal text-royal hover:bg-royal hover:text-white shadow-sm hover:shadow-md transition-all duration-200 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-royal',
    
    // Danger button - Solid red background
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}