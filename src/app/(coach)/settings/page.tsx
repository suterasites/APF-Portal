"use client";

import { useState } from "react";
import { User, Building, Bell, Save, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const initialProfile = {
  name: "James Sutera",
  email: "james@accelerateperformance.com.au",
  phone: "0412 345 678",
  bio: "Head coach at Accelerate Performance Football. Specialising in speed, agility, and technical development for footballers of all levels.",
};

const initialBusiness = {
  businessName: "Accelerate Performance Football",
  defaultSessionDuration: "60",
  cancellationPolicy: "24",
  locations: [
    "Princes Park - Field 1",
    "Princes Park - Field 2",
    "Gosch's Paddock",
    "Online - Zoom",
  ],
};

const initialNotifications = {
  sessionReminder24hr: true,
  sessionReminder2hr: true,
  paymentReceived: true,
  overdueReminder: true,
  newBooking: true,
  cancellation: true,
};

type Tab = "profile" | "business" | "notifications";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
          {label}
        </p>
        {description && (
          <p className="text-xs text-[#6B6B6B]">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] dark:focus-visible:ring-[#FAFAFA] focus-visible:ring-offset-2 ${
          checked
            ? "bg-[#0A0A0A] dark:bg-[#FAFAFA]"
            : "bg-[#E5E5E5] dark:bg-[#2A2A2A]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
            checked
              ? "translate-x-5 bg-white dark:bg-[#0A0A0A]"
              : "translate-x-0 bg-white dark:bg-[#6B6B6B]"
          }`}
        />
      </button>
    </div>
  );
}

export default function CoachSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [business, setBusiness] = useState(initialBusiness);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newLocation, setNewLocation] = useState("");

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setBusiness((prev) => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()],
      }));
      setNewLocation("");
    }
  };

  const handleRemoveLocation = (index: number) => {
    setBusiness((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Settings
        </h1>
        <p className="mt-1 text-[#6B6B6B]">
          Manage your profile, business settings, and notifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-1">
        {[
          { key: "profile" as Tab, label: "Profile", icon: User },
          { key: "business" as Tab, label: "Business", icon: Building },
          { key: "notifications" as Tab, label: "Notifications", icon: Bell },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAFAFA] shadow-sm"
                : "text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Coach Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Profile photo placeholder */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-[#FAFAFA]">
                    <span className="text-xl font-bold text-white dark:text-[#0A0A0A]">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="mt-1 text-xs text-[#6B6B6B]">
                      JPG or PNG. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>

                <Textarea
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Business Name"
                  value={business.businessName}
                  onChange={(e) =>
                    setBusiness((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      Default Session Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={business.defaultSessionDuration}
                        onChange={(e) =>
                          setBusiness((prev) => ({
                            ...prev,
                            defaultSessionDuration: e.target.value,
                          }))
                        }
                      />
                      <span className="shrink-0 text-sm text-[#6B6B6B]">
                        minutes
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      Cancellation Policy
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={business.cancellationPolicy}
                        onChange={(e) =>
                          setBusiness((prev) => ({
                            ...prev,
                            cancellationPolicy: e.target.value,
                          }))
                        }
                      />
                      <span className="shrink-0 text-sm text-[#6B6B6B]">
                        hours notice
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Business Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Training Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {business.locations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-4 py-3"
                  >
                    <p className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {location}
                    </p>
                    <button
                      onClick={() => handleRemoveLocation(index)}
                      className="text-sm text-[#6B6B6B] hover:text-[#C23B22] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add new location"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLocation();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddLocation}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
              <Toggle
                checked={notifications.sessionReminder24hr}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    sessionReminder24hr: value,
                  }))
                }
                label="Session reminders (24 hours before)"
                description="Receive a notification 24 hours before each session"
              />
              <Toggle
                checked={notifications.sessionReminder2hr}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    sessionReminder2hr: value,
                  }))
                }
                label="Session reminders (2 hours before)"
                description="Receive a notification 2 hours before each session"
              />
              <Toggle
                checked={notifications.paymentReceived}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    paymentReceived: value,
                  }))
                }
                label="Payment received notifications"
                description="Get notified when a client makes a payment"
              />
              <Toggle
                checked={notifications.overdueReminder}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    overdueReminder: value,
                  }))
                }
                label="Overdue payment reminders"
                description="Get notified about overdue client invoices"
              />
              <Toggle
                checked={notifications.newBooking}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    newBooking: value,
                  }))
                }
                label="New booking notifications"
                description="Get notified when a client books a session"
              />
              <Toggle
                checked={notifications.cancellation}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    cancellation: value,
                  }))
                }
                label="Cancellation notifications"
                description="Get notified when a client cancels a session"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
