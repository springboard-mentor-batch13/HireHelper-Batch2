"use client";

import { useEffect, useState, useMemo } from "react";
import { MapPin, Clock, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 6;

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

const Feed = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestedTasks, setRequestedTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(
          "http://127.0.0.1:8000/tasks/feed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 🔎 Improved Search (safe + trimmed)
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return tasks;

    return tasks.filter((task) =>
      [task.title, task.description, task.location]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [tasks, search]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 🟢 Temporary Request Button Handler
  const handleRequest = (taskId: string) => {
    if (requestedTasks.includes(taskId)) return;

    setRequestedTasks((prev) => [...prev, taskId]);

    // Temporary simulation (remove after real API)
    setTimeout(() => {
      console.log("Request sent for:", taskId);
    }, 500);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="text-sm text-muted-foreground">
            Find tasks that need help
          </p>
        </div>

        {/* 🔎 Search */}
        <input
          type="text"
          placeholder="Search by title, location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-md px-3 py-1 text-sm"
        />
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {/* ❌ No Data */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No tasks found.
        </div>
      )}

      {/* ✅ Task Grid */}
      {!loading && paginatedTasks.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedTasks.map((task) => {
              const imageSrc =
                task.image_url && task.image_url !== "null"
                  ? `http://127.0.0.1:8000/${task.image_url.replace(/\\/g, "/")}`
                  : "/placeholder.jpg";

              const isRequested = requestedTasks.includes(task.id);

              return (
                <div
                  key={task.id}
                  className="overflow-hidden rounded-xl bg-card shadow-sm border"
                >
                  {/* 🖼 Image */}
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img
                      src={
                        task.image_url
                          ? `http://127.0.0.1:8000/${task.image_url.replace(/\\/g, "/")}`
                          : "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={task.title}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 text-base font-semibold">
                      {task.title}
                    </h3>

                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>

                    <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {task.location}
                    </div>

                    <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(task.start_time).toLocaleString()}
                      {task.end_time &&
                        ` - ${new Date(task.end_time).toLocaleTimeString()}`}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
                        {task.status}
                      </span>

                      {/* 🟢 Temporary Request Button */}
                      <button
                        onClick={() => handleRequest(task.id)}
                        disabled={isRequested}
                        className={`text-xs px-3 py-1 rounded-md transition ${
                          isRequested
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isRequested ? "Request Sent" : "Request"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 📌 Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;


// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { MapPin, Clock, Loader2 } from "lucide-react";

// const ITEMS_PER_PAGE = 6;

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   start_time: string;
//   end_time?: string;
//   image_url?: string;
//   status: string;
//   created_at: string;
// }

// const Feed = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         setLoading(true);

//         // ✅ Access token INSIDE useEffect
//         const token =
//           sessionStorage.getItem("token") ||
//           localStorage.getItem("token");

//         if (!token) {
//           console.log("No token found");
//           return;
//         }

//         const res = await fetch(
//           "http://127.0.0.1:8000/tasks/feed",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         setTasks(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // 🔎 Search Filter
//   const filteredTasks = useMemo(() => {
//     return tasks.filter(
//       (task) =>
//         task.title.toLowerCase().includes(search.toLowerCase()) ||
//         task.description.toLowerCase().includes(search.toLowerCase()) ||
//         task.location.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [tasks, search]);

//   // 📄 Pagination Logic
//   const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

//   const paginatedTasks = filteredTasks.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Feed</h1>
//           <p className="text-sm text-muted-foreground">
//             Find tasks that need help
//           </p>
//         </div>

//         {/* 🔎 Search */}
//         <input
//           type="text"
//           placeholder="Search tasks..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="border rounded-md px-3 py-1 text-sm"
//         />
//       </div>

//       {/* 🔄 Loading */}
//       {loading && (
//         <div className="flex justify-center py-10">
//           <Loader2 className="animate-spin" />
//         </div>
//       )}

//       {/* ❌ No Data */}
//       {!loading && filteredTasks.length === 0 && (
//         <div className="text-center py-10 text-muted-foreground">
//           No tasks available.
//         </div>
//       )}

//       {/* ✅ Task Grid */}
//       {!loading && paginatedTasks.length > 0 && (
//         <>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {paginatedTasks.map((task) => (
//               <div
//                 key={task.id}
//                 className="overflow-hidden rounded-xl bg-card shadow-sm border"
//               >
//                 <div className="h-44 overflow-hidden bg-gray-100">
//                   <img
//                     src={
//                       task.image_url
//                         ? `http://127.0.0.1:8000/${task.image_url.replace(/\\/g, "/")}`
//                         : "/placeholder.jpg"
//                     }
//                     alt={task.title}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4">
//                   <h3 className="mb-1 text-base font-semibold">
//                     {task.title}
//                   </h3>

//                   <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
//                     {task.description}
//                   </p>

//                   <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
//                     <MapPin className="h-3.5 w-3.5" />
//                     {task.location}
//                   </div>

//                   <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
//                     <Clock className="h-3.5 w-3.5" />
//                     {new Date(task.start_time).toLocaleString()}{" "}
//                     {task.end_time &&
//                       ` - ${new Date(task.end_time).toLocaleTimeString()}`}
//                   </div>

//                   <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-600">
//                     {task.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* 📌 Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-6">
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => prev - 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>

//               <span className="px-3 py-1 text-sm">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Feed;
