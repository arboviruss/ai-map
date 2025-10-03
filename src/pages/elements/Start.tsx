import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { NotebookText } from "lucide-react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Start(props: { setStarted: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
    <div
        className={`w-full ${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
        <main className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className="main w-full flex flex-col gap-4 items-center justify-center ">
                <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left max-w-2xl leading-tight">
                    sarEye
                </h1>
                <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
                    <li className="tracking-[-.01em]">
                        Visualize and explore global SAR data with ease.
                    </li>
                </ol>
            </div>
            <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
                <a
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                    href="#"
                    onClick={() => {
                        props.setStarted(true);
                    }}
                >
                    {/* <Image
                        className="dark:invert"
                        src="/vercel.svg"
                        alt="Vercel logomark"
                        width={20}
                        height={20}
                    /> */}
                    GET STARTED
                </a>
                <a
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                    href="/map"
                >
                    MAP
                </a>
            </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                >
                    <NotebookText size={16}/>
                    Read the Paper
                </a>
        </footer>
    </div>
    )
}