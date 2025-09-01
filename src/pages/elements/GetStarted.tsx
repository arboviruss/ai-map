import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const GetStarted = (props: { setInitiate: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [step, setStep] = useState<number>(0);
    const maxStep = 3; // Adjust based on the number of elements (e.g., h2, p, flex div)

    // Add a global click listener to advance steps on any screen click
    useEffect(() => {
        const handleClick = () => {
            if (step < maxStep) {
                setStep((prev) => prev + 1);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [step]);

    return (
        <motion.div
        // Uncomment if you want the outer container to animate on mount
        // initial={{ opacity: 0, y: -100 }}
        // animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: 100 }}
        className="flex w-full h-screen items-center justify-center relative"
        >
        <div className="get-started__container flex flex-col items-center justify-center gap-1 transition-all delay-150 duration-300 ease-in-out" >
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-w-md text-1xl font-semibold leading-tight lg:max-w-none lg:text-3xl transition-all delay-150 duration-300 ease-in-out"
            >
                Hi. My name is SARA
            </motion.span>
            {step >= 2 && (
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.2 }} // Slight delay for staggered effect
                className="max-w-md text-base text-textGray lg:max-w-none lg:text-lg"
            >
                let's start our journey together.
            </motion.p>
            )}
            {step >= 3 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.4 }} // Further delay for staggered effect
                className="flex flex-col items-center justify-center gap-4 mt-10 lg:flex-row select-none"
            >
                {/* Add your buttons or content here, e.g., a button to initiate the chat */}
                <Button onClick={() => props.setInitiate(true)}
                className="flex font-bold items-center justify-center align-center"
                >
                    <MessageCircle size={32} />
                    <span>START CHAT</span>
                </Button>
            </motion.div>
            )}
            {step < maxStep && (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-500 absolute bottom-13 left-0 right-0 text-center select-none font-bold"
            >
                Click Anywhere To Continue
            </motion.p>
            )}
        </div>
        </motion.div>
    );
};

export default GetStarted;