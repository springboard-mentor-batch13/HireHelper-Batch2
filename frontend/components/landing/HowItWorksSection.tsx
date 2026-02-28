"use client";

import { motion } from "framer-motion";
import { CopyPlus, BellRing, Handshake } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            icon: CopyPlus,
            title: "1. Create a Task",
            desc: "Describe what you need help with in simple terms and post it to the community."
        },
        {
            icon: BellRing,
            title: "2. Receive Requests",
            desc: "Helpers in your area will see your task and send requests to assist you."
        },
        {
            icon: Handshake,
            title: "3. Accept & Collaborate",
            desc: "Review the requests, accept the one you like, and get things done faster."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-[#0a0f1c] relative border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-slate-400 text-lg">Three simple steps to getting the help you need.</p>
                </div>

                <div className="relative">
                    {/* Main Connecting Line for Desktop */}
                    <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1 bg-white/10 -z-10 rounded-full">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            viewport={{ once: true }}
                            className="h-full bg-indigo-500 rounded-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.3, duration: 0.6 }}
                                className="flex flex-col items-center text-center relative"
                            >
                                {/* Connecting Line for Mobile */}
                                {idx !== steps.length - 1 && (
                                    <div className="md:hidden absolute top-[88px] bottom-[-48px] left-1/2 w-0.5 bg-white/10 -z-10 -translate-x-1/2">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: "100%" }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                            className="w-full bg-indigo-500"
                                        />
                                    </div>
                                )}

                                <div className="w-24 h-24 rounded-full bg-[#111827] shadow-[0_0_30px_rgba(79,70,229,0.2)] flex items-center justify-center border-4 border-[#0a0f1c] mb-8 z-10">
                                    <step.icon className="w-10 h-10 text-indigo-600" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 max-w-sm">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
