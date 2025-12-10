export default function Tasks() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-600">My Tasks</h1>

      <div className="bg-white p-4 shadow rounded border">
        <h2 className="font-semibold">Task 1: Fix Dashboard UI</h2>
        <p className="text-gray-600">Deadline: Tomorrow</p>
      </div>

      <div className="bg-white p-4 shadow rounded border">
        <h2 className="font-semibold">Task 2: Update Performance Charts</h2>
        <p className="text-gray-600">Deadline: Friday</p>
      </div>
    </div>
  );
}
