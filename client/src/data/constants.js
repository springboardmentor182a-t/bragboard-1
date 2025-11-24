
export const DEPARTMENTS = [
  "Development",
  "Marketing",
  "Support",
  "HR",
  "Design"
];

export const EMPLOYEES = [
  { id: 1, name: "Alice Johnson", department: "Development" },
  { id: 2, name: "Bob Smith", department: "Support" },
  { id: 3, name: "Priya Reddy", department: "Marketing" },
  { id: 4, name: "Rahul Singh", department: "Design" }
];

export const LEADERBOARD = [
  { id: 1, name: "Alice Johnson", points: 120 },
  { id: 2, name: "Bob Smith", points: 110 },
  { id: 3, name: "Priya Reddy", points: 100 },
  { id: 4, name: "Rahul Singh", points: 90 }
];

export const SHOUTOUTS = [
  { id: 1, emoji: "👏", from: 1, to: 2, reason: "teamwork", tag: "Teamwork" },
  { id: 2, emoji: "🎉", from: 3, to: 4, reason: "creativity", tag: "Innovation" },
  { id: 3, emoji: "🚀", from: 1, to: 3, reason: "collaboration", tag: "Teamwork" }
];

export function computeTopTag(shoutouts) {
  const tagCounts = {};
  let maxCount = 0;
  let topTag = '';
  for (const shout of shoutouts) {
    tagCounts[shout.tag] = (tagCounts[shout.tag] || 0) + 1;
    if (tagCounts[shout.tag] > maxCount) {
      maxCount = tagCounts[shout.tag];
      topTag = shout.tag;
    }
  }
  return topTag;
}


export function getEmployeeName(id) {
  const emp = EMPLOYEES.find(e => e.id === id);
  return emp ? emp.name : 'Unknown';
}

