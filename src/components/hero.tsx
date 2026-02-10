'use client';

import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="h-screen flex flex-col justify-center items-center text-center relative z-10 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="backdrop-blur-sm bg-black/30 p-8 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(0,255,0,0.3)]"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-green-500 font-mono text-sm md:text-base mb-2 tracking-widest"
                >
                    SYSTEM_INITIALIZED
                </motion.h2>

                <h1 className="text-4xl md:text-6xl font-bold text-white font-mono mb-4 glitch-text relative">
                    <span className="relative inline-block">
                        Jayathu Shehan Dewmina
                        <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-500 opacity-70 animate-pulse">Jayathu Shehan Dewmina</span>
                    </span>
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <p className="text-green-400 font-mono text-lg md:text-xl typewriter">
                        Full Stack Developer | Tech Enthusiast
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-8 flex gap-4 justify-center"
                >
                    <a
                        href="#contact"
                        className="px-6 py-2 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-all duration-300 rounded hover:shadow-[0_0_10px_#00ff00]"
                    >
                        INITIATE_CONTACT
                    </a>
                    <a
                        href="#about"
                        className="px-6 py-2 border border-white text-white font-mono hover:bg-white hover:text-black transition-all duration-300 rounded"
                    >
                        VIEW_DATA
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 text-green-500"
            >
                <span className="text-sm font-mono opacity-70">SCROLL TO DECRYPT</span>
                <div className="w-px h-12 bg-gradient-to-b from-green-500 to-transparent mx-auto mt-2"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
