import Button from '@atoms/Button';

interface PricingCardProps {
  plan: string;
  price: number;
  currency?: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
}

export default function PricingCard({ plan, price, currency = 'MXN', period = '/mes', features, highlighted = false, onSelect }: PricingCardProps) {
  return (
    <div className={`card p-6 flex flex-col gap-5 ${highlighted ? 'border-brand-500 relative' : ''}`}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          Más popular
        </span>
      )}
      <div>
        <h3 className="text-xl font-bold text-white capitalize">{plan}</h3>
        <div className="flex items-end gap-1 mt-2">
          <span className="text-4xl font-heading font-bold text-brand-400">
            ${price.toLocaleString('es-MX')}
          </span>
          <span className="text-gray-400 mb-1">{currency}{period}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
            <span className="text-brand-400">✓</span> {f}
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? 'primary' : 'secondary'} fullWidth onClick={onSelect}>
        Comenzar
      </Button>
    </div>
  );
}
