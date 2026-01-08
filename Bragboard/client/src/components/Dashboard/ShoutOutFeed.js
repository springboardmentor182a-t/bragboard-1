import React, { useState, useEffect } from 'react';
import { shoutouts } from '../../services/api';

const ShoutOutFeed = () => {
  const [shoutoutsList, setShoutoutsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShoutouts = async () => {
      try {
        console.log('Fetching shoutouts...');
        const response = await shoutouts.getAll('all');
        console.log('Shoutouts API Response:', response);
        
        if (response && response.data) {
          console.log('Shoutouts data:', response.data);
          setShoutoutsList(Array.isArray(response.data) ? response.data : []);
        } else {
          console.warn('Unexpected API response format:', response);
          setShoutoutsList([]);
        }
      } catch (err) {
        console.error('Error fetching shoutouts:', err);
        setError('Failed to load shoutouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShoutouts();
  }, []);

  const getHeaderColor = (type) => {
    switch (type) {
      case 'ready':
        return 'text-green-600';
      case 'reply':
        return 'text-blue-600';
      default:
        return 'text-gray-800';
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case 'ready':
        return 'Ready';
      case 'reply':
        return 'Reply';
      default:
        return null;
    }
  };

  if (loading) return <div className="p-6 text-center">Loading shoutouts...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>

        <div className="space-y-6">
          {shoutoutsList.length > 0 ? (
            shoutoutsList.map((shoutout) => (
              <div key={shoutout.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                {shoutout.type && shoutout.type !== 'normal' && (
                  <div className={`text-sm font-medium mb-2 ${getHeaderColor(shoutout.type)}`}>
                    {getPrefix(shoutout.type)}
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      {(() => {
                        // Debug log the shoutout object
                        console.log('Shoutout data:', shoutout);
                        
                        // Get sender name
                        const senderName = shoutout.sender?.name || 
                                         shoutout.sender_name || 
                                         (shoutout.sender_id ? `User ${shoutout.sender_id}` : 'Unknown');
                        
                        // Get recipient names
                        let recipientNames = 'Everyone';
                        if (shoutout.recipients?.length > 0) {
                          recipientNames = shoutout.recipients
                            .map(r => r.name || r.recipient_name || `User ${r.recipient_id || r.id || '?'}`)
                            .join(', ');
                        }
                        
                        return `${senderName} → ${recipientNames}`;
                      })()}
                    </p>
                    <p className="text-gray-600 italic mb-2">"{shoutout.message}"</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{new Date(shoutout.created_at).toLocaleString()}</span>
                      <div className="flex space-x-2">
                        <span>👍 {shoutout.reaction_counts?.like || 0}</span>
                        <span>👏 {shoutout.reaction_counts?.clap || 0}</span>
                        <span>⭐ {shoutout.reaction_counts?.star || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No shoutouts yet. Be the first to give someone a shoutout!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoutOutFeed;