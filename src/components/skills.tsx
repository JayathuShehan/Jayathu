'use client';

import { motion } from 'framer-motion';

const skills = [
    { name: 'Next.js', level: 90 },
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'Database Design', level: 75 },
];

const Skills = () => {
    return (
        <section className="py-20 relative z-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-mono text-green-500 mb-12 text-center glitch-text" data-text="<SystemCapabilities />">
                    &lt;SystemCapabilities /&gt;
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-black/50 border border-green-500/20 p-4 rounded hover:border-green-500/50 transition-colors"
                        >
                            <div className="flex justify-between mb-2 font-mono text-sm">
                                <span className="text-white">{skill.name}</span>
                                <span className="text-green-500">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-green-500 shadow-[0_0_10px_#0f0]"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
