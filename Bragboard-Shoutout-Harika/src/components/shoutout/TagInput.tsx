import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Tag } from '@/types/shoutout';
import { useTags, useCreateTag } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagInput({ selectedTags, onTagsChange }: TagInputProps) {
  const { data: allTags = [] } = useTags();
  const createTagMutation = useCreateTag();
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const availableTags = allTags.filter(
    (tag) => !selectedTags.some((t) => t.id === tag.id)
  );

  const handleAddTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      const newTag = await createTagMutation.mutateAsync({ name: newTagName.trim() });
      handleAddTag(newTag);
      setNewTagName('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
            className="border gap-1 pr-1"
          >
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1">
              <Plus className="h-3 w-3" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              {/* Existing tags */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Available Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          handleAddTag(tag);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'px-2 py-1 text-xs rounded-md border transition-all',
                          'hover:scale-105 hover:shadow-sm'
                        )}
                        style={{ 
                          backgroundColor: tag.color + '20', 
                          color: tag.color, 
                          borderColor: tag.color 
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create new tag */}
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground">Create New Tag</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || createTagMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
