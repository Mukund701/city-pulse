// apps/web/src/components/ui/city-card.tsx
'use client';

import Link from 'next/link';

interface CityCardProps {
  name: string;
  country: string;
  description: string;
}

export function CityCard({ name, country, description }: CityCardProps) {
  return (
    <div className="bg-secondary p-6 rounded-lg border border-border transition-all hover:border-primary/80 hover:shadow-lg">
      <h3 className="text-2xl font-bold text-primary">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{country}</p>
      <p className="text-foreground/80 mb-6 h-20 line-clamp-4">{description}</p>
      <Link 
        href={`/cities/${encodeURIComponent(name.toLowerCase())}`}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        Find Events
      </Link>
    </div>
  );
}