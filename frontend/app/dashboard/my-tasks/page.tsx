"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Loader2, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

const generatePlaceholder = (title: string) => {
  const hash = title.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash) % 360;
  const bgColor = `hsl(${hue}, 80%, 85%)`;
  const textColor = `hsl(${hue}, 80%, 25%)`;

  const cleanTitle = title.replace(/['"<>]/g, ""); // strip characters for safe injection
  const displayTitle = cleanTitle.length > 20 ? cleanTitle.substring(0, 20) + "..." : cleanTitle;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect fill='${bgColor}' width='600' height='400'/><text fill='${textColor}' font-family='sans-serif' font-weight='bold' font-size='32' x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>${displayTitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      alert(err.message || "Failed to delete task.");
    }
  };

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

        const res = await fetch("http://127.0.0.1:8000/api/tasks/my", {
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
                {(() => {
                  const PLACEHOLDER = generatePlaceholder(task.title || "No Title");
                  return (
                    <div className="h-44 overflow-hidden bg-gray-100 border-b">
                      <img
                        src={
                          task.image_url && task.image_url !== "null"
                            ? task.image_url.startsWith("http")
                              ? task.image_url
                              : `http://127.0.0.1:8000/${task.image_url.replace(/\\/g, "/")}`
                            : PLACEHOLDER
                        }
                        alt={task.title}
                        className="w-full h-44 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER;
                        }}
                      />
                    </div>
                  );
                })()}

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
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/edit-task/${task.id}`)}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors font-medium"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
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
