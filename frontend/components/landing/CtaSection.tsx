"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaSection() {
    return (
        <section className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 md:p-20 text-center shadow-2xl glass border border-slate-700/50"
            >
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Join thousands of users who are already helping each other out and getting tasks done securely and efficiently.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto relative group overflow-hidden bg-white text-slate-900 hover:text-white hover:bg-transparent border-2 border-transparent hover:border-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-none">
                                <span className="relative z-10 flex items-center gap-2 font-bold">
                                    Create an Account
                                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                </span>
                            </Button>
                        </Link>

                        <Link href="/dashboard/feed" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto border-indigo-500/50 text-indigo-100 hover:bg-indigo-500/10 hover:border-indigo-400">
                                View Tasks Layout
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
