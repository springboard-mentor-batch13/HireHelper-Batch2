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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/requests/${requestId}`, {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map(req => {
            const reqId = req.id || req._id;
            return (
              <div key={reqId} className="bg-white rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{req.task_title || "Unknown Task"}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-2 border-b pb-2">
                    Requested by: <span className="font-medium text-gray-700">{req.sender_name || "Unknown User"}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>

                {req.status === "pending" && (
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(reqId, "accepted")}
                      disabled={actionLoading === reqId}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === reqId ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(reqId, "rejected")}
                      disabled={actionLoading === reqId}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {actionLoading === reqId ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
