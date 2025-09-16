import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet'
import L from 'leaflet'
import dynamic from 'next/dynamic'

// Default icon fix (Next.js has issues with Leaflet icons)
import 'leaflet/dist/leaflet.css'
import iconUrl from 'public/shelter.png'
import iconRetinaUrl from 'public/record.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'


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

    const [waterLayer, setWaterLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [roadLayer, setRoadLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [floodedRoadsLayer, setFloodedRoadsLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    // run only once
    useEffect(() => {

        const initMap = async() => {
            const res = await fetch('/api/map/data')
            const json = await res.json()
            console.log(json)

            setWaterLayer({
                url: json.water_body,
                attribution: "Google Earth Engine Water Layer"
            })

            setRoadLayer({
                url: json.roads_layer,
                attribution: "Google Earth Engine Roads Layer"
            })

            setFloodedRoadsLayer({
                url: json.flooded_raods,
                attribution: "Google Earth Engine Flooded Roads Layer"
            })
            
        }
        initMap()
    }, [])
    
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

        
        <LayersControl position='topright'>
            <LayersControl.Overlay checked name='Water Body Layer'>
                <TileLayer
                    url={waterLayer.url}
                    attribution={waterLayer.attribution}
                    opacity={0.5}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name='Isolated Places Layer'>
                <LayerGroup>
                    {isolatedData.map((isolate: any) => (
                        <Marker key={isolate.name} position={[isolate.lat, isolate.lng]} icon={IsolatedIcon}>
                        <Popup>{isolate.name}</Popup>
                        </Marker>
                    ))}
                </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name='Safe Locations Layer'>
                <LayerGroup>
                    {schoolsData.map((school: any) => (
                        <Marker key={school.name} position={[school.lat, school.lng]}>
                        <Popup>{school.name}</Popup>
                        </Marker>
                    ))}
                </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name='Roads Layer'>
                <TileLayer
                    url={roadLayer.url}
                    attribution={roadLayer.attribution}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name='Flooded Roads Layer'>
                <TileLayer
                    url={floodedRoadsLayer.url}
                    attribution={floodedRoadsLayer.attribution}
                />
            </LayersControl.Overlay>
        </LayersControl>
        
        </MapContainer>
    );
    
};


export default WorldMap;