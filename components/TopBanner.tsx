"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Configuration for easy admin updates
const BANNER_CONFIG = {
    text: "아마존 셀러센트럴 튜토리얼 오픈!",
    link: "/education",
    backgroundColor: "bg-blue-600", // Vibrant blue like the example
    height: "h-10", // 40px
};

export default function TopBanner() {
    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[60] ${BANNER_CONFIG.height} ${BANNER_CONFIG.backgroundColor} text-white flex items-center overflow-hidden shadow-sm`}
        >
            <Link href={BANNER_CONFIG.link} className="w-full h-full flex items-center relative group cursor-pointer">
                {/* Text Scroller Container */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    {/* Fast Marquee Effect */}
                    <div className="flex whitespace-nowrap min-w-full">
                        <motion.div
                            className="flex"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 40,
                                ease: "linear"
                            }}
                        >
                            {/* Repeat content enough times to fill screen and loop smoothly */}
                            {[...Array(10)].map((_, i) => (
                                <span key={i} className="flex items-center mx-8 font-bold text-sm tracking-wide">
                                    {BANNER_CONFIG.text}
                                    <ChevronRight size={14} className="ml-1 opacity-70" />
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
