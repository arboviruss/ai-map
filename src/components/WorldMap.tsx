import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import dynamic from 'next/dynamic'

// Default icon fix (Next.js has issues with Leaflet icons)
import 'leaflet/dist/leaflet.css'
import iconUrl from 'public/shelter.png'
import iconRetinaUrl from 'public/record.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'



const TifLayer = dynamic(() => import('./TifLayer'), { ssr: false })

const DefaultIcon = L.icon({
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
  iconSize: [20, 20],
  iconAnchor: [12, 41],
})

const IsolatedIcon = L.icon({
  iconUrl: iconRetinaUrl.src, // replace with your icon URL
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
  iconSize: [20, 20],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface WorldMapProps {
  locations?: Location[];
}

import schoolsData from '../../public/schools.json';
import isolatedData from '../../public/isolated_places_summary.json';


const WorldMap: React.FC<WorldMapProps> = ({ locations = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Dynamic import of Leaflet
    const initMap = async () => {
      try {
        let L = await import('leaflet');
        
        // Fix for default markers in Next.js - this is crucial!
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Wait a bit to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize map if it doesn't exist and DOM element is available
        if (!mapInstanceRef.current && mapRef.current) {
          console.log('Initializing map...');
          
          const map = L.map(mapRef.current, {
            center: [24.708705,91.69615390000001],
            zoom: 8,
            scrollWheelZoom: true,
            zoomControl: true
          });

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors',
            maxZoom: 18,
          }).addTo(map);

          mapInstanceRef.current = map;

          console.log('Map initialized successfully');
        }

        // Clear existing markers
        if (mapInstanceRef.current) {
          mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [locations]);

  return (
    <MapContainer
      center={[24.708705,91.69615390000001]}
      zoom={8}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution=' OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      

      {schoolsData.map((school: any) => (
        <Marker key={school.name} position={[school.lat, school.lng]}>
          <Popup>{school.name}</Popup>
        </Marker>
      ))}

      {isolatedData.map((isolate: any) => (
        <Marker key={isolate.name} position={[isolate.lat, isolate.lng]} icon={IsolatedIcon}>
          <Popup>{isolate.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorldMap;