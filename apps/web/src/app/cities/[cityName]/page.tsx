// apps/web/src/app/cities/[cityName]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { EventCard } from '@/components/ui/event-card';
import { FadeIn } from '@/components/ui/fade-in';
import { LoaderCircle, RefreshCw, Search } from 'lucide-react';

// --- Type Definitions ---
type Event = {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  imageUrl: string | null;
  category: string;
};

type City = {
  id: number;
  name: string;
  country: string;
};

type CityPageProps = {
  params: {
    cityName: string;
  };
};

// --- Main Component ---
export default function CityPage({ params }: CityPageProps) {
  const [city, setCity] = useState<City | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const cityName = decodeURIComponent(params.cityName);

  const fetchCityAndEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cityRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities/by-name/${cityName}`);
      if (!cityRes.ok) {
        if (cityRes.status === 404) throw new Error(`The city '${cityName}' could not be found.`);
        throw new Error(`Failed to fetch city data (status: ${cityRes.status}).`);
      }
      const cityData: City = await cityRes.json();
      setCity(cityData);

      const eventsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?cityId=${cityData.id}`);
      if (!eventsRes.ok) throw new Error('Failed to fetch events for this city.');
      
      const eventsData: Event[] = await eventsRes.json();
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setScrapeMessage('');
    }
  }, [cityName]);

  useEffect(() => {
    fetchCityAndEvents();
  }, [fetchCityAndEvents]);

  const handleFindNewEvents = async () => {
    if (!city) return;

    setIsScraping(true);
    setScrapeMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities/${city.id}/find-events`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to start scraper.');

      const data = await res.json();
      setScrapeMessage(data.message + " Page will refresh in 60 seconds.");

      setTimeout(() => {
        setScrapeMessage("Refreshing events...");
        fetchCityAndEvents();
      }, 60000);
    } catch (err) {
      setScrapeMessage(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsScraping(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="w-full bg-secondary rounded-xl p-6 animate-pulse">
          <div className="w-full h-48 mb-6 rounded-lg bg-muted" />
          <div className="h-8 w-3/4 mb-4 rounded bg-muted" />
          <div className="h-4 w-1/2 mb-3 rounded bg-muted" />
          <div className="h-4 w-1/2 mb-4 rounded bg-muted" />
          <div className="h-12 w-full rounded bg-muted" />
        </div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-10">
          <h2 className="text-xl font-semibold text-destructive">{error}</h2>
          <p className="text-muted-foreground mt-2">Please try refreshing the page or select another city.</p>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <h2 className="text-xl font-semibold">No Events Found</h2>
          <p className="text-muted-foreground mt-2">There are no upcoming events for {cityName}.</p>
          <p className="text-muted-foreground mt-1">Try the 'Find New Events' button to search for some.</p>
        </div>
      );
    }

    return events.map((event, index) => (
      <FadeIn key={event.id} delay={index * 50}>
        <Link href={`/events/details/${event.id}`} className="no-underline block h-full">
          <EventCard
            title={event.title}
            date={new Date(event.eventDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
            venue={event.location || 'Venue not specified'}
            description={event.description || 'No description available.'}
            imageUrl={event.imageUrl}
          />
        </Link>
      </FadeIn>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold capitalize text-primary">{cityName}</h1>
          <p className="text-lg text-muted-foreground">Upcoming events in the city.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
              onClick={handleFindNewEvents}
              disabled={isScraping || isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isScraping ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Find New Events
          </button>
          <button onClick={fetchCityAndEvents} disabled={isLoading || isScraping} className="p-2 border rounded-md hover:bg-secondary disabled:opacity-50" title="Refresh events">
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      {scrapeMessage && <p className="text-center mb-4 text-sm text-muted-foreground">{scrapeMessage}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderContent()}
      </div>
    </div>
  );
}