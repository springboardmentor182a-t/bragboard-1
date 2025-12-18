// src/components/ExportReportCard.tsx
import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";

const DEPARTMENTS = [
  "All Departments",
  "Design",
  "Engineering",
  "Marketing",
  "Sales",
  "Product",
  "Customer Success",
  "Leadership",
  "Finance",
  "HR",
  "QA",
];

const MONTHS = [
  "All months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type SortDirection = "most" | "least";

type PreviewRow = {
  label: string;
  value: number;
};

function diffDays(from?: string, to?: string) {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  const diff = Math.max(0, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
  return diff;
}

export function ExportReportCard() {
  // Header filters
  const [department, setDepartment] = useState<string>("All Departments");
  const [timePreset, setTimePreset] = useState<string>("last7");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Tabs
  const [activeTab, setActiveTab] = useState<string>("all");

  // User Data tab
  const [joiningMonth, setJoiningMonth] = useState<string>("All months");
  const [userEngagementMetric, setUserEngagementMetric] = useState<string>("posts");
  const [userReportsSort, setUserReportsSort] = useState<SortDirection>("most");

  // Shout Outs tab
  const [shoutGivenSort, setShoutGivenSort] = useState<SortDirection>("most");
  const [shoutReceivedSort, setShoutReceivedSort] = useState<SortDirection>("most");

  // Engagement tab
  const [engagementPostsSort, setEngagementPostsSort] = useState<SortDirection>("most");
  const [engagementUsersSort, setEngagementUsersSort] = useState<SortDirection>("most");

  // Reports tab
  const [reportsPostsSort, setReportsPostsSort] = useState<SortDirection>("most");
  const [reportsUsersSort, setReportsUsersSort] = useState<SortDirection>("most");

  // Auto-fill dateFrom/dateTo from preset
  useEffect(() => {
    if (timePreset === "custom") {
      return;
    }
    if (timePreset === "all") {
      setDateFrom("");
      setDateTo("");
      return;
    }

    const now = new Date();
    const to = now.toISOString().slice(0, 10); // YYYY-MM-DD
    let fromDate = new Date();
    if (timePreset === "last7") fromDate.setDate(now.getDate() - 6); // include today
    if (timePreset === "last30") fromDate.setDate(now.getDate() - 29);
    if (timePreset === "last90") fromDate.setDate(now.getDate() - 89);

    setDateFrom(fromDate.toISOString().slice(0, 10));
    setDateTo(to);
  }, [timePreset]);

  // --- Mock data + sorting preview ----------------------------------------
  const baseLabels = ["Design", "Engineering", "Marketing", "Sales", "Product"];

  const getRawForTab = (): PreviewRow[] => {
    switch (activeTab) {
      case "users":
        return baseLabels.map((label, idx) => ({ label, value: 100 - idx * 7 }));
      case "shouts":
        return baseLabels.map((label, idx) => ({ label: `${label} – Shouts`, value: 200 - idx * 15 }));
      case "engagement":
        return baseLabels.map((label, idx) => ({ label: `${label} – Engagement`, value: 80 - idx * 5 }));
      case "reports":
        return baseLabels.map((label, idx) => ({ label: `${label} – Reports`, value: 40 - idx * 3 }));
      case "all":
      default:
        return baseLabels.map((label, idx) => ({ label: `${label} – Overall`, value: 300 - idx * 20 }));
    }
  };

  const getDirectionForCurrentTab = (): SortDirection => {
    switch (activeTab) {
      case "users":
        return userReportsSort;
      case "shouts":
        return shoutGivenSort;
      case "engagement":
        return engagementPostsSort;
      case "reports":
        return reportsPostsSort;
      case "all":
      default:
        return "most";
    }
  };

  // preview respects department, joiningMonth and date range (mock adjustments)
  const previewData: PreviewRow[] = useMemo(() => {
    let raw = getRawForTab();

    // filter by department (mock labels contain department names)
    if (department && department !== "All Departments") {
      const match = raw.filter((r) => r.label.toLowerCase().includes(department.toLowerCase()));
      raw = match.length ? match : [{ label: `${department} – (no data)`, value: 0 }];
    }

    // joiningMonth small mock effect
    if (activeTab === "users" && joiningMonth !== "All months") {
      raw = raw.map((r, i) => ({ ...r, value: Math.max(0, r.value - (i % 3) * 4) }));
    }

    // date range effect: longer range slightly increases numbers in mock
    const days = diffDays(dateFrom, dateTo);
    if (days > 0) {
      raw = raw.map((r) => ({ ...r, value: Math.round(r.value * (1 + Math.min(30, days) / 300)) }));
    }

    // sort direction
    const dir = getDirectionForCurrentTab();
    return raw.sort((a, b) => (dir === "most" ? b.value - a.value : a.value - b.value));
  }, [
    activeTab,
    department,
    joiningMonth,
    dateFrom,
    dateTo,
    userReportsSort,
    shoutGivenSort,
    shoutReceivedSort,
    engagementPostsSort,
    engagementUsersSort,
    reportsPostsSort,
    reportsUsersSort,
  ]);

  // CSV export
  const handleExport = () => {
    if (!previewData.length) {
      alert("No data to export.");
      return;
    }
    const rows = [["Label", "Value"], ...previewData.map((r) => [r.label, String(r.value)])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report-${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const headerSubtitle = () => {
    if (activeTab === "all") return "Full dataset export";
    if (activeTab === "users") return "User-focused exports and joins";
    if (activeTab === "shouts") return "Shout-out analytics and lists";
    if (activeTab === "engagement") return "Engagement metrics and leaderboards";
    if (activeTab === "reports") return "Reports summary and flagged items";
    return "";
  };

  return (
    <Card className="shadow-soft-lg border border-gray-200 bg-white overflow-hidden" style={{ borderRadius: "var(--radius-xl)" }}>
      {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-gray-900 text-lg font-semibold">Export & Reports</h3>
            <p className="text-sm text-gray-500 mt-1">{headerSubtitle()}</p>
          </div>

          {/* Filters group - use flex + responsive widths for robust side-by-side */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 block">Department</label>
                <Select value={department} onValueChange={(v) => setDepartment(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 overflow-y-auto" style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                <Select value={timePreset} onValueChange={(v) => setTimePreset(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="last7">Last 7 days</SelectItem>
                    <SelectItem value="last30">Last 30 days</SelectItem>
                    <SelectItem value="last90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                 <label className="text-xs text-gray-500 mb-1">From</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-10 w-full"
                    style={{ borderRadius: "var(--radius-2xl)" }}
                  />
                </div>
                <div className="flex flex-col">
                 <label className="text-xs text-gray-500 mb-1">To</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-10 w-full"
                    style={{ borderRadius: "var(--radius-2xl)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white border border-gray-100 p-1" style={{ borderRadius: "var(--radius-lg)" }}>
              <TabsTrigger value="all" style={{ borderRadius: "var(--radius-md)" }}>All Data</TabsTrigger>
              <TabsTrigger value="users" style={{ borderRadius: "var(--radius-md)" }}>User Data</TabsTrigger>
              <TabsTrigger value="shouts" style={{ borderRadius: "var(--radius-md)" }}>Shout Outs</TabsTrigger>
              <TabsTrigger value="engagement" style={{ borderRadius: "var(--radius-md)" }}>Engagement</TabsTrigger>
              <TabsTrigger value="reports" style={{ borderRadius: "var(--radius-md)" }}>Reports</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-50 text-indigo-700 border-0" style={{ borderRadius: "var(--radius-lg)" }}>
                Preview
              </Badge>
              <div className="text-xs text-gray-500">{previewData.length} rows</div>
            </div>
          </div>

          {/* All Data */}
          <TabsContent value="all">
            <p className="text-sm text-gray-600">All data export — choose filters and export the full dataset for selected scope.</p>
          </TabsContent>

          {/* User Data - side-by-side (flex widths) */}
          <TabsContent value="users">
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <p className="text-xs text-gray-500 mb-1">Joining month</p>
                  <Select value={joiningMonth} onValueChange={(v) => setJoiningMonth(v)}>
                    <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-56 overflow-y-auto" style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                      {MONTHS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <p className="text-xs text-gray-500 mb-1">Engagement metric</p>
                  <Select value={userEngagementMetric} onValueChange={(v) => setUserEngagementMetric(v)}>
                    <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="tags">Tags</SelectItem>
                      <SelectItem value="comments">Comments</SelectItem>
                      <SelectItem value="claps">Claps</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="hearts">Hearts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <p className="text-xs text-gray-500 mb-1">Reports</p>
                  <Select value={userReportsSort} onValueChange={(v: SortDirection) => setUserReportsSort(v)}>
                    <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                      <SelectItem value="most">Most reports</SelectItem>
                      <SelectItem value="least">Least reports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Shout Outs */}
          <TabsContent value="shouts">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Given</p>
                <Select value={shoutGivenSort} onValueChange={(v: SortDirection) => setShoutGivenSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Received</p>
                <Select value={shoutReceivedSort} onValueChange={(v: SortDirection) => setShoutReceivedSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Engagement */}
          <TabsContent value="engagement">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Posts</p>
                <Select value={engagementPostsSort} onValueChange={(v: SortDirection) => setEngagementPostsSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Users</p>
                <Select value={engagementUsersSort} onValueChange={(v: SortDirection) => setEngagementUsersSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Posts</p>
                <Select value={reportsPostsSort} onValueChange={(v: SortDirection) => setReportsPostsSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-1/2">
                <p className="text-xs text-gray-500 mb-1">Users</p>
                <Select value={reportsUsersSort} onValueChange={(v: SortDirection) => setReportsUsersSort(v)}>
                  <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-2xl)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-2xl)", border: "none" }}>
                    <SelectItem value="most">Most</SelectItem>
                    <SelectItem value="least">Least</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">Preview</h4>
            <div className="text-xs text-gray-500">
              Sorted: {getDirectionForCurrentTab() === "most" ? "descending (most → least)" : "ascending (least → most)"} • {department} • {dateFrom || "—"} → {dateTo || "—"}
            </div>
          </div>

          {previewData.length === 0 ? (
            <p className="text-sm text-gray-500">No data available for this selection.</p>
          ) : (
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
              {previewData.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition">
                  <div className="text-sm text-gray-800">{row.label}</div>
                  <div className="text-sm font-semibold text-gray-900">{row.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-end">
        <Button onClick={handleExport} className="h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white" style={{ borderRadius: "var(--radius-md)" }}>
          Export to CSV
        </Button>
      </div>
    </Card>
  );
}

export default ExportReportCard;
