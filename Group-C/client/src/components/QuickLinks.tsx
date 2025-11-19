import { Card } from "./ui/card";
import { Link, Users, Calendar, FileText, Settings } from "lucide-react";
import { Button } from "./ui/button";

const links = [
  {
    icon: Users,
    label: "Team Directory",
    href: "#",
  },
  {
    icon: Calendar,
    label: "Events Calendar",
    href: "#",
  },
  {
    icon: FileText,
    label: "Company Handbook",
    href: "#",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
  },
];

export function QuickLinks() {
  return (
    <Card className="p-3 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <div className="flex items-center gap-1.5 mb-0">
        <Link className="w-4 h-4 text-purple-600" />
        <h3 className="text-gray-900">Quick Links</h3>
      </div>
      <div className="space-y-0.5">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-2 text-sm text-gray-700 hover:bg-gray-50 h-7"
              style={{ borderRadius: 'var(--radius-md)' }}
              asChild
            >
              <a href={link.href}>
                <Icon className="w-4 h-4" />
                {link.label}
              </a>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}