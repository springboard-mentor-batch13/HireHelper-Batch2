"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  ListTodo,
  MessageSquare,
  Send,
  Plus,
  Settings,
  LogOut,
  Search,
  Bell,
  Handshake,
  Menu,
  X,
  UserRoundPlusIcon,
  UserRoundCheck,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/feed", label: "Feed", icon: Home },
  { href: "/dashboard/my-tasks", label: "My Tasks", icon: ListTodo },
  { href: "/dashboard/requests", label: "Requests", icon: MessageSquare, badge: 1 },
  { href: "/dashboard/my-requests", label: "My Requests", icon: Send },
  { href: "/dashboard/add-task", label: "Add Task", icon: Plus },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  /* ================= AUTH GUARD ================= */
  //useEffect(() => {
   // const token = localStorage.getItem("token");
   // if (!token) {
    //  router.push("/login");
    //}
  //}, [router]);
  /* ============================================== */

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          z-40
          flex h-screen w-60 flex-col
          border-r bg-white
          transition-transform duration-300
          overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
              <Handshake className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">Hire-a-Helper</span>
          </div>

          {/* Close Button (Mobile) */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <UserRoundPlusIcon/>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">test user</p>
              <p className="truncate text-xs text-gray-500">
                test@gmail.com
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Section */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Search (hidden on very small screens) */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search tasks..."
                className="w-64 rounded-md border bg-gray-100 pl-9 pr-3 py-1.5 text-sm outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
