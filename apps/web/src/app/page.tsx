// apps/web/src/app/page.tsx
import { EventCard } from '@/components/ui/event-card';
import { SearchBar } from '@/components/ui/search-bar';
import { FadeIn } from '@/components/ui/fade-in';
import Link from 'next/link';

// --- Type Definition ---
type Event = {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  imageUrl: string | null;
};

async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/featured`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });
    if (!res.ok) throw new Error('Failed to fetch featured events');
    return res.json();
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Discover the Pulse
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Find the most exciting events happening in cities around the world.
        </p>
      </div>

      {/* Search Bar Section */}
      <div className="mb-16">
        <SearchBar />
      </div>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <FadeIn key={event.id} delay={index * 100}>
                <Link href={`/events/details/${event.id}`} className="no-underline h-full flex">
                  <EventCard
                    title={event.title}
                    date={new Date(event.eventDate).toLocaleDateString("en-US", {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                    venue={event.location || 'Venue not specified'}
                    description={event.description || 'No description available.'}
                    imageUrl={event.imageUrl}
                  />
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}