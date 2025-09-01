import "@/styles/globals.css";
import 'leaflet/dist/leaflet.css';
import type { AppProps } from "next/app";
import WorldMap from '../components/WorldMap'

import { Nunito } from "next/font/google";

import { Bounce, ToastContainer, toast } from 'react-toastify';

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-nunito",
})

export default function App({ Component, pageProps }: AppProps) {
    return <>
        <Component className={`${nunito.className}`} {...pageProps} />
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
            
            
        />

        
    </>;
}
