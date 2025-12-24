import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Heart, Star, ThumbsUp, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const sentShoutouts = [
  {
    id: 1,
    recipient: {
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      initials: 'SJ',
    },
    message: 'Amazing work on the new feature! Your attention to detail really shows.',
    category: 'Appreciation',
    date: '2025-11-09',
    reactions: { clap: 12, star: 8, heart: 15 },
  },
  {
    id: 2,
    recipient: {
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      initials: 'MC',
    },
    message: 'Thank you for being such a great team player during the sprint!',
    category: 'Teamwork',
    date: '2025-11-08',
    reactions: { clap: 9, star: 11, heart: 7 },
  },
  {
    id: 3,
    recipient: {
      name: 'Emily Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      initials: 'ED',
    },
    message: 'Your innovative solution to the performance issue was brilliant!',
    category: 'Innovation',
    date: '2025-11-07',
    reactions: { clap: 18, star: 14, heart: 10 },
  },
];

const receivedShoutouts = [
  {
    id: 1,
    sender: {
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      initials: 'JW',
    },
    message: 'Great leadership in guiding the team through challenges this week!',
    category: 'Leadership',
    date: '2025-11-09',
    reactions: { clap: 15, star: 9, heart: 13 },
  },
  {
    id: 2,
    sender: {
      name: 'Lisa Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      initials: 'LA',
    },
    message: 'Your presentation was outstanding! Really well prepared.',
    category: 'Achievement',
    date: '2025-11-08',
    reactions: { clap: 20, star: 16, heart: 18 },
  },
  {
    id: 3,
    sender: {
      name: 'David Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      initials: 'DB',
    },
    message: 'Thanks for always being willing to help others learn!',
    category: 'Teamwork',
    date: '2025-11-07',
    reactions: { clap: 11, star: 13, heart: 9 },
  },
];

const getCategoryColor = (category) => {
  switch (category) {
    case 'Appreciation':
      return 'bg-purple-100 text-purple-600';
    case 'Teamwork':
      return 'bg-blue-100 text-blue-600';
    case 'Innovation':
      return 'bg-green-100 text-green-600';
    case 'Leadership':
      return 'bg-orange-100 text-orange-600';
    case 'Achievement':
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function EmployeeShoutoutsScreen() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Your Shout-outs</h1>
          <p className="text-gray-600">Manage your sent and received shout-outs</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Give Shout-out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900">32</p>
              <p className="text-gray-600">Shout-outs Sent</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-900">47</p>
              <p className="text-gray-600">Shout-outs Received</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-900">892</p>
              <p className="text-gray-600">Total Reactions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Shout-outs Tabs */}
      <Tabs defaultValue="sent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="w-4 h-4" />
            Sent ({sentShoutouts.length})
          </TabsTrigger>
          <TabsTrigger value="received" className="gap-2">
            <Heart className="w-4 h-4" />
            Received ({receivedShoutouts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          {sentShoutouts.map((shoutout) => (
            <Card key={shoutout.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={shoutout.recipient.avatar} />
                  <AvatarFallback>{shoutout.recipient.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-gray-900 whitespace-nowrap">To: {shoutout.recipient.name}</span>
                    <Badge className={getCategoryColor(shoutout.category) + ' hover:' + getCategoryColor(shoutout.category) + ' whitespace-nowrap'}>
                      {shoutout.category}
                    </Badge>
                    <span className="text-gray-500 ml-auto whitespace-nowrap">{shoutout.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4 break-words">{shoutout.message}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                      <span>👏</span>
                      <span className="text-gray-600">{shoutout.reactions.clap}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                      <span>⭐</span>
                      <span className="text-gray-600">{shoutout.reactions.star}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                      <span>❤️</span>
                      <span className="text-gray-600">{shoutout.reactions.heart}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedShoutouts.map((shoutout) => (
            <Card key={shoutout.id} className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={shoutout.sender.avatar} />
                  <AvatarFallback>{shoutout.sender.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-gray-900 whitespace-nowrap">From: {shoutout.sender.name}</span>
                    <Badge className={getCategoryColor(shoutout.category) + ' hover:' + getCategoryColor(shoutout.category) + ' whitespace-nowrap'}>
                      {shoutout.category}
                    </Badge>
                    <span className="text-gray-500 ml-auto whitespace-nowrap">{shoutout.date}</span>
                  </div>
                  <p className="text-gray-700 mb-4 break-words">{shoutout.message}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button className="flex items-center gap-1 px-3 py-1 bg-white rounded-full hover:bg-gray-50 transition-colors">
                      <span>👏</span>
                      <span className="text-gray-600">{shoutout.reactions.clap}</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-white rounded-full hover:bg-gray-50 transition-colors">
                      <span>⭐</span>
                      <span className="text-gray-600">{shoutout.reactions.star}</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-white rounded-full hover:bg-gray-50 transition-colors">
                      <span>❤️</span>
                      <span className="text-gray-600">{shoutout.reactions.heart}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}