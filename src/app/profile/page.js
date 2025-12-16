"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    avatar: "",
  });

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
        setProfile(data);
        setPreview(data.avatar || null);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
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
      setEditing(false);
      setNewAvatar(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || !user)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Toaster richColors />
      <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex items-center gap-6">
          <Image
            src={preview || "/avatar.png"}
            width={120}
            height={120}
            alt={profile.name}
            className="rounded-full object-cover border"
          />
          {editing && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current.click()}>
                Change Avatar
              </Button>
            </div>
          )}
          {!editing && (
            <div className="ml-auto">
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {editing ? (
            <>
              <Input
                placeholder="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                placeholder="About"
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </>
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
    </div>
  );
}
