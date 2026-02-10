'use client';

import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, User } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="min-h-screen py-20 relative z-10 flex items-center justify-center px-4">
            <div className="max-w-5xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="border border-green-500/30 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.1)]"
                >
                    {/* Terminal Header */}
                    <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="text-green-500/50 text-xs font-mono">user_profile.exe</div>
                    </div>

                    <div className="p-6 md:p-10 grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-mono text-green-500 mb-6 flex items-center gap-2">
                                <Terminal className="w-6 h-6" />
                                &lt;AboutMe /&gt;
                            </h2>
                            <div className="font-mono text-gray-300 space-y-4">
                                <p>
                                    <span className="text-green-500 mr-2">root@matrix:~$</span>
                                    Loading personal data...
                                </p>
                                <p className="leading-relaxed pl-4 border-l-2 border-green-500/30">
                                    I am Jayathu Shehan Dewmina, a passionate developer navigating through the digital realm.
                                    Just like in the Matrix, I see the code behind the reality of the web.
                                </p>
                                <p className="leading-relaxed pl-4 border-l-2 border-green-500/30">
                                    My mission is to architect robust systems and crafting immersive user experiences.
                                    I blend creative design with logical perfection to build applications that don&apos;t just work, but exist.
                                </p>
                                <div className="pt-4 flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-green-400">
                                        <Code className="w-4 h-4" /> Full Stack
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-green-400">
                                        <Cpu className="w-4 h-4" /> System Architecture
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Experience", value: "Loading...", icon: User },
                                { label: "Projects", value: "Accessing...", icon: Code },
                                { label: "Status", value: "Online", icon: Terminal },
                                { label: "Location", value: "Sri Lanka", icon: Cpu }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-green-500/5 border border-green-500/20 p-4 rounded flex flex-col items-center justify-center text-center hover:bg-green-500/10 transition-colors cursor-pointer group"
                                >
                                    <item.icon className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-gray-400 text-sm font-mono">{item.label}</span>
                                    <span className="text-green-400 font-bold font-mono mt-1">{item.value}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
