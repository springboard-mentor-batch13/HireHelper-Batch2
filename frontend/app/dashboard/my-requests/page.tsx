"use client";

import { useEffect, useState } from "react";
import StatusBadge from "../../../components/StatusBadge";
import { Loader2 } from "lucide-react";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/requests/sent", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error("Failed to fetch sent requests");

      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">My Requests</h1>
      <p className="text-gray-500 mb-8">Requests you've sent to help others with their tasks</p>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500 font-medium">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-lg">You haven't sent any requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map(req => {
            const reqId = req.id || req._id;
            return (
              <div key={reqId} className="bg-white rounded-xl shadow-sm border p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{req.task_title || "Unknown Task"}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Task Owner: <span className="font-medium text-gray-700">{req.owner_name || "Unknown User"}</span>
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
                <div className="border-t pt-3 mt-1">
                  <p className="text-xs text-gray-400">
                    Requested on: {new Date(req.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
