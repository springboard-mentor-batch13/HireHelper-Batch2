"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-2xl p-6",
                    glass
                        ? "bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                        : "bg-white shadow-sm border border-slate-100",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";
