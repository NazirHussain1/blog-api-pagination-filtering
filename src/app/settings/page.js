"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", profile);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password Changed:", password);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <form onSubmit={handleProfileUpdate} className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-3"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />

        <textarea
          placeholder="Bio"
          className="w-full p-2 border rounded mb-3"
          value={profile.bio}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>

      {/* Password Settings */}
      <form onSubmit={handlePasswordChange}>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-2 border rounded mb-3"
          value={password.current}
          onChange={(e) =>
            setPassword({ ...password, current: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-3"
          value={password.new}
          onChange={(e) =>
            setPassword({ ...password, new: e.target.value })
          }
        />

        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
}
