import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps { label: string; variant?: BadgeVariant; className?: string }

const variants: Record<BadgeVariant, string> = {
  default: 'bg-dark-600 text-gray-300',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  danger:  'bg-red-500/20 text-red-400',
  info:    'bg-brand-500/20 text-brand-400',
};

export default function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {label}
    </span>
  );
}
