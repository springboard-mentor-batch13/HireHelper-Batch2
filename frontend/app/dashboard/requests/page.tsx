"use client";

import { useEffect, useState } from "react";
import StatusBadge from "../../../components/StatusBadge";
import { Check, X, Loader2 } from "lucide-react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/requests/incoming", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
    setActionLoading(requestId);
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error(`Failed to map request to ${status}`);

      // Update UI instantly
      setRequests(prev => prev.map(req =>
        (req.id || req._id) === requestId ? { ...req, status } : req
      ));
    } catch (err) {
      console.error(err);
      alert("Something went wrong changing the status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Incoming Requests</h1>
      <p className="text-gray-500 mb-8">Manage users who requested to help with your tasks</p>

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
          <p className="text-gray-400 text-lg">No incoming requests yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {requests.map(req => {
            const reqId = req.id || req._id;
            return (
              <div key={reqId} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-4">

                {/* Header: User Info & Actions */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-lg">
                      {req.sender_image ? (
                        <img src={req.sender_image} alt="User Profile" className="h-full w-full object-cover" />
                      ) : (
                        (req.sender_name || "U")[0].toUpperCase()
                      )}
                    </div>

                    {/* Name and Rating */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{req.sender_name || "Unknown User"}</h3>
                        <div className="flex items-center text-sm font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                          ★ {req.sender_rating || "4.8"} <span className="text-gray-400 font-normal ml-1">({req.sender_reviews || 0} reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 max-w-3xl">
                        {req.message || "I'd love to help with your task. I have the necessary skills and experience."}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {req.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(reqId, "accepted")}
                          disabled={actionLoading === reqId}
                          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 min-w-[100px]"
                        >
                          {actionLoading === reqId ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(reqId, "rejected")}
                          disabled={actionLoading === reqId}
                          className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 min-w-[100px]"
                        >
                          {actionLoading === reqId ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                          Decline
                        </button>
                      </div>
                    ) : (
                      <StatusBadge status={req.status} />
                    )}
                  </div>
                </div>

                {/* Task Details Box */}
                <div className="ml-16 mr-4 bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Requesting for:</span>
                  <span className="text-gray-800 font-medium">{req.task_title || "Unknown Task"}</span>
                </div>

                {/* Footer Meta */}
                <div className="ml-16 flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>🕒</span>
                    {new Date(req.created_at || Date.now()).toLocaleString()}
                  </div>
                  {req.task_location && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      {req.task_location}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
