"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Handshake } from "lucide-react";

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/10 shadow-sm"
        >
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                    <Handshake className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                    Hire-a-Helper
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
                <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Features
                </Link>
                <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    How it Works
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Log in
                </Link>
                <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)]"
                >
                    Sign up free
                </Link>
            </div>
        </motion.header>
    );
}
