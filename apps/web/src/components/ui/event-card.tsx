"use client"

import { Calendar, MapPin } from "lucide-react"

interface EventCardProps {
  title?: string
  date?: string
  venue?: string
  description?: string
  imageUrl?: string | null // <-- FIX: Changed type to allow null
}

export function EventCard({
  title,
  date,
  venue,
  description,
  imageUrl,
}: EventCardProps) {
  return (
    <div
      className="h-full w-full max-w-sm bg-secondary rounded-xl p-6 text-left transition-transform duration-100 ease-linear hover:scale-[1.03] focus:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-ring group"
    >
      {/* Image Placeholder */}
      <div className="w-full h-48 mb-6 rounded-lg bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title || 'Event Image'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600/30 via-gray-700/30 to-gray-800/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white/40" />
            </div>
          </div>
        )}
      </div>

      {/* Event Title */}
      <h2 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-primary/90 transition-colors">
        {title}
      </h2>

      {/* Event Date */}
      <div className="flex items-center mb-3 text-muted-foreground">
        <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium">{date}</span>
      </div>

      {/* Venue */}
      <div className="flex items-center mb-4 text-muted-foreground">
        <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium">{venue}</span>
      </div>

      {/* Description */}
      <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">{description}</p>
    </div>
  )
}