import { useState } from "react";
import type { Page } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Mail, MapPin, Calendar, Award, Star, ThumbsUp } from "lucide-react";

interface UserProfilePageProps {
  userId?: string | null; // NEW: which user to show
  onNavigate: (page: Page) => void; // receive navigation handler from parent
}

const defaultProfile = {
  name: "Sarah Chen",
  role: "Senior Product Designer",
  email: "sarah@company.com",
  location: "San Francisco, CA",
  joinedDate: "January 2022",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  bio: "Passionate about creating delightful user experiences and building inclusive products. Love celebrating wins with the team!",
  stats: {
    totalShouts: 42,
    reactionsReceived: 324,
    badges: 8,
  },
};

export function UserProfilePage({ userId, onNavigate }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState("activity");

  // For now: if userId present, show it in a small header. Replace with real fetch when ready.
  return (
    <div className="max-w-5xl mx-auto">
      {/* Top notice showing which user is opened */}
      {userId && (
        <div className="mb-4 text-sm text-gray-600">
          Showing profile for user id: <span className="font-medium text-gray-900">{userId}</span>
        </div>
      )}

      {/* Header Card */}
      <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white mb-8" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-28 h-28 ring-4 ring-gray-100">
            <AvatarImage src={defaultProfile.avatar} alt={defaultProfile.name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-gray-900 mb-1">{defaultProfile.name}</h1>
                <p className="text-gray-600">{defaultProfile.role}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-gray-200"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={() => onNavigate("settings")}
              >
                Edit Profile
              </Button>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{defaultProfile.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {defaultProfile.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {defaultProfile.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {defaultProfile.joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
          <div className="text-center p-4 bg-sky-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <ThumbsUp className="w-5 h-5 text-sky-600" />
              <p className="text-2xl font-semibold text-gray-900">{defaultProfile.stats.totalShouts}</p>
            </div>
            <p className="text-sm text-gray-600">Total Shouts</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-purple-600" />
              <p className="text-2xl font-semibold text-gray-900">{defaultProfile.stats.reactionsReceived}</p>
            </div>
            <p className="text-sm text-gray-600">Reactions Received</p>
          </div>
          <div className="text-center p-4 bg-mint-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-5 h-5 text-green-600" />
              <p className="text-2xl font-semibold text-gray-900">{defaultProfile.stats.badges}</p>
            </div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>
      </Card>

      {/* Tabs (keep existing tabs and content) */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white border border-gray-200" style={{ borderRadius: 'var(--radius-lg)' }}>
          <TabsTrigger value="about" style={{ borderRadius: 'var(--radius-md)' }}>About</TabsTrigger>
          <TabsTrigger value="activity" style={{ borderRadius: 'var(--radius-md)' }}>Posts</TabsTrigger>
          <TabsTrigger value="badges" style={{ borderRadius: 'var(--radius-md)' }}>Badges</TabsTrigger>
          <TabsTrigger value="report" style={{ borderRadius: 'var(--radius-md)' }}>Report</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about">
          <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-6">About {defaultProfile.name}</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700 leading-relaxed">{defaultProfile.bio}</p>
              </div>
              <div>
                <h4 className="text-gray-900 mb-3">Skills & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {["Product Design", "UX Research", "Design Systems", "Mentoring", "Team Building"].map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-gray-200" style={{ borderRadius: 'var(--radius-sm)' }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-gray-900 mb-2">Contact</h4>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {defaultProfile.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {defaultProfile.location}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="activity" className="space-y-6">
          {/* keep your previous activity markup or replace with fetched posts */}
          <Card className="p-6 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <p className="text-sm text-gray-600">This user has no posts in the mock data.</p>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-6">Badges & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Top Contributor", icon: "🏆", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                { name: "Team Player", icon: "🤝", color: "bg-blue-50 text-blue-700 border-blue-200" },
              ].map((badge, index) => (
                <div key={index} className={`p-6 border-2 rounded-xl text-center ${badge.color}`} style={{ borderRadius: 'var(--radius-lg)' }}>
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <p className="font-semibold">{badge.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
