"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RequestButtonProps {
    taskId: string;
    creatorId: string;
    currentUserId: string | null;
    initialStatus?: "idle" | "requested";
}

export default function RequestButton({ taskId, creatorId, currentUserId, initialStatus = "idle" }: RequestButtonProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "requested" | "error">(initialStatus);
    const [errorMessage, setErrorMessage] = useState("");

    // Prevent requesting own task
    if (creatorId && currentUserId && creatorId === currentUserId) {
        return null;
    }

    const handleRequest = async () => {
        setStatus("loading");
        setErrorMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://127.0.0.1:8000/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ taskId })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || data.detail || "Failed to submit request.");
            }

            setStatus("requested");
        } catch (err: any) {
            setErrorMessage(err.message || "Something went wrong.");
            setStatus("error");

            // Reset error state after 3 seconds
            setTimeout(() => {
                setStatus("idle");
                setErrorMessage("");
            }, 3000);
        }
    };

    if (status === "requested") {
        return (
            <button
                disabled
                className="w-full py-2 bg-gray-100 text-gray-500 font-medium rounded-xl cursor-not-allowed transition-colors border border-gray-200"
            >
                Requested
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            <button
                onClick={handleRequest}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed h-10"
            >
                {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Request Help"
                )}
            </button>
            {status === "error" && (
                <span className="text-red-500 text-xs text-center">{errorMessage}</span>
            )}
        </div>
    );
}
