import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { User, Lock, Bell, Upload } from "lucide-react";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop");

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card className="p-2 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                <TabsTrigger
                  value="profile"
                  className="w-full justify-start px-4 py-3 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-full justify-start px-4 py-3 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <Lock className="w-4 h-4 mr-3" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="w-full justify-start px-4 py-3 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-0">
              <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="text-gray-900 mb-6">Profile Information</h3>
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 ring-4 ring-gray-100">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <label htmlFor="avatar-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-200"
                          style={{ borderRadius: 'var(--radius-md)' }}
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="Sarah"
                        className="h-11 bg-white border-gray-200"
                        style={{ borderRadius: 'var(--radius-md)' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Chen"
                        className="h-11 bg-white border-gray-200"
                        style={{ borderRadius: 'var(--radius-md)' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="sarah@company.com"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      defaultValue="Senior Product Designer"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      defaultValue="San Francisco, CA"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue="Passionate about creating delightful user experiences and building inclusive products."
                      className="min-h-24 bg-white border-gray-200 resize-none"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-0">
              <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="text-gray-900 mb-6">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="h-11 bg-white border-gray-200"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                      style={{ borderRadius: 'var(--radius-md)' }}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="text-gray-900 mb-6">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-0">
              <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="text-gray-900 mb-6">Email Notifications</h3>
                <div className="space-y-6">
                  {[
                    { title: "New Shout-outs", desc: "Receive email when someone gives you a shout-out" },
                    { title: "Comments", desc: "Receive email when someone comments on your shout-out" },
                    { title: "Reactions", desc: "Receive email when someone reacts to your shout-out" },
                    { title: "Mentions", desc: "Receive email when someone mentions you" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="text-gray-900 mb-6">Notification Frequency</h3>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Email Digest</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="h-11 border-gray-200" style={{ borderRadius: 'var(--radius-md)' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ borderRadius: 'var(--radius-md)' }}>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
