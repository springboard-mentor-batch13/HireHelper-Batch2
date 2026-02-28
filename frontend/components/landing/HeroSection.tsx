"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowRight, HelpingHand } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden mx-auto max-w-7xl px-6">

            {/* Background Animated Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl -z-10 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[120px] opacity-70"
                />
                <motion.div
                    animate={{
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium text-slate-300 mb-8 shadow-2xl"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    Simplified Community Help
                </motion.div>

                {/* Headlines */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mb-6 leading-tight"
                >
                    Find Help. Offer Help. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                        Get Things Done.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10"
                >
                    A seamless platform connecting people who need assistance with those ready to lend a hand. Post a task or pick one up today.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <Link href="/register" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto gap-2 group">
                            Get Started Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="#features" className="w-full sm:w-auto">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                            Explore Features
                        </Button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
