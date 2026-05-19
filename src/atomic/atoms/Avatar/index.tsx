interface AvatarProps { src?: string; name: string; size?: 'sm' | 'md' | 'lg' }

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' };

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-brand-500 flex items-center justify-center font-bold text-white`}>
      {initials}
    </div>
  );
}
