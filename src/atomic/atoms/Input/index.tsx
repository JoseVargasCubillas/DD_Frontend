import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <input
      ref={ref}
      className={clsx(
        'w-full bg-dark-700 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition',
        error ? 'border-red-500' : 'border-dark-600',
        className
      )}
      {...props}
    />
    {error && <span className="text-red-400 text-sm">{error}</span>}
  </div>
));
Input.displayName = 'Input';
export default Input;
