import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Heart, Star, ThumbsUp, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { api } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

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

// Helper function to get user initials
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// Helper function to get avatar URL
const getAvatarUrl = (name) => {
  if (!name) return '';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

// Helper function to extract category from content or title
const extractCategory = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('teamwork') || text.includes('team')) return 'Teamwork';
  if (text.includes('leadership') || text.includes('lead')) return 'Leadership';
  if (text.includes('innovation') || text.includes('innovative')) return 'Innovation';
  if (text.includes('achievement') || text.includes('achieve')) return 'Achievement';
  return 'Appreciation';
};

export function EmployeeShoutoutsScreen() {
  const { user } = useAuth();
  const [sentShoutouts, setSentShoutouts] = useState([]);
  const [receivedShoutouts, setReceivedShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    totalReactions: 0,
  });

  const fetchShoutouts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all shoutouts
      const shoutoutsResponse = await api.get('/api/shoutouts');
      const allShoutouts = shoutoutsResponse.data || [];

      // Get user ID - try from user object or decode from token
      const currentUserId = user.id || parseInt(localStorage.getItem('user_id') || '0');

      // Fetch reactions for each shoutout
      const shoutoutsWithReactions = await Promise.all(
        allShoutouts.map(async (shoutout) => {
          try {
            const reactionsResponse = await api.get(`/shoutouts/${shoutout.id}/reactions`);
            const reactions = reactionsResponse.data || {};
            return {
              ...shoutout,
              reactions: {
                clap: reactions.clap || 0,
                star: reactions.star || 0,
                heart: reactions.heart || 0,
              },
            };
          } catch (error) {
            console.error(`Error fetching reactions for shoutout ${shoutout.id}:`, error);
            return {
              ...shoutout,
              reactions: { clap: 0, star: 0, heart: 0 },
            };
          }
        })
      );

      // Fetch users to get author information
      let usersMap = {};
      try {
        const usersResponse = await api.get('/users');
        const users = usersResponse.data || [];
        usersMap = users.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Transform and separate sent/received shoutouts
      const sent = [];
      const received = [];

      shoutoutsWithReactions.forEach((shoutout) => {
        const author = usersMap[shoutout.author_id] || { name: 'Unknown User', id: shoutout.author_id };
        const category = extractCategory(shoutout.title || '', shoutout.content || '');
        const date = formatDate(shoutout.created_at);
        const authorName = author.name || 'Unknown User';
        const avatarUrl = getAvatarUrl(authorName);
        const initials = getInitials(authorName);

        const transformedShoutout = {
          id: shoutout.id,
          message: shoutout.content || shoutout.title || '',
          category,
          date,
          reactions: shoutout.reactions || { clap: 0, star: 0, heart: 0 },
        };

        // Determine if this is sent or received based on author_id
        // Note: Since backend doesn't have recipient_id, we'll treat:
        // - Sent: shoutouts where author_id matches current user
        // - Received: shoutouts where author_id doesn't match current user
        // In a real app, you'd need a recipient_id field or mention parsing
        
        if (shoutout.author_id === currentUserId || String(shoutout.author_id) === String(currentUserId)) {
          // For sent shoutouts, we need recipient info (not available in current schema)
          // For now, we'll use a placeholder or parse from content
          // You may need to update your backend schema to include recipient_id
          sent.push({
            ...transformedShoutout,
            recipient: {
              name: 'All Team Members', // Placeholder - should be actual recipient
              avatar: avatarUrl,
              initials: 'AT',
            },
          });
        } else {
          received.push({
            ...transformedShoutout,
            sender: {
              name: authorName,
              avatar: avatarUrl,
              initials,
            },
          });
        }
      });

      setSentShoutouts(sent);
      setReceivedShoutouts(received);

      // Calculate stats
      const totalReactions = [...sent, ...received].reduce((sum, s) => {
        return sum + (s.reactions.clap || 0) + (s.reactions.star || 0) + (s.reactions.heart || 0);
      }, 0);

      setStats({
        sent: sent.length,
        received: received.length,
        totalReactions,
      });
    } catch (error) {
      console.error('Error fetching shoutouts:', error);
      toast.error('Failed to fetch shoutouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoutouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Your Shout-outs</h1>
            <p className="text-gray-600">Manage your sent and received shout-outs</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading shoutouts...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-900">{stats.sent}</p>
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
              <p className="text-gray-900">{stats.received}</p>
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
              <p className="text-gray-900">{stats.totalReactions}</p>
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
          {sentShoutouts.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-500 text-center">No shoutouts sent yet.</p>
            </Card>
          ) : (
            sentShoutouts.map((shoutout) => (
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
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedShoutouts.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-500 text-center">No shoutouts received yet.</p>
            </Card>
          ) : (
            receivedShoutouts.map((shoutout) => (
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
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}