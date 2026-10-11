import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-[10px] h-[38px] px-4 text-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-[#5c67f6] hover:bg-indigo-600 text-white shadow-xs hover:shadow-md border border-transparent',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white border border-transparent shadow-2xs',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent shadow-2xs',
    outline: 'bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-800',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  return (
    <motion.button
      whileHover={!isDisabled && !isLoading ? { scale: 1.015, y: -0.5 } : {}}
      whileTap={!isDisabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      className={combinedClasses}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && Icon && <Icon className="-ml-1 mr-1.5 h-3.5 w-3.5 text-current shrink-0" />}
      {children}
    </motion.button>
  );
};

export default Button;
