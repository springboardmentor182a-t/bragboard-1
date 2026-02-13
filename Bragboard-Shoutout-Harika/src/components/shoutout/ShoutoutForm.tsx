import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Profile, Shoutout } from '@/types/shoutout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TagInput } from './TagInput';
import { RecipientSelector } from './RecipientSelector';
import { Sparkles, Save } from 'lucide-react';

interface ShoutoutFormProps {
  mode: 'create' | 'edit';
  initialData?: Shoutout;
  onSubmit: (data: {
    title: string;
    message: string;
    is_public: boolean;
    recipient_ids: string[];
    tag_ids: string[];
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function ShoutoutForm({ mode, initialData, onSubmit, isSubmitting }: ShoutoutFormProps) {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Profile[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMessage(initialData.message);
      setIsPublic(initialData.is_public);
      setSelectedTags(initialData.tags || []);
      setSelectedRecipients(initialData.recipients || []);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) return;

    await onSubmit({
      title: title.trim(),
      message: message.trim(),
      is_public: isPublic,
      recipient_ids: selectedRecipients.map(r => r.id),
      tag_ids: selectedTags.map(t => t.id)
    });
  };

  const isEdit = mode === 'edit';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="recipients">Who's this shoutout for?</Label>
        <RecipientSelector
          selectedRecipients={selectedRecipients}
          onRecipientsChange={setSelectedRecipients}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Give your shoutout a catchy title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Write your appreciation message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <Label htmlFor="public" className="font-medium">Public Shoutout</Label>
          <p className="text-sm text-muted-foreground">
            Allow everyone to see this shoutout
          </p>
        </div>
        <Switch
          id="public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 gap-2"
          disabled={!title.trim() || !message.trim() || isSubmitting}
        >
          {isEdit ? <Save className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {isSubmitting 
            ? (isEdit ? 'Saving...' : 'Creating...') 
            : (isEdit ? 'Save Changes' : 'Create Shoutout')
          }
        </Button>
      </div>
    </form>
  );
}
