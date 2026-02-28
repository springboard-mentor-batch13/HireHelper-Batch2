"use client";

import { Handshake, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#050811] text-slate-400 py-16 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md">
                            <Handshake className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Hire-a-Helper</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        The community-driven platform for connecting people who need help with those ready to lend a hand.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-indigo-600 hover:text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-indigo-600 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-indigo-600 hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Links Navigation */}
                <div>
                    <h4 className="text-white font-semibold mb-6 tracking-wide">Product</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                        <li><Link href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-6 tracking-wide">Company</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-6 tracking-wide">Legal</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Hire-a-Helper. All rights reserved.
            </div>
        </footer>
    );
}
