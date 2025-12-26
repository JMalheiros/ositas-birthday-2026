import { MapPin } from 'lucide-react';

interface PartyMapProps {
  locationName?: string;
  embedUrl?: string;
  googleMapsUrl?: string;
}

export const PartyMap = ({
  embedUrl = import.meta.env.VITE_MAP_EMBED_URL,
  googleMapsUrl = import.meta.env.VITE_MAP_DIRECTIONS_URL
}: PartyMapProps) => {
  return (
    <div className="w-full bg-secondary p-4 space-y-4 rounded-b-lg md:rounded-r-lg md:rounded-l-none">
      <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Local da festa da Osita`}
        />
      </div>
      
      <div className="flex justify-center">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary inline-flex items-center gap-2 px-6 py-3 text-black font-semibold rounded-lg shadow-md hover:bg-gray-900 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          <MapPin className="w-5 h-5" />
          <span>Ver no Google Maps</span>
        </a>
      </div>
    </div>
  );
}
