// src/components/CreateShoutSlideOver.tsx
import React, { useState, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { X, Upload, Tag, Users, Link as LinkIcon } from "lucide-react";
import usePosts from "../hooks/usePosts";

interface CreateShoutSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShoutSlideOver({ isOpen, onClose }: CreateShoutSlideOverProps) {
  const { createPost } = usePosts();

  // form state
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [schedule, setSchedule] = useState(false);

  // attachments: either uploaded file (data URL) OR an external link
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null); // file upload -> data URI
  const [imageLink, setImageLink] = useState<string>(""); // external link string

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // recipients helpers
  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && recipientInput.trim()) {
      e.preventDefault();
      setRecipients((prev) => [...prev, recipientInput.trim()]);
      setRecipientInput("");
    }
  };
  const handleRemoveRecipient = (index: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  // tags helpers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };
  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // upload file -> data URI
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
      // clear any image link when user uploads file (link has precedence only when present)
      setImageLink("");
    };
    reader.readAsDataURL(file);
  };

  // Remove current attachment
  const handleRemoveAttachment = () => {
    setImageDataUrl(null);
    setImageLink("");
  };

  // Try to convert recipient inputs to numeric IDs if they look numeric (best effort)
  const recipientsToNumeric = useCallback((): number[] | undefined => {
    const nums = recipients
      .map((r) => {
        if (!r) return undefined;
        const n = parseInt(r, 10);
        return Number.isFinite(n) ? n : undefined;
      })
      .filter((v): v is number => typeof v === "number");
    return nums.length ? nums : undefined;
  }, [recipients]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please enter a message for the shout-out.");
      return;
    }

    setSubmitting(true);
    try {
      // prefer external link if provided; otherwise use uploaded data URL (or null)
      const image_url = imageLink?.trim() ? imageLink.trim() : imageDataUrl ?? null;

      const normalizedTags = tags && tags.length
        ? tags.map((t) => (typeof t === "string" ? t.trim().replace(/^@+/, "") : String(t)))
            .filter(Boolean)
        : undefined;

      const payload: {
        description: string;
        image_url?: string | null;
        recipients?: number[];
        tags?: string[];
        scheduled?: boolean;
      } = {
        description: message.trim(),
        image_url: image_url ?? null,
        // numeric recipients (if user typed numeric ids); else undefined
        recipients: recipientsToNumeric(),
        // send usernames as 'tags' (backend will resolve them to user ids)
        tags: normalizedTags,
        scheduled: schedule ? true : undefined,
      };

      await createPost(payload as any); // use your hook - it will normalize
      // reset
      setMessage("");
      setRecipients([]);
      setTags([]);
      setImageDataUrl(null);
      setImageLink("");
      setSchedule(false);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Failed to create shout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* centered modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6" style={{ borderRadius: "var(--radius-xl)" }}>
            {/* header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Shout-out</h3>
                <p className="text-sm text-gray-600">Celebrate your team's achievements</p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Close"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipients */}
              <div>
                <Label htmlFor="recipients" className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Recipients / Tags
                </Label>
                <Input
                  id="recipients"
                  placeholder="Type a user id or name and press Enter"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={handleAddRecipient}
                  className="mt-1 h-11 bg-white border-gray-200"
                  style={{ borderRadius: "var(--radius-2xl)" }}
                />
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipients.map((r, idx) => (
                      <Badge
                        key={idx}
                        className="bg-sky-50 text-sky-700 border-0 pl-3 pr-2 py-1.5"
                        style={{ borderRadius: "var(--radius-sm)" }}
                      >
                        {r}
                        <button type="button" onClick={() => handleRemoveRecipient(idx)} className="ml-2 hover:bg-sky-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm">
                  Message
                  <span className="ml-2 text-xs text-gray-500">{message.length}/400</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Share your appreciation and why this person or team deserves recognition..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 400))}
                  className="mt-1 min-h-[120px] bg-white border-gray-200 resize-none"
                  style={{ borderRadius: "var(--radius-2xl)" }}
                />
              </div>

              {/* Attachment: Upload OR Link */}
              <div>
                <Label className="flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4" />
                  Attachment (optional)
                </Label>

                {/* If preview exists show it */}
                {imageDataUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 mt-2">
                    <img src={imageDataUrl} alt="upload preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="absolute top-2 right-2 p-1 rounded-md bg-white/90 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-colors mt-2"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload an image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}

                {/* OR provide external link */}
                <div className="mt-3">
                  <Label htmlFor="image-link" className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4" />
                    Image link (Cloudinary / Unsplash / external)
                  </Label>
                  <Input
                    id="image-link"
                    placeholder="https://res.cloudinary.com/.../image.jpg"
                    value={imageLink}
                    onChange={(e) => {
                      setImageLink(e.target.value);
                      if (e.target.value.trim()) {
                        // clear uploaded file preview when user enters a link (link will be used)
                        setImageDataUrl(null);
                      }
                    }}
                    className="mt-1 h-11 bg-white border-gray-200"
                    style={{ borderRadius: "var(--radius-2xl)" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">If you paste a link it will be used instead of uploaded file. Only the link is saved to the database.</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  Tags (optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="Add tags and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="mt-1 h-11 bg-white border-gray-200"
                  style={{ borderRadius: "var(--radius-2xl)" }}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t, i) => (
                      <Badge key={i} variant="outline" className="border-gray-200 pl-3 pr-2 py-1.5" style={{ borderRadius: "var(--radius-sm)" }}>
                        #{t}
                        <button type="button" onClick={() => handleRemoveTag(i)} className="ml-2 hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && <div className="text-sm text-red-600">{error}</div>}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="px-4 py-2"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  Cancel
                </Button>

                {/* Post button: same gradient style as Create User */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  {submitting ? "Posting..." : "Post Shout-out"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateShoutSlideOver;
