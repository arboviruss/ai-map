import React, { useState, useEffect, useRef } from 'react';
//import axios from 'axios';

import { Map, Map as MapComponent } from '@vis.gl/react-maplibre';
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // See notes below
import "mapbox-gl-infobox/styles.css";

import { motion, AnimatePresence } from 'framer-motion';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendHorizontal, Map as MapIcon, Moon } from 'lucide-react';
import { useTheme, ThemeProvider } from 'next-themes';
import { Badge } from '@/components/ui/badge';

import { Suspense } from "react";

import Welcome, { WelcomeButtons } from './chats/Welcome';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from 'react-toastify';
import { bbox } from '@turf/turf';

import { MDXRemote } from "next-mdx-remote-client/rsc";

const components = {
    // @ts-ignore
    wrapper: ({ children }) => <div className="mdx-wrapper">{children}</div>,
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    actions?: Action[] | undefined | null;
}

interface Action {
    id?: string;
    type?: 'map' | 'chat';
    function?: 'toggle' | 'show' | 'hide';
}

const Chat: React.FC = () => {
    const { setTheme, theme } = useTheme()
    const toggleTheme = () => {
        setTheme("dark")
    }

    const [messages, setMessages] = useState<Message[]>([
        { id: `${Date.now()}-${Math.random()}`, text: '[WELCOME]', sender: 'ai' },
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showMap, setShowMap] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<{ getMap: () => MapLibreMap }>(null);

    useEffect(() => {
        

    }, [])

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const newUserMessage: Message = { id: `${Date.now()}-${Math.random()}`, text: input, sender: 'user' };
        setMessages((prevMessages) => [newUserMessage, ...prevMessages]); // Add new message to the beginning
        setInput('');
        setIsLoading(true);
        
        const mainMap = "main-map";
        const waterBody = "water_body";
        
        if(mapRef.current) {
            let map = mapRef.current?.getMap()
            console.log(map)

            const res = await fetch('/api/map/data')
            console.log(res)

            const { main_map, water_body, geojson, message } = await res.json();

            map.addSource(mainMap, {
                type: "raster",
                tiles: [main_map],
                tileSize: 256,
            });
            map.addSource(waterBody, {
                type: "raster",
                tiles: [water_body],
                tileSize: 256,
            });
            

            map.addLayer({
                type: "raster",
                source: mainMap,
                id: mainMap,
                minzoom: 0,
                maxzoom: 20,
            });
            map.addLayer({
                type: "raster",
                source: waterBody,
                id: waterBody,
                minzoom: 0,
                maxzoom: 20,
            });

            // Then zoom it to the map layer
            // Change geojson to bbox
            //const bounds = bbox(geojson);
            // @ts-ignore
            //map.fitBounds(bounds);
        }


        try {

            const req = await fetch('/api/chat/completion');
            const aiMessage: Message = await req.json();

            // const aiMessage: Message = await (new Promise((resolve) => {
            //     setTimeout(() => {

            //         let actions: Action[] = [];

            //         if(messages.length > 5) actions.push({
            //             id: `${Date.now()}-${Math.random()}`,
            //             type: 'map',
            //             function: 'show',
            //         })

            //         resolve(
            //             { 
            //                 id: `${Date.now()}-${Math.random()}`, 
            //                 text: "response.data.reply: Test Response muhahaha", 
            //                 sender: 'ai',
            //                 actions
            //             }
            //         );
            //     }, 2000);
            // }));


        
            setMessages((prevMessages) => [aiMessage, ...prevMessages]); // Add new message to the beginning

            console.log('AI Message:', aiMessage)
            if(aiMessage.actions) {
                handleFunctions(aiMessage.actions)
            }

            // @ts-ignore
            console.log(inputRef.current?.focus())

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = { id: `${Date.now()}-${Math.random()}`, text: 'Sorry, something went wrong.', sender: 'ai' };
            setMessages((prevMessages) => [errorMessage, ...prevMessages]); // Add new message to the beginning
        } finally {
            setIsLoading(false);
        }
    };

    const handleFunctions = (actions: Action[]) => {
        if(actions.length > 0) {
            for(var action of actions) {
                if(action.type === 'map') {
                    if(action.function === 'show') {
                        setShowMap(true)
                        toast("AI Action: Opened Map")
                    } else if(action.function === 'hide') {
                        setShowMap(false)
                    } else if(action.function === 'toggle') {
                        setShowMap(!showMap)
                    }
                }
            }
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const isUser = (msg: Message) => {
        return msg.sender === 'user';
    }

    return (
        <div className='flex flex-row overflow-x-hidden'>            
        <AnimatePresence mode='wait'>
        <motion.div 
            animate={{ width: showMap ? '70%' : '100%' }} // Animate width based on showMap
            transition={{ duration: 0.10, ease: 'easeInOut' }}
            className="chatbox flex flex-col h-screen p-4 w-full relative border-1 border-gray-700"
        >
        <div className='topbuttons flex flex-col gap-3 justify-between items-center absolute top-0 right-0 p-10 z-99'>
            <Button
                onClick={() => {toggleTheme()}}
            >
                <Moon />
            </Button>
            <Button
                // variant={"secondary"}
                onClick={() => {
                    setShowMap(!showMap)
                }}
            >
            <MapIcon />
            </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse relative"
        style={{ overflowX: 'hidden' }}> {/* Reverse the column direction */}
            <AnimatePresence>
            {messages.map((msg, index) => (
            <motion.div
                initial={{ opacity: 0, x: isUser(msg) ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isUser(msg) ? 100 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                key={msg.id} 
                className={`mb-4 flex w-full ${isUser(msg) ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`bubble max-w-2xl text-wrap px-4 py-2 rounded-lg ${isUser(msg) ? 'bg-gray-800 text-white' : 'bg-transparent border-1 border-gray-700'}`}>

                    <Suspense>
                        <MDXRemote
                            source={msg.text}
                            components={components}
                        />
                    </Suspense>
                    
                    {msg.text == "[WELCOME]" ? 
                        <Welcome />
                    : "" }
                    
                    <br />
                    {msg.text == "[WELCOME]" ? <WelcomeButtons /> : <></>}
                </div>
            </motion.div>
            ))}
            </AnimatePresence>

            <AnimatePresence>
            {isLoading && (
                <motion.div 
                initial={{ opacity: 0, y: 100}}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 right-0 flex justify-center items-center">
                    <span className="px-4 py-2 rounded-lg bg-gray-300 text-black">
                    Typing...
                    </span>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        <div className="p-4 bg-gray flex items-center">
            <Input
                type="text"
                ref={inputRef}
                className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 outline-none border-none"
                value={input}
                onChange={handleInputChange}
                onKeyUp={handleKeyPress}
                placeholder="Type a message..."
                // disabled={isLoading}
            />
            <Button
                variant={"outline"}
                onClick={handleSendMessage}
                disabled={isLoading || input.trim() === ''}
            >
            <SendHorizontal />
            </Button>
        </div>
        </motion.div>
        {/* <AnimatePresence> */}
        {showMap && (
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='relative select-none'
            >
                <div className='mapInfo absolute top-0 left-0 z-99 p-4'>
                    <Badge variant={'secondary'}>
                        Sylhet, Bangladesh
                    </Badge>
                </div>
                <Map
                    // @ts-ignore
                    ref={mapRef}
                    initialViewState={{
                        longitude: 91.85856,
                        latitude: 24.8951,
                        zoom: 11,
                    }}
                    style={{width: '800px'}}
                    mapStyle="https://demotiles.maplibre.org/style.json"
                />
            </motion.div>
        )}
        {/* </AnimatePresence> */}
        </AnimatePresence>
        </div>
    );
};

export default Chat;
