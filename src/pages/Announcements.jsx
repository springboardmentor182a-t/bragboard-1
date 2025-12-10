export default function Announcements() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Announcements</h1>

      <div className="bg-white p-4 shadow rounded border mb-4">
        <h2 className="font-semibold">📢 Hackathon This Friday</h2>
        <p>All employees are encouraged to join.</p>
      </div>

      <div className="bg-white p-4 shadow rounded border">
        <h2 className="font-semibold">⚠ System Maintenance</h2>
        <p>Server down from 11 PM - 2 AM.</p>
      </div>
    </div>
  );
}
