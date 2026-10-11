import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  options = [],
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputBaseClasses = `w-full rounded-[10px] border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 bg-white placeholder-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all ${
    error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
  } ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          ref={ref}
          className={inputBaseClasses}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, index) => {
            const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
            const lbl = typeof opt === 'object' && opt !== null ? opt.label : opt;
            return (
              <option key={`${val}-${index}`} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          ref={ref}
          placeholder={placeholder}
          rows={3}
          className={inputBaseClasses}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={inputBaseClasses}
          {...props}
        />
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
export { Input };
