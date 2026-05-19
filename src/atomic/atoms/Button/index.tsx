import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white',
  secondary: 'border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white',
  ghost:     'text-gray-300 hover:text-white hover:bg-dark-700',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children, variant = 'primary', size = 'md', isLoading = false, fullWidth = false, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        variants[variant], sizes[size], fullWidth && 'w-full', className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
