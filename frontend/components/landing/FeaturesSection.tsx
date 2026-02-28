"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { FileEdit, MessageSquareHeart, Route } from "lucide-react";

const features = [
    {
        icon: FileEdit,
        title: "Post Tasks Easily",
        description: "Create detailed task listings with budgets and deadlines in seconds.",
        color: "text-blue-400",
        bg: "bg-blue-500/20"
    },
    {
        icon: MessageSquareHeart,
        title: "Request to Help",
        description: "Browse the feed and send help requests securely with just one click.",
        color: "text-rose-400",
        bg: "bg-rose-500/20"
    },
    {
        icon: Route,
        title: "Track Status",
        description: "Accept, reject, and monitor real-time request statuses seamlessly.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/20"
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-6 relative z-10 w-full max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Features</h2>
                <p className="text-slate-400 text-lg">Everything you need to manage your community tasks effortlessly.</p>
            </div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {features.map((feature, i) => (
                    <Card
                        key={i}
                        glass
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="flex flex-col items-center text-center p-8 transition-all duration-300"
                    >
                        <div className={`p-4 rounded-2xl mb-6 ${feature.bg}`}>
                            <feature.icon className={`w-8 h-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </Card>
                ))}
            </motion.div>
        </section>
    );
}
