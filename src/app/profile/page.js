"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
  location: "",
  about: "",
  avatar: "",
};

export default function MyProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const cleanProfile = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          about: data.about || "",
          avatar: data.avatar || "",
        };

        setProfile(cleanProfile);
        setOriginalProfile(cleanProfile);
        setPreview(cleanProfile.avatar || "/avatar.png");
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!newAvatar) return profile.avatar;

    const formData = new FormData();
    formData.append("image", newAvatar);

    const res = await fetch("/api/users/upload-avatar", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Avatar upload failed");
    return data.url;
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const avatarUrl = await uploadAvatar();
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...profile, avatar: avatarUrl }),
      });

      if (!res.ok) throw new Error("Profile update failed");
      const updated = await res.json();
      setProfile(updated);
      setOriginalProfile(updated);
      setPreview(updated.avatar || "/avatar.png");
      setEditing(false);
      setNewAvatar(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setPreview(originalProfile.avatar || "/avatar.png");
    setNewAvatar(null);
    setEditing(false);
  };

  if (authLoading || !user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Toaster richColors />
      <h1 className="text-3xl font-bold text-center">My Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* AVATAR */}
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={preview || "/avatar.png"}
              fill
              alt="Avatar"
              className="rounded-full object-cover border border-gray-300"
            />
          </div>

          {editing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Change Avatar
              </Button>
            </>
          )}

          {!editing && (
            <div className="ml-auto">
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>

        {/* DETAILS */}
        {editing ? (
          <div className="space-y-4">
            <Input placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Input placeholder="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <Input placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <Input placeholder="Location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            <textarea rows={4} className="w-full border rounded p-2" placeholder="About" value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={updating}>{updating ? "Updating..." : "Save Changes"}</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
            {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
            {profile.about && <p><strong>About:</strong> {profile.about}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
