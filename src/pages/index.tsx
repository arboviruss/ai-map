'use client'

import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

import Start from "./elements/Start";
import Chat from "./elements/Chat";
import GetStarted from "./elements/GetStarted";

export default function Home() {

    const [initiate, setInitiate] = React.useState(false);
    const [started, setStarted] = React.useState(false);

    return (
        <AnimatePresence mode="wait">
          {initiate ? (
            <motion.div
                key="chat" 
                initial={{ opacity: 0,  }}
                animate={{ opacity: 1, }}
                exit={{ opacity: 0, scale : 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <Chat />
            </motion.div>
          ) : (
              <>
                <AnimatePresence mode="wait">
                <div
                    className="relative"
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center animate-pan opacity-transition"
                        style={{
                            backgroundImage: `url('https://cdn.buttercms.com/Tf6GCwKtQr2tvRZ86m4F')`,
                            backgroundSize: '150%',
                            opacity: started ? 0 : 0.2,
                        }}
                    ></div>
                    <div className="relative z-10">
                        {started ? (
                            <motion.div
                                key="getstarted" 
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                            >
                                <GetStarted setInitiate={setInitiate} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="start" 
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                            >
                                <div>
                                    <Start setStarted={setStarted} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
                </AnimatePresence>
            </>
          )}
        </AnimatePresence>
    );
    
}
