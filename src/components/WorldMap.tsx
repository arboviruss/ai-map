'use client';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup, useMapEvents } from 'react-leaflet'
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
import { Layers } from 'lucide-react';
import useLayerStore from '@/stores/layerStore';
import useLocationStore from '@/stores/locationStore';
import useZoomStore from '@/stores/zoomStore';
import { useMapStore } from '@/stores/mapStore';


const MapEvents = () => {
    const { location, setLocation } = useLocationStore();
    const { zoom, setZoom } = useZoomStore();

    const setMap = useMapStore((state) => state.setMap);

    useMapEvents({
      loading(e) {
        const map = e.target;
        setLocation(map.getCenter().lat, map.getCenter().lng);
        setZoom(map.getZoom());
        setMap(map);
        console.log(`Loading map-->`)
      },
      load(e) {
        const map = e.target;
        setLocation(map.getCenter().lat, map.getCenter().lng);
        setZoom(map.getZoom());
        setMap(map);
        console.log(`Setting map-->`)
      },
      moveend(e) {
        const map = e.target;
        setLocation(map.getCenter().lat, map.getCenter().lng);
        setZoom(map.getZoom());
        setMap(map);
        console.log(`Moving map-->`)
      },
      click(e) {
        const map = e.target;
        setMap(map);
        console.log(`Clicked map-->`)
      },
      update(e) {
        const map = e.target;
        setLocation(map.getCenter().lat, map.getCenter().lng);
        setZoom(map.getZoom());
        setMap(map);
        console.log(`Updated map-->`)
      }
    });
  
    return null;
};

const WorldMap: React.FC<WorldMapProps> = ({ locations = [] }) => {

    const { layers, toggleLayer } = useLayerStore();
    const { location } = useLocationStore();
    const { zoom } = useZoomStore();

    const setMap = useMapStore((state) => state.setMap);

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

    // RIVER LAYERS
    const [bdBorderLayer, setBDBorderLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [riverWaterLayer, setRiverWaterLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [smallRiversLayer, setSmallRiversLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [mediumRiversLayer, setMediumRiversLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [majorRiversLayer, setMajorRiversLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    const [permanentRiversLayer, setPermanentRiversLayer] = useState({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: ''
    });

    // run only once
    useEffect(() => {

        const initWaterMap = async() => {
            const res = await fetch('/api/map/rivers')
            const json = await res.json()
            console.log(json)

            setBDBorderLayer({
                url: json.bd_border,
                attribution: "Google Earth Engine Border Layer"
            })

            setRiverWaterLayer({
                url: json.water_layer,
                attribution: "Google Earth Engine River Water Layer"
            })

            setSmallRiversLayer({
                url: json.small_water_rivers,
                attribution: "Google Earth Engine Small Rivers Layer"
            })

            setMediumRiversLayer({
                url: json.medium_water_rivers,
                attribution: "Google Earth Engine Medium Rivers Layer"
            })

            setMajorRiversLayer({
                url: json.major_water_rivers,
                attribution: "Google Earth Engine Major Rivers Layer"
            })

            setPermanentRiversLayer({
                url: json.permanent_water_rivers,
                attribution: "Google Earth Engine Permanent Rivers Layer"
            })
        }

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
        initWaterMap()
        initMap()
    }, [])
    
    return (
        <MapContainer
            center={location}
            zoom={zoom}
            scrollWheelZoom={true}
            className="w-full h-full"
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayersControl position='topright'>
            <LayersControl.Overlay checked name='Bangladesh Border Layer'>
                <TileLayer
                    url={bdBorderLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name='Small Rivers & Tributaries'>
                <TileLayer
                    url={smallRiversLayer.url}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name='Medium Rivers'>
                <TileLayer
                    url={mediumRiversLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name='Major Rivers'>
                <TileLayer
                    url={majorRiversLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name='Permanent Rivers'>
                <TileLayer
                    url={permanentRiversLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>


            {/* SYLHET LAYERS */}
            <LayersControl.Overlay checked={layers.flood_water_body_layer} name='Water Body Layer'>
                <TileLayer
                    url={waterLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={layers.isolated_places_layer} name='Isolated Places Layer'>
                <LayerGroup>
                    {isolatedData.map((isolate: any) => (
                        <Marker key={isolate.name} position={[isolate.lat, isolate.lng]} icon={IsolatedIcon}>
                        <Popup>{isolate.name}</Popup>
                        </Marker>
                    ))}
                </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={layers.safe_locations_layer} name='Safe Locations Layer'>
                <LayerGroup>
                    {schoolsData.map((school: any) => (
                        <Marker key={Math.random()} position={[school.lat, school.lng]}>
                            <Popup key={Math.random()} >{school.name}</Popup>
                        </Marker>
                    ))}
                </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={layers.roads_layer} name='Roads Layer'>
                <TileLayer
                    url={roadLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={layers.flooded_roads_layer} name='Flooded Roads Layer'>
                <TileLayer
                    url={floodedRoadsLayer.url}
                    opacity={0.5}
                />
            </LayersControl.Overlay>
        </LayersControl>
        
        <MapEvents />
        </MapContainer>
    );
    
};


export default WorldMap;