// Department list
export const DEPARTMENTS = [
  "Development",
  "Marketing",
  "Support",
  "HR",
  "Design",
];

// Employees array (IDs used for linkage)
export const EMPLOYEES = [
  { id: 1, name: "Alice Johnson", department: "Development" },
  { id: 2, name: "Bob Smith", department: "Support" },
  { id: 3, name: "Priya Reddy", department: "Marketing" },
  { id: 4, name: "Rahul Singh", department: "Design" },
  { id: 5, name: "Maria Garcia", department: "HR" },
  { id: 6, name: "Chen Wei", department: "Development" },
  { id: 7, name: "Fatima Khan", department: "Support" },
  { id: 8, name: "Liam O'Connor", department: "Development" },
];

// Leaderboard array
export const LEADERBOARD = [
  { id: 1, name: "Alice Johnson", points: 120 },
  { id: 2, name: "Bob Smith", points: 110 },
  { id: 3, name: "Priya Reddy", points: 100 },
  { id: 4, name: "Rahul Singh", points: 90 },
];

// ShoutOuts array using employee IDs
// Added: commentsCount, reactionsCount, createdAt (ISO date string)
export const SHOUTOUTS = [
  {
    id: 1,
    emoji: "👏",
    from: 1,
    to: 2,
    reason: "teamwork",
    tag: "Teamwork",
    commentsCount: 3,
    reactionsCount: 12,
    createdAt: "2025-11-01",
  },
  {
    id: 2,
    emoji: "🎉",
    from: 3,
    to: 4,
    reason: "creativity",
    tag: "Innovation",
    commentsCount: 5,
    reactionsCount: 18,
    createdAt: "2025-11-08",
  },
  {
    id: 3,
    emoji: "🚀",
    from: 1,
    to: 3,
    reason: "collaboration",
    tag: "Teamwork",
    commentsCount: 2,
    reactionsCount: 9,
    createdAt: "2025-11-15",
  },
];

// Utility to compute the most common tag from shoutouts array
export function computeTopTag(shoutouts) {
  const tagCounts = {};
  let maxCount = 0;
  let topTag = "";
  for (const shout of shoutouts) {
    tagCounts[shout.tag] = (tagCounts[shout.tag] || 0) + 1;
    if (tagCounts[shout.tag] > maxCount) {
      maxCount = tagCounts[shout.tag];
      topTag = shout.tag;
    }
  }
  return topTag;
}

// Helper for UI: get employee name by id
export function getEmployeeName(id) {
  const emp = EMPLOYEES.find((e) => e.id === id);
  return emp ? emp.name : "Unknown";
}
