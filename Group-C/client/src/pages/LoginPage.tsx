import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h- gradient-soft flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="">
          <img
            src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MjkxODIyNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Illustration"
            className="w-full h-auto rounded-3xl shadow-soft-lg"
          />
          <div className="mt-8 text-center">
            <h2 className="text-gray-900 mb-2">Celebrate Your Team</h2>
            <p className="text-gray-600">
              Recognize achievements, spread positivity, and build a culture of appreciation.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="text-center mb-8">
            <div className="h-20 flex items-center justify-center mb-4">
              <img 
                src="/logo.png"
              />
            </div>
            <h1 className="text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "user" | "admin")} className="mb-6">
            <TabsList className="w-full grid grid-cols-2 bg-gray-100" style={{ borderRadius: 'var(--radius-md)' }}>
              <TabsTrigger value="user" style={{ borderRadius: 'var(--radius-md)' }}>User Login</TabsTrigger>
              <TabsTrigger value="admin" style={{ borderRadius: 'var(--radius-md)' }}>Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 bg-white border-gray-200"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 bg-white border-gray-200"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sky-600 hover:text-sky-700">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Log In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@company.com"
                    className="h-11 bg-white border-gray-200"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    className="h-11 bg-white border-gray-200"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sky-600 hover:text-sky-700">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Sign In
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}