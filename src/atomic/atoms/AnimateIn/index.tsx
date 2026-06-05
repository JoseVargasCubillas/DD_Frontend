import { ReactNode, CSSProperties } from 'react';
import { useInView } from '@hooks/useInView';

type Variant = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';

interface Props {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const HIDDEN: Record<Variant, CSSProperties> = {
  'fade-up':    { opacity: 0, transform: 'translateY(28px)' },
  'fade-in':    { opacity: 0, transform: 'none' },
  'slide-left': { opacity: 0, transform: 'translateX(-16px)' },
  'slide-right':{ opacity: 0, transform: 'translateX(16px)' },
};

const VISIBLE: CSSProperties = { opacity: 1, transform: 'none' };

export default function AnimateIn({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 650,
  className = '',
  threshold,
}: Props) {
  const { ref, inView } = useInView(threshold);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(.2,.8,.2,1), transform ${duration}ms cubic-bezier(.2,.8,.2,1)`,
        transitionDelay: `${delay}ms`,
        ...(inView ? VISIBLE : HIDDEN[variant]),
      }}
    >
      {children}
    </div>
  );
}
