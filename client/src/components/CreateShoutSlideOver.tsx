import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { X, Upload, Tag, Users } from "lucide-react";

interface CreateShoutSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShoutSlideOver({ isOpen, onClose }: CreateShoutSlideOverProps) {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleAddRecipient = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && recipientInput.trim()) {
      e.preventDefault();
      setRecipients([...recipients, recipientInput.trim()]);
      setRecipientInput("");
    }
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle shout creation
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Create Shout-out</h2>
            <p className="text-sm text-gray-500 mt-1">Celebrate your team's achievements</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-10 h-10"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Recipients */}
            <div className="space-y-2">
              <Label htmlFor="recipients" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipients
              </Label>
              <div className="space-y-2">
                <Input
                  id="recipients"
                  placeholder="Type a name or team and press Enter"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={handleAddRecipient}
                  className="h-11 bg-white border-gray-200"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipients.map((recipient, index) => (
                      <Badge
                        key={index}
                        className="bg-sky-50 text-sky-700 border-0 pl-3 pr-2 py-1.5"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      >
                        {recipient}
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(index)}
                          className="ml-2 hover:bg-sky-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message
                <span className="ml-2 text-xs text-gray-500">
                  {message.length}/400
                </span>
              </Label>
              <Textarea
                id="message"
                placeholder="Share your appreciation and why this person or team deserves recognition..."
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 400))}
                className="min-h-32 bg-white border-gray-200 resize-none"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Attachment (optional)</Label>
              {image ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                  <img src={image} alt="Upload preview" className="w-full h-64 object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => setImage(null)}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload an image</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags (optional)
              </Label>
              <div className="space-y-2">
                <Input
                  id="tags"
                  placeholder="Add tags and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="h-11 bg-white border-gray-200"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-200 pl-3 pr-2 py-1.5"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl" style={{ borderRadius: 'var(--radius-md)' }}>
              <div>
                <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
                <p className="text-xs text-gray-500 mt-1">Post this shout-out at a specific time</p>
              </div>
              <Switch
                id="schedule"
                checked={schedule}
                onCheckedChange={setSchedule}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 border-gray-200"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Post Shout-out
          </Button>
        </div>
      </div>
    </>
  );
}
