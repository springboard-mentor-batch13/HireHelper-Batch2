"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Loader2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time?: string;
  image_url?: string | null;
  status: string;
  created_at: string;
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);

        const token =
          sessionStorage.getItem("token") || localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/tasks/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch my tasks");
        }

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {/* ❌ No Data */}
      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-md border border-gray-200">
          No tasks created yet.
        </div>
      )}

      {/* ✅ Task Grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            return (
              <div
                key={task.id}
                className="overflow-hidden rounded-xl bg-card shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* 🖼 Image */}
                <div className="h-44 overflow-hidden bg-gray-100 border-b">
                  <img
                    src={
                      task.image_url && task.image_url !== "null"
                        ? `http://127.0.0.1:8000/${task.image_url.replace(/\\/g, "/")}`
                        : "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={task.title}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 border-b pb-2">
                    {task.title}
                  </h3>

                  <p className="mb-3 mt-2 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {task.description}
                  </p>

                  <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{task.location}</span>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>
                      {new Date(task.start_time).toLocaleString()}
                      {task.end_time &&
                        ` - ${new Date(task.end_time).toLocaleTimeString()}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${task.status === "open"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {task.status.toUpperCase()}
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
