import { useState } from "react";
import type { Page } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Mail, MapPin, Calendar, Award, Star, ThumbsUp } from "lucide-react";

interface UserProfilePageProps {
  onNavigate: (page: Page) => void; // receive navigation handler from parent
}

const profile = {
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

const activities = [
  {
    id: "1",
    type: "shout",
    text: "Amazing work on the Q4 campaign launch! The new design system is looking incredible.",
    recipients: ["Marketing Team", "Design Team"],
    timestamp: "2 hours ago",
    reactions: 35,
  },
  {
    id: "2",
    type: "shout",
    text: "Huge thanks to the engineering team for the quick turnaround on the mobile fixes!",
    recipients: ["Engineering"],
    timestamp: "1 day ago",
    reactions: 28,
  },
  {
    id: "3",
    type: "shout",
    text: "Shoutout to Rachel for the incredible leadership on the sustainability initiative! 🌱",
    recipients: ["Rachel Kim", "Leadership"],
    timestamp: "3 days ago",
    reactions: 42,
  },
];

const badges = [
  { name: "Top Contributor", icon: "🏆", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { name: "Team Player", icon: "🤝", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Recognition Pro", icon: "⭐", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Early Adopter", icon: "🚀", color: "bg-green-50 text-green-700 border-green-200" },
  { name: "100 Shouts", icon: "💯", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { name: "Mentor", icon: "👨‍🏫", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export function UserProfilePage({ onNavigate }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Card */}
      <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white mb-8" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-28 h-28 ring-4 ring-gray-100">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-gray-900 mb-1">{profile.name}</h1>
                <p className="text-gray-600">{profile.role}</p>
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
            <p className="text-gray-700 mb-4 leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {profile.joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
          <div className="text-center p-4 bg-sky-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <ThumbsUp className="w-5 h-5 text-sky-600" />
              <p className="text-2xl font-semibold text-gray-900">{profile.stats.totalShouts}</p>
            </div>
            <p className="text-sm text-gray-600">Total Shouts</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-purple-600" />
              <p className="text-2xl font-semibold text-gray-900">{profile.stats.reactionsReceived}</p>
            </div>
            <p className="text-sm text-gray-600">Reactions Received</p>
          </div>
          <div className="text-center p-4 bg-mint-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-5 h-5 text-green-600" />
              <p className="text-2xl font-semibold text-gray-900">{profile.stats.badges}</p>
            </div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white border border-gray-200" style={{ borderRadius: 'var(--radius-lg)' }}>
          <TabsTrigger value="activity" style={{ borderRadius: 'var(--radius-md)' }}>Activity</TabsTrigger>
          <TabsTrigger value="about" style={{ borderRadius: 'var(--radius-md)' }}>About</TabsTrigger>
          <TabsTrigger value="badges" style={{ borderRadius: 'var(--radius-md)' }}>Badges</TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-6 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{profile.name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{activity.timestamp}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activity.recipients.map((recipient, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-sky-50 text-sky-700 border-0" style={{ borderRadius: 'var(--radius-sm)' }}>
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{activity.text}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base mr-1">👏⭐❤️</span>
                {activity.reactions} reactions
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-6">About {profile.name}</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
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
                    {profile.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges">
          <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-6">Badges & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-6 border-2 rounded-xl text-center ${badge.color}`}
                  style={{ borderRadius: 'var(--radius-lg)' }}
                >
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
