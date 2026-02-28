"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Send, ShieldCheck, Zap } from "lucide-react";
import { Card } from "../ui/Card";

export function WhyChooseUsSection() {
    const points = [
        { icon: Zap, text: "Simple and fast onboarding" },
        { icon: LayoutDashboard, text: "Real-time request tracking" },
        { icon: Send, text: "User-friendly interface" },
        { icon: ShieldCheck, text: "Secure and reliable" },
    ];

    return (
        <section className="py-24 px-6 overflow-hidden max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Why Choose <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Hire-a-Helper?</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                        We built our platform from the ground up to ensure that asking for help and offering your
                        services is as frictionless as possible. Experience a community-driven ecosystem wrapped in a beautiful UI.
                    </p>

                    <ul className="space-y-5">
                        {points.map((point, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="flex items-center gap-4 text-slate-700 text-lg font-medium"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <point.icon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-slate-200">{point.text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right: Floating Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative perspective-[1000px]"
                >
                    {/* Decorative Blooms */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/20 blur-[100px] rounded-full -z-10" />

                    {/* Floating Dashboard Card */}
                    <motion.div
                        animate={{
                            y: [-10, 10, -10],
                            rotateZ: [-1, 1, -1]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Card className="w-full bg-slate-900 border-slate-700 shadow-2xl shadow-indigo-500/20 p-2 rounded-3xl overflow-hidden glass">

                            {/* Fake Window Controls */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>

                            {/* Fake Dashboard Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
                                    <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="h-24 bg-slate-800 rounded-xl" />
                                    <div className="h-24 bg-slate-800 rounded-xl" />
                                </div>
                                <div className="space-y-3">
                                    <div className="h-16 w-full bg-slate-800 rounded-xl flex items-center px-4 justify-between">
                                        <div className="h-4 w-1/3 bg-slate-700 rounded" />
                                        <div className="h-6 w-16 bg-emerald-900/50 rounded-full border border-emerald-500/50" />
                                    </div>
                                    <div className="h-16 w-full bg-slate-800 rounded-xl flex items-center px-4 justify-between">
                                        <div className="h-4 w-1/2 bg-slate-700 rounded" />
                                        <div className="h-6 w-16 bg-amber-900/50 rounded-full border border-amber-500/50" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
