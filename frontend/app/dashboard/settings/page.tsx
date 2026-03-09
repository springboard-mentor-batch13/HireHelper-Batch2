"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Eye, EyeOff, CheckCircle, XCircle, X } from "lucide-react";

const API = "http://127.0.0.1:8000";

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["bg-blue-500", "bg-purple-500", "bg-teal-500", "bg-rose-500", "bg-amber-500", "bg-indigo-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

type Toast = { id: number; type: "success" | "error"; message: string };

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    bio: "",
    profile_picture: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new_pass: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const token: string | null =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // ── Load profile ──────────────────────────────
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { headers: authHeaders });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          email: data.email ?? "",
          phone_number: data.phone_number ?? "",
          bio: data.bio ?? "",
          profile_picture: data.profile_picture ?? "",
        });
      } catch {
        addToast("error", "Could not load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Upload profile picture ─────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API}/auth/upload-profile-picture`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setProfile((prev) => ({ ...prev, profile_picture: data.profile_picture }));
      addToast("success", "Profile picture updated!");
    } catch {
      addToast("error", "Failed to upload profile picture");
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePicture = async () => {
    try {
      await fetch(`${API}/auth/update-profile`, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ profile_picture: "" }),
      });
      setProfile((prev) => ({ ...prev, profile_picture: "" }));
      addToast("success", "Profile picture removed");
    } catch {
      addToast("error", "Failed to remove picture");
    }
  };

  // ── Save personal info ─────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/auth/update-profile`, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          bio: profile.bio,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setProfile((prev) => ({ ...prev, ...updated }));
      // Also update the name stored in localStorage so the sidebar updates
      const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
      const newName = `${updated.first_name} ${updated.last_name}`;
      if (localStorage.getItem("user")) localStorage.setItem("user", JSON.stringify({ ...user, name: newName, email: updated.email }));
      if (sessionStorage.getItem("user")) sessionStorage.setItem("user", JSON.stringify({ ...user, name: newName, email: updated.email }));
      addToast("success", "Profile saved successfully!");
    } catch {
      addToast("error", "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_pass !== passwords.confirm) {
      addToast("error", "New passwords do not match");
      return;
    }
    if (passwords.new_pass.length < 6) {
      addToast("error", "New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: passwords.current, new_password: passwords.new_pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to change password");
      addToast("success", "Password changed successfully!");
      setPasswords({ current: "", new_pass: "", confirm: "" });
      setShowPasswordForm(false);
    } catch (err: any) {
      addToast("error", err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Avatar ──────────────────────────────────────
  const avatarColor = getAvatarColor(`${profile.first_name}${profile.last_name}`);
  const initials = getInitials(profile.first_name, profile.last_name);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in pointer-events-auto ${t.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
          >
            {t.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile and account preferences</p>
      </div>

      {/* ─── Profile Picture ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile Picture</h2>
        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div className={`relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0 ${!profile.profile_picture ? avatarColor : ""} flex items-center justify-center`}>
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{initials}</span>
            )}
            {uploadingPic && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                Change Photo
              </button>
              {profile.profile_picture && (
                <button
                  onClick={handleRemovePicture}
                  disabled={uploadingPic}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 ml-1">JPG, PNG up to 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* ─── Personal Information ──────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Personal Information</h2>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                value={profile.first_name}
                onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="John"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                value={profile.last_name}
                onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Smith"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              value={profile.email}
              disabled
              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              value={profile.phone_number}
              onChange={(e) => setProfile((p) => ({ ...p, phone_number: e.target.value }))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Bio <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Tell people a bit about yourself..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ─── Account Security ──────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Account Security</h2>

        {/* Password row */}
        {!showPasswordForm ? (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-800">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">Keep your account secure with a strong password</p>
            </div>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-800">Change Password</h3>
              <button
                type="button"
                onClick={() => { setShowPasswordForm(false); setPasswords({ current: "", new_pass: "", confirm: "" }); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter current password"
                  required
                />
                <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={passwords.new_pass}
                  onChange={(e) => setPasswords((p) => ({ ...p, new_pass: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="At least 6 characters"
                  required
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Repeat new password"
                  required
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwords.confirm && passwords.new_pass !== passwords.confirm && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>
              <button
                type="button"
                onClick={() => { setShowPasswordForm(false); setPasswords({ current: "", new_pass: "", confirm: "" }); }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
