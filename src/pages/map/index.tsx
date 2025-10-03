import dynamic from 'next/dynamic';
import Head from 'next/head';

const WorldMap = dynamic(() => import('../../components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center animate-pulse">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <>
      <Head>
        <title>Leaflet Map Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="fixed inset-0 z-0">
        <WorldMap />
      </div>
    </>
  ); 
}