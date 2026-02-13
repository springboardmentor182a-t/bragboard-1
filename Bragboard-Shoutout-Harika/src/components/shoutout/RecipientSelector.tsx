import { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { Profile } from '@/types/shoutout';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface RecipientSelectorProps {
  selectedRecipients: Profile[];
  onRecipientsChange: (recipients: Profile[]) => void;
}

export function RecipientSelector({ selectedRecipients, onRecipientsChange }: RecipientSelectorProps) {
  const { user } = useAuth();
  const { data: allProfiles = [] } = useProfiles();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const availableProfiles = allProfiles.filter(
    (profile) => 
      profile.id !== user?.id && 
      !selectedRecipients.some((r) => r.id === profile.id)
  );

  const filteredProfiles = availableProfiles.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      profile.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRecipient = (profile: Profile) => {
    onRecipientsChange([...selectedRecipients, profile]);
  };

  const handleRemoveRecipient = (profileId: string) => {
    onRecipientsChange(selectedRecipients.filter((r) => r.id !== profileId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedRecipients.map((recipient) => (
          <Badge
            key={recipient.id}
            variant="secondary"
            className="gap-1 pr-1 py-1.5"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold mr-1">
              {recipient.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            {recipient.full_name}
            <button
              onClick={() => handleRemoveRecipient(recipient.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <UserPlus className="h-4 w-4" />
              Add Recipient
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <ScrollArea className="h-64">
              {filteredProfiles.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="p-2">
                  {filteredProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        handleAddRecipient(profile);
                        setSearch('');
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg p-2 text-left',
                        'transition-colors hover:bg-accent'
                      )}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {profile.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-sm">
                          {profile.full_name || 'Unknown User'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {profile.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
