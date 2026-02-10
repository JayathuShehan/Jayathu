'use client';

import { motion } from 'framer-motion';
import { Mail, Instagram, Facebook, Linkedin, Github, Twitter, MessageCircle } from 'lucide-react';

const contactDetails = [
    { icon: Mail, label: 'Email', value: 'jayathushehan@gmail.com', href: 'mailto:jayathushehan@gmail.com' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+94 70 310 8994', href: 'https://wa.me/94703108994' },
    { icon: Instagram, label: 'Instagram', value: '@s_h_e_h_a_n_.dew', href: 'https://www.instagram.com/s_h_e_h_a_n_.dew/' },
    { icon: Facebook, label: 'Facebook', value: 'Jayathu Shehan', href: 'https://www.facebook.com/jayathu.shehan' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Jayathu Shehan', href: 'https://www.linkedin.com/in/jayathu-shehan-516752249/' },
    { icon: Github, label: 'GitHub', value: 'JayathuShehan', href: 'https://github.com/JayathuShehan' },
    { icon: Twitter, label: 'X (Twitter)', value: '@s89736', href: 'https://x.com/s89736' },
];

const Contact = () => {
    return (
        <section id="contact" className="py-20 relative z-10 px-4 min-h-screen flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                <h2 className="text-3xl font-mono text-green-500 mb-12 text-center glitch-text" data-text="<InitiateUplink />">
                    &lt;InitiateUplink /&gt;
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contactDetails.map((contact, index) => (
                        <motion.a
                            key={index}
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-black/60 border border-green-500/30 p-6 rounded hover:bg-green-500/10 hover:border-green-500 hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300 group flex items-center gap-4"
                        >
                            <div className="p-3 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                                <contact.icon className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">{contact.label}</p>
                                <p className="text-white font-mono text-sm truncate group-hover:text-green-400 transition-colors">{contact.value}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <footer className="mt-20 text-center border-t border-green-500/20 pt-8">
                    <p className="text-gray-500 font-mono text-sm">
                        © {new Date().getFullYear()} Jayathu Shehan Dewmina. All rights reserved.
                    </p>
                    <p className="text-green-500/30 text-xs mt-2 font-mono">
                        SYSTEM_ID: JAYATHU_V1.0.0
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default Contact;
