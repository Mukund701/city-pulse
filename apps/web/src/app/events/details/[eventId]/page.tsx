// apps/web/src/app/events/details/[eventId]/page.tsx
import { Calendar, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';

// --- Type Definition ---
type Event = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string | null;
  city: {
    name: string;
  };
};

async function getEventDetails(eventId: string): Promise<Event | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const event = await getEventDetails(params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      {event.imageUrl && (
        <div className="mb-8 w-full aspect-video overflow-hidden rounded-xl shadow-lg border border-border">
          <img
            src={event.imageUrl}
            alt={`Promotional image for ${event.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header Section */}
      <div className="border-b border-border pb-6 mb-8 text-center">
        <p className="text-primary font-semibold mb-2 capitalize">{event.city.name}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {event.title}
        </h1>
      </div>

      {/* Details Section */}
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About This Event</h2>
          <div className="prose prose-invert max-w-none text-foreground/80 leading-relaxed">
            <p>{event.description}</p>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-secondary rounded-lg p-6 space-y-4 border border-border">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 mr-4 mt-1 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold">Date and Time</h3>
                <p className="text-muted-foreground">
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-4 mt-1 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold">Location</h3>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}