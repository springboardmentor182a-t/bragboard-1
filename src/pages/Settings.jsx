export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Settings</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="text-sm font-medium">Display Name</label>
          <input className="border p-2 w-full rounded" defaultValue="John Doe" />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="border p-2 w-full rounded" defaultValue="john@example.com" />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}
