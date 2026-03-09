"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // UI state
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Load task data
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 404) throw new Error("Task not found");
                    throw new Error("Failed to load task details");
                }

                const data = await res.json();

                setTitle(data.title);
                setDescription(data.description);
                setLocation(data.location);

                if (data.start_time) {
                    const st = new Date(data.start_time);
                    setStartDate(st.toISOString().split("T")[0]);
                    setStartTime(st.toTimeString().slice(0, 5));
                }

                if (data.end_time) {
                    const et = new Date(data.end_time);
                    setEndDate(et.toISOString().split("T")[0]);
                    setEndTime(et.toTimeString().slice(0, 5));
                }

                if (data.image_url && data.image_url !== "null") {
                    setImagePreview(`http://127.0.0.1:8000/${data.image_url.replace(/\\/g, "/")}`);
                }

            } catch (err: any) {
                setError(err.message || "Failed to load task.");
            } finally {
                setIsPageLoading(false);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!startDate || !startTime) {
            setError("Start date and start time are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("location", location);
            formData.append("start_time", `${startDate}T${startTime}`);

            if (endDate && endTime) {
                formData.append("end_time", `${endDate}T${endTime}`);
            } else {
                formData.append("end_time", ""); // Allows backend to clear the time if supported
            }

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                if (Array.isArray(data.detail)) {
                    throw new Error(data.detail.map((d: any) => d.msg).join(", "));
                }
                throw new Error(data.detail || "Failed to update task");
            }

            router.push("/dashboard/my-tasks");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Task</h2>

                {/* Error Banner */}
                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Task Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Enter task title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Describe your task"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Enter location"
                        />
                    </div>

                    {/* Start Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded-lg p-3 text-gray-900 bg-white [color-scheme:light]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border rounded-lg p-3 text-gray-900 bg-white [color-scheme:light]"
                            />
                        </div>
                    </div>

                    {/* End Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                End Date <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded-lg p-3 text-gray-900 bg-white [color-scheme:light]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                End Time <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border rounded-lg p-3 text-gray-900 bg-white [color-scheme:light]"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Task Image <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <label htmlFor="fileUpload" className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="fileUpload"
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mx-auto h-40 object-contain"
                                />
                            ) : (
                                <p className="text-gray-500">Click to upload or drag & drop new image to replace</p>
                            )}
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
