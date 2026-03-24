"use client";

import { useState } from "react";
import {
  Package,
  CreditCard,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

// -------------------------------------------------
// Types
// -------------------------------------------------

type Tab = "packages" | "memberships" | "templates";

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  totalSessions: number;
  expiryDays: number;
  isActive: boolean;
}

interface Membership {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  billingFrequency: "weekly" | "fortnightly" | "monthly";
  sessionsIncluded: number;
  groupSessionsIncluded: number;
  isActive: boolean;
}

interface SessionTemplate {
  id: string;
  name: string;
  type: "one_on_one" | "group";
  defaultDuration: number; // minutes
  defaultCapacity: number;
  defaultPrice: number; // cents
  defaultLocation: string;
  description: string;
}

// -------------------------------------------------
// Service data (populated from database)
// -------------------------------------------------

const mockPackages: PackageItem[] = [];

const mockMemberships: Membership[] = [];

const mockTemplates: SessionTemplate[] = [];

// -------------------------------------------------
// Tab configuration
// -------------------------------------------------

const tabs: { label: string; value: Tab; icon: React.ElementType }[] = [
  { label: "Packages", value: "packages", icon: Package },
  { label: "Memberships", value: "memberships", icon: CreditCard },
  { label: "Session Templates", value: "templates", icon: Clock },
];

const billingFrequencyLabels: Record<string, string> = {
  weekly: "/ week",
  fortnightly: "/ fortnight",
  monthly: "/ month",
};

// -------------------------------------------------
// Component
// -------------------------------------------------

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("packages");
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E5E5] pb-4 dark:border-[#2A2A2A]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                  : "bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#0A0A0A] dark:bg-[#141414] dark:hover:text-[#FAFAFA]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Packages Tab */}
      {activeTab === "packages" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Packages
              </h2>
              <p className="text-sm text-[#6B6B6B]">
                Session bundles sold as a single purchase.
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>

          {mockPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-16">
              <Package className="h-10 w-10 text-[#6B6B6B] mb-3" />
              <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">No packages yet</p>
              <p className="mt-1 text-xs text-[#6B6B6B]">Create your first package to get started.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{pkg.name}</CardTitle>
                    </div>
                    <Badge variant={pkg.isActive ? "success" : "secondary"}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-[#6B6B6B]">
                    {pkg.description}
                  </p>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Price</span>
                      <span className="font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Sessions</span>
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {pkg.totalSessions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Per session</span>
                      <span className="text-[#6B6B6B]">
                        {formatCurrency(
                          Math.round(pkg.price / pkg.totalSessions)
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Expires after</span>
                      <span className="text-[#6B6B6B]">
                        {pkg.expiryDays} days
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-4 dark:border-[#2A2A2A]">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3.5 w-3.5 text-[#C23B22]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Memberships Tab */}
      {activeTab === "memberships" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Memberships
              </h2>
              <p className="text-sm text-[#6B6B6B]">
                Recurring subscriptions with regular billing.
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Membership
            </Button>
          </div>

          {mockMemberships.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-16">
              <CreditCard className="h-10 w-10 text-[#6B6B6B] mb-3" />
              <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">No memberships yet</p>
              <p className="mt-1 text-xs text-[#6B6B6B]">Create your first membership to get started.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockMemberships.map((mem) => (
              <Card key={mem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{mem.name}</CardTitle>
                    </div>
                    <Badge variant={mem.isActive ? "success" : "secondary"}>
                      {mem.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-[#6B6B6B]">
                    {mem.description}
                  </p>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Price</span>
                      <span className="font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {formatCurrency(mem.price)}
                        <span className="ml-1 font-normal text-[#6B6B6B]">
                          {billingFrequencyLabels[mem.billingFrequency]}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">1-on-1 sessions</span>
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {mem.sessionsIncluded}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Group sessions</span>
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {mem.groupSessionsIncluded >= 99
                          ? "Unlimited"
                          : mem.groupSessionsIncluded}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B]">Billing</span>
                      <span className="capitalize text-[#6B6B6B]">
                        {mem.billingFrequency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-4 dark:border-[#2A2A2A]">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3.5 w-3.5 text-[#C23B22]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Session Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Session Templates
              </h2>
              <p className="text-sm text-[#6B6B6B]">
                Pre-defined session types for quick scheduling.
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </div>

          {mockTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-16">
              <Clock className="h-10 w-10 text-[#6B6B6B] mb-3" />
              <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">No session templates yet</p>
              <p className="mt-1 text-xs text-[#6B6B6B]">Create your first template to get started.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mockTemplates.map((tpl) => (
              <Card key={tpl.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{tpl.name}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        tpl.type === "one_on_one" ? "default" : "secondary"
                      }
                    >
                      {tpl.type === "one_on_one" ? "1-on-1" : "Group"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-[#6B6B6B]">
                    {tpl.description}
                  </p>
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-[#6B6B6B]" />
                      <span className="text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {tpl.defaultDuration} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-[#6B6B6B]" />
                      <span className="text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {tpl.defaultCapacity === 1
                          ? "1 client"
                          : `Up to ${tpl.defaultCapacity}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-[#6B6B6B]" />
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {formatCurrency(tpl.defaultPrice)}
                        {tpl.type === "group" ? " pp" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-[#6B6B6B]" />
                      <span className="truncate text-[#6B6B6B]">
                        {tpl.defaultLocation}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-4 dark:border-[#2A2A2A]">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3.5 w-3.5 text-[#C23B22]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Placeholder Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={
          activeTab === "packages"
            ? "Add Package"
            : activeTab === "memberships"
            ? "Add Membership"
            : "Add Session Template"
        }
      >
        {activeTab === "packages" && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setAddModalOpen(false);
            }}
          >
            <Input label="Package Name" placeholder="e.g. 10-Session Pack" />
            <Textarea
              label="Description"
              placeholder="Describe what this package includes..."
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Price (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B6B6B]">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <Input
                label="Sessions Included"
                type="number"
                min="1"
                placeholder="10"
              />
            </div>
            <Input
              label="Expiry (days)"
              type="number"
              min="1"
              placeholder="90"
            />
            <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5 dark:border-[#2A2A2A]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Package
              </Button>
            </div>
          </form>
        )}

        {activeTab === "memberships" && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setAddModalOpen(false);
            }}
          >
            <Input
              label="Membership Name"
              placeholder="e.g. Monthly Unlimited"
            />
            <Textarea
              label="Description"
              placeholder="Describe what this membership includes..."
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Price (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B6B6B]">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <Select label="Billing Frequency">
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="1-on-1 Sessions"
                type="number"
                min="0"
                placeholder="2"
              />
              <Input
                label="Group Sessions"
                type="number"
                min="0"
                placeholder="Unlimited = 99"
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5 dark:border-[#2A2A2A]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Membership
              </Button>
            </div>
          </form>
        )}

        {activeTab === "templates" && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setAddModalOpen(false);
            }}
          >
            <Input
              label="Template Name"
              placeholder="e.g. 1-on-1 Speed & Agility"
            />
            <Select label="Session Type">
              <option value="one_on_one">1-on-1</option>
              <option value="group">Group</option>
            </Select>
            <Textarea
              label="Description"
              placeholder="Brief description of this session type..."
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration (min)"
                type="number"
                min="15"
                step="15"
                placeholder="60"
              />
              <Input
                label="Capacity"
                type="number"
                min="1"
                placeholder="1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Default Price (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B6B6B]">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <Input
                label="Default Location"
                placeholder="e.g. Princes Park"
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5 dark:border-[#2A2A2A]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
