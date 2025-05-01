"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../ui/EventCard";

interface FeaturedImage {
  url: string;
  alt_text: string;
}

interface Event {
  ID: string;
  cities: string[];
  content: string;
  created_at: string;
  cta_btn: string;
  cta_url: string;
  date: string | null;
  featured_image: FeaturedImage;
  permalink: string;
  title: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Cleans the date string by removing ordinal suffixes
  function cleanDateString(dateStr: string | null): string | null {
    if (!dateStr) return null;
    // Removes ordinal suffixes like 1st, 2nd, 3rd, 4th, etc.
    return dateStr.replace(/(\d+)(st|nd|rd|th)/g, "$1");
  }

  // Parses a date string into a Date object or returns null if invalid
  function parseEventDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;

    const cleaned = cleanDateString(dateStr);
    if (!cleaned) return null;

    const parsed = new Date(cleaned);

    // Check if the date is valid
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Format date for display or return a placeholder for invalid dates
  function formatDateForDisplay(dateStr: string | null): string {
    if (!dateStr) return "Ongoing";

    const parsedDate = parseEventDate(dateStr);
    if (!parsedDate) return "Check website for dates";

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await axios.get<Event[]>(
          "https://abarestaurants-staging-401581158498.us-central1.run.app/wp-json/lettuce/events"
        );

        const now = new Date();

        // Process each event to validate dates
        const processedEvents = data.map((event) => ({
          ...event,
          parsedDate: parseEventDate(event.date),
        }));

        // Events with a valid date and in the future
        const upcomingEvents = processedEvents
          .filter((event) => event.parsedDate && event.parsedDate >= now)
          .sort((a, b) => {
            // We already know these dates are valid from the filter
            return a.parsedDate!.getTime() - b.parsedDate!.getTime();
          });

        // Events without a valid date
        const undatedEvents = processedEvents.filter(
          (event) => !event.parsedDate
        );

        // Final list: upcoming first, then undated
        const allSortedEvents = [...upcomingEvents, ...undatedEvents].map(
          (event) => {
            // Remove the temporary parsedDate property before setting state
            const { parsedDate, ...originalEvent } = event;
            return originalEvent;
          }
        );

        setEvents(allSortedEvents);
        setFilteredEvents(allSortedEvents);

        // Build unique cities
        const uniqueCities = Array.from(
          new Set(allSortedEvents.flatMap((event) => event.cities))
        ).filter(Boolean);

        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  function handleCityFilter(city: string | null) {
    setSelectedCity(city);

    if (!city) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) => event.cities && event.cities.includes(city)
      );
      setFilteredEvents(filtered);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
      {/* If we were using the correct data, I could use a useEffect hook to set the filter to the location.city, and include location as a dependency so that any time the selected location changes, the events filter will default to that city. */}
      {/* City Filter Buttons */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md" role="group">
          <button
            onClick={() => handleCityFilter(null)}
            className={`px-4 py-2 text-sm font-medium border ${
              selectedCity === null
                ? "bg-brand-blue text-white border-brand-blue"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } rounded-l-lg`}
          >
            All
          </button>

          {cities.map((city, index) => (
            <button
              key={city}
              onClick={() => handleCityFilter(city)}
              className={`px-4 py-2 text-sm font-medium border ${
                selectedCity === city
                  ? "bg-brand-blue text-white border-brand-blue"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } ${index === cities.length - 1 ? "rounded-r-lg" : ""}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No events available.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.ID}
              id={event.ID}
              title={event.title}
              date={formatDateForDisplay(event.date)}
              cities={event.cities || []}
              content={event.content}
              ctaUrl={event.cta_url || event.permalink}
              ctaBtn={event.cta_btn || "Learn More"}
              featuredImage={
                event.featured_image?.url
                  ? {
                      url: event.featured_image.url,
                      altText: event.featured_image.alt_text || event.title,
                    }
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
