// src/pages/FindPeoplePage.tsx
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CheckCircle, User, FileText, Plus } from "lucide-react";

type Person = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  followers: number;
  posts: number;
  bio?: string;
};

const PEOPLE: Person[] = [
  {
    id: "p1",
    name: "Sophie Bennett",
    role: "Product Designer",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80",
    followers: 312,
    posts: 48,
    bio: "Product Designer who focuses on simplicity & usability.",
  },
  {
    id: "p2",
    name: "Alex Rodriguez",
    role: "Senior Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    followers: 210,
    posts: 30,
    bio: "Engineer building high-performance systems.",
  },
  {
    id: "p3",
    name: "Rachel Kim",
    role: "Sustainability Lead",
    department: "Leadership",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80",
    followers: 410,
    posts: 60,
    bio: "Driving our sustainability initiatives.",
  },
  {
    id: "p4",
    name: "Marcus Thompson",
    role: "Product Manager",
    department: "Product",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80",
    followers: 187,
    posts: 22,
    bio: "PM focused on customer outcomes.",
  },
  {
    id: "p5",
    name: "Emma Stone",
    role: "UX Researcher",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
    followers: 128,
    posts: 12,
    bio: "Researcher exploring user needs.",
  },
  {
    id: "p6",
    name: "Noah Davis",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1200&q=80",
    followers: 89,
    posts: 9,
    bio: "Keeping infra healthy and happy.",
  },
  {
    id: "p7",
    name: "Olivia Brown",
    role: "Marketing Manager",
    department: "Marketing",
    avatar: "https://images.unsplash.com/photo-1545996124-1b3c8a2d1d8f?w=1200&q=80",
    followers: 240,
    posts: 34,
    bio: "Growth & campaigns lead.",
  },
  {
    id: "p8",
    name: "Liam Johnson",
    role: "Customer Success",
    department: "Customer Success",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=1200&q=80",
    followers: 76,
    posts: 6,
    bio: "Helping customers win.",
  },
  {
    id: "p9",
    name: "Ava Wilson",
    role: "QA Engineer",
    department: "QA",
    avatar: "https://images.unsplash.com/photo-1545996124-1b3c8a2d1d8f?w=1200&q=80&crop=faces",
    followers: 54,
    posts: 7,
    bio: "Quality first.",
  },
  {
    id: "p10",
    name: "Ethan Miller",
    role: "Finance Analyst",
    department: "Finance",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&crop=faces",
    followers: 61,
    posts: 11,
    bio: "Numbers & forecasts.",
  },
];

const DEPARTMENTS = [
  "All",
  "Design",
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Leadership",
  "Customer Success",
  "QA",
  "Finance",
];

interface FindPeoplePageProps {
  onViewProfile?: (personId?: string) => void;
  onBack?: () => void;
}

export function FindPeoplePage({ onViewProfile, onBack }: FindPeoplePageProps) {
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});
  const [taggedMap, setTaggedMap] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return PEOPLE.filter((p) => {
      if (deptFilter !== "All" && p.department !== deptFilter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    }).slice(0, 10); // return first 10
  }, [deptFilter, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Find People</h2>
          <p className="text-sm text-gray-500">Discover teammates to tag and connect with</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="h-9 px-3 rounded-full border border-gray-200 bg-white text-sm"
            style={{ borderRadius: "999px" }}
          />

          <Select value={deptFilter} onValueChange={(v) => setDeptFilter(v)}>
            <SelectTrigger className="w-40 h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "999px" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ borderRadius: "var(--radius-2xl)" }}>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* grid: 4 cards per row on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl overflow-hidden shadow-soft-lg border border-gray-100"
            style={{ borderRadius: "1.5rem" }}
          >
            {/* top image */}
            <div className="w-full h-40 bg-gray-100 overflow-hidden">
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            </div>

            {/* body */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">{p.name}</h3>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{p.bio}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{p.followers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{p.posts}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    className={`h-9 px-4 flex items-center gap-2 shadow-sm ${followMap[p.id] ? "bg-white border border-gray-200 text-gray-800" : "bg-white text-gray-900"}`}
                    style={{ borderRadius: "999px", boxShadow: "0 4px 10px rgba(8,10,15,0.06)" }}
                    onClick={() => setFollowMap((s) => ({ ...s, [p.id]: !s[p.id] }))}
                  >
                    <span className="text-sm">{followMap[p.id] ? "Following" : "Follow"}</span>
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Button
                    className="h-9 px-3 bg-gray-900 text-white"
                    style={{ borderRadius: "1rem" }}
                    onClick={() => onViewProfile?.(p.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
