import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Star, Heart, MessageCircle, TrendingUp } from "lucide-react";

export function ComponentLibrary() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-gray-900 mb-2">Component Library</h1>
        <p className="text-gray-600">Reusable components with the ShoutOut design system</p>
      </div>

      {/* Color Palette */}
      <section>
        <h2 className="text-gray-900 mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="w-full h-20 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 mb-4" style={{ borderRadius: 'var(--radius-md)' }}></div>
            <p className="font-medium text-gray-900 mb-1">Sky Blue</p>
            <p className="text-xs text-gray-500">#0EA5E9</p>
          </Card>
          <Card className="p-6 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="w-full h-20 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 mb-4" style={{ borderRadius: 'var(--radius-md)' }}></div>
            <p className="font-medium text-gray-900 mb-1">Mint</p>
            <p className="text-xs text-gray-500">#10B981</p>
          </Card>
          <Card className="p-6 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="w-full h-20 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 mb-4" style={{ borderRadius: 'var(--radius-md)' }}></div>
            <p className="font-medium text-gray-900 mb-1">Purple</p>
            <p className="text-xs text-gray-500">#A855F7</p>
          </Card>
          <Card className="p-6 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="w-full h-20 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 mb-4" style={{ borderRadius: 'var(--radius-md)' }}></div>
            <p className="font-medium text-gray-900 mb-1">Rose</p>
            <p className="text-xs text-gray-500">#F43F5E</p>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-gray-900 mb-6">Typography</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200 space-y-6" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div>
            <h1 className="text-gray-900 mb-2">Heading 1</h1>
            <p className="text-sm text-gray-500">Font: Inter / SF Pro, Size: 2xl, Weight: Semibold</p>
          </div>
          <div>
            <h2 className="text-gray-900 mb-2">Heading 2</h2>
            <p className="text-sm text-gray-500">Font: Inter / SF Pro, Size: xl, Weight: Semibold</p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Heading 3</h3>
            <p className="text-sm text-gray-500">Font: Inter / SF Pro, Size: lg, Weight: Semibold</p>
          </div>
          <div>
            <h4 className="text-gray-900 mb-2">Heading 4</h4>
            <p className="text-sm text-gray-500">Font: Inter / SF Pro, Size: base, Weight: Medium</p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">Body text - Regular paragraph text for content and descriptions with proper line height.</p>
            <p className="text-sm text-gray-500">Font: Inter / SF Pro, Size: base, Weight: Normal</p>
          </div>
        </Card>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-gray-900 mb-6">Buttons</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Primary</p>
              <Button
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Primary Button
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Secondary</p>
              <Button
                variant="outline"
                className="w-full border-gray-200"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Secondary Button
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Ghost</p>
              <Button
                variant="ghost"
                className="w-full"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Ghost Button
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Small</p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-sky-500 to-blue-600"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Small Button
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Icon</p>
              <Button
                size="icon"
                className="bg-gradient-to-r from-sky-500 to-blue-600"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Disabled</p>
              <Button
                disabled
                className="w-full"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Disabled Button
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Form Elements */}
      <section>
        <h2 className="text-gray-900 mb-6">Form Elements</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Input Field</Label>
              <Input
                placeholder="Enter text..."
                className="h-11 bg-white border-gray-200"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Dropdown</Label>
              <Select>
                <SelectTrigger className="h-11 border-gray-200" style={{ borderRadius: 'var(--radius-md)' }}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent style={{ borderRadius: 'var(--radius-md)' }}>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Textarea</Label>
              <Textarea
                placeholder="Enter longer text..."
                className="min-h-24 bg-white border-gray-200 resize-none"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl md:col-span-2" style={{ borderRadius: 'var(--radius-md)' }}>
              <Label htmlFor="switch" className="cursor-pointer">Toggle Switch</Label>
              <Switch id="switch" />
            </div>
          </div>
        </Card>
      </section>

      {/* Badges & Tags */}
      <section>
        <h2 className="text-gray-900 mb-6">Badges & Tags</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Recipient Chips</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-sky-50 text-sky-700 border-0" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Marketing Team
                </Badge>
                <Badge className="bg-purple-50 text-purple-700 border-0" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Design Team
                </Badge>
                <Badge className="bg-mint-50 text-green-700 border-0" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Engineering
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Outline Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-gray-200" style={{ borderRadius: 'var(--radius-sm)' }}>
                  #Q4Launch
                </Badge>
                <Badge variant="outline" className="border-gray-200" style={{ borderRadius: 'var(--radius-sm)' }}>
                  #TeamWin
                </Badge>
                <Badge variant="outline" className="border-gray-200" style={{ borderRadius: 'var(--radius-sm)' }}>
                  #Innovation
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Status Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Active
                </Badge>
                <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Pending
                </Badge>
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Inactive
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Avatars */}
      <section>
        <h2 className="text-gray-900 mb-6">Avatars</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Avatar className="w-20 h-20 ring-4 ring-gray-100 mb-2">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500">Large (80px)</p>
            </div>
            <div className="text-center">
              <Avatar className="w-14 h-14 ring-2 ring-gray-100 mb-2">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500">Medium (56px)</p>
            </div>
            <div className="text-center">
              <Avatar className="w-12 h-12 ring-2 ring-gray-100 mb-2">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500">Default (48px)</p>
            </div>
            <div className="text-center">
              <Avatar className="w-10 h-10 ring-2 ring-gray-100 mb-2">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500">Small (40px)</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Reaction Buttons */}
      <section>
        <h2 className="text-gray-900 mb-6">Reaction Buttons</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 text-gray-600 hover:bg-gray-50"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <span className="text-base">👏</span>
              <span className="text-sm font-medium">12</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 bg-yellow-50 text-yellow-600"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <span className="text-base">⭐</span>
              <span className="text-sm font-medium">8</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 bg-red-50 text-red-600"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <span className="text-base">❤️</span>
              <span className="text-sm font-medium">15</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 text-gray-600 hover:bg-gray-50"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">5</span>
            </Button>
          </div>
        </Card>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-gray-900 mb-6">Card Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-4">Standard Card</h3>
            <p className="text-gray-700 leading-relaxed">
              Cards use soft shadows, large rounded corners (22-28px), and subtle borders for a clean, modern look.
            </p>
          </Card>
          <Card className="p-6 shadow-soft-lg border border-gray-200 bg-sky-50" style={{ borderRadius: 'var(--radius-xl)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white" style={{ borderRadius: 'var(--radius-md)' }}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900">Stat Card</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">2,456</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">With colored background</p>
          </Card>
        </div>
      </section>

      {/* Icons */}
      <section>
        <h2 className="text-gray-900 mb-6">Icon Style</h2>
        <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
          <p className="text-gray-600 mb-6">Using Lucide React icons with thin, Apple-like style</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                <Plus className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-xs text-gray-500">Plus</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500">Star</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs text-gray-500">Heart</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-500">Message</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500">Trending</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Border Radius & Spacing */}
      <section>
        <h2 className="text-gray-900 mb-6">Border Radius & Spacing Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-4">Border Radius</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sky-100" style={{ borderRadius: '12px' }}></div>
                <div>
                  <p className="font-medium text-gray-900">Small</p>
                  <p className="text-sm text-gray-500">12px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100" style={{ borderRadius: '16px' }}></div>
                <div>
                  <p className="font-medium text-gray-900">Medium</p>
                  <p className="text-sm text-gray-500">16px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100" style={{ borderRadius: '22px' }}></div>
                <div>
                  <p className="font-medium text-gray-900">Large</p>
                  <p className="text-sm text-gray-500">22px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-rose-100" style={{ borderRadius: '28px' }}></div>
                <div>
                  <p className="font-medium text-gray-900">Extra Large</p>
                  <p className="text-sm text-gray-500">28px</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-8 shadow-soft-lg border border-gray-200" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-gray-900 mb-4">Spacing Scale</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-sky-500"></div>
                <div>
                  <p className="font-medium text-gray-900">XS</p>
                  <p className="text-sm text-gray-500">8px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-purple-500"></div>
                <div>
                  <p className="font-medium text-gray-900">SM</p>
                  <p className="text-sm text-gray-500">12px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-8 bg-green-500"></div>
                <div>
                  <p className="font-medium text-gray-900">LG</p>
                  <p className="text-sm text-gray-500">24px</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-8 bg-rose-500"></div>
                <div>
                  <p className="font-medium text-gray-900">2XL</p>
                  <p className="text-sm text-gray-500">40px</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
