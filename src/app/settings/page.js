"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, fetchCurrentUser } from "@/redux/features/auth/authSlice";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Trash2, 
  Shield, 
  Globe, 
  Linkedin, 
  Github, 
  Instagram, 
  MapPin,
  Check,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  LogOut,
  Bell,
  Moon,
  Sun,
  Languages,
  Smartphone,
  Palette,
  ChevronRight,
  Facebook,
  Twitter
} from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    facebook: "",
  });

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [theme, setTheme] = useState("light");

  // UI State
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setAvatarPreview(user.avatar || "");
      setSocialLinks({
        twitter: user.socialLinks?.twitter || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        instagram: user.socialLinks?.instagram || "",
        facebook: user.socialLinks?.facebook || "",
      });
      setEmailNotifications(user.preferences?.emailNotifications ?? true);
      setPushNotifications(user.preferences?.pushNotifications ?? false);
      setTheme(user.preferences?.theme || "light");
    }
  }, [dispatch, user]);

  // Password strength checker
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.length >= 12) strength++;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++;
    if (/\d/.test(newPassword)) strength++;
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength++;
    
    setPasswordStrength(strength);
  }, [newPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview("");
    toast.info("Avatar removed. Click Save to confirm.");
  };

  const validateInputs = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required");
      return false;
    }

    if (website && !/^https?:\/\/.+/.test(website)) {
      toast.error("Website must be a valid URL (starting with http:// or https://)");
      return false;
    }

    if (newPassword) {
      if (!currentPassword) {
        toast.error("Current password is required to change password");
        return false;
      }
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return false;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleProfileUpdate = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("bio", bio.trim());
      formData.append("location", location.trim());
      formData.append("website", website.trim());
      formData.append("socialLinks", JSON.stringify(socialLinks));
      formData.append("preferences", JSON.stringify({
        emailNotifications,
        pushNotifications,
        theme,
      }));

      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatar) formData.append("avatar", avatar);

      await dispatch(updateUserProfile(formData)).unwrap();

      toast.success("Profile updated successfully!");
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAvatar(null);
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Account deletion feature coming soon
    toast.error("Account deletion is not yet implemented. Please contact support.");
    setShowDeleteModal(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                      {avatarPreview && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload new photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="City, Country"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700 mb-1">Bio</Label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{bio.length}/500 characters</p>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Twitter className="w-4 h-4 mr-1 text-blue-400" /> Twitter
                      </Label>
                      <Input
                        type="text"
                        placeholder="@username"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Linkedin className="w-4 h-4 mr-1 text-blue-600" /> LinkedIn
                      </Label>
                      <Input
                        type="text"
                        placeholder="username"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Github className="w-4 h-4 mr-1 text-gray-800" /> GitHub
                      </Label>
                      <Input
                        type="text"
                        placeholder="username"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Instagram className="w-4 h-4 mr-1 text-pink-600" /> Instagram
                      </Label>
                      <Input
                        type="text"
                        placeholder="@username"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Facebook className="w-4 h-4 mr-1 text-blue-700" /> Facebook
                      </Label>
                      <Input
                        type="text"
                        placeholder="username"
                        value={socialLinks.facebook}
                        onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="max-w-md space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Password strength</span>
                            <span className={`font-medium ${
                              passwordStrength <= 1 ? "text-red-600" :
                              passwordStrength <= 3 ? "text-yellow-600" :
                              "text-green-600"
                            }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {confirmPassword && (
                          <div className="absolute right-10 top-1/2 -translate-y-1/2">
                            {newPassword === confirmPassword ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-xs text-gray-500">Receive email updates about your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                          <p className="text-xs text-gray-500">Receive push notifications on your devices</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPushNotifications(!pushNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pushNotifications ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pushNotifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Smartphone },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === option.value
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                          theme === option.value ? "text-indigo-600" : "text-gray-400"
                        }`} />
                        <p className={`text-sm font-medium ${
                          theme === option.value ? "text-indigo-600" : "text-gray-700"
                        }`}>
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {activeTab === "profile" && "Update your profile information"}
              {activeTab === "account" && "Manage your account security"}
              {activeTab === "preferences" && "Customize your experience"}
            </p>
            <Button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete your account? All of your data will be permanently removed. 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />

      <style jsx global>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}