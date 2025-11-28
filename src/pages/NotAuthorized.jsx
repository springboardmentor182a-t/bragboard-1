export default function NotAuthorized() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600">You are not authorized to view this page.</p>
    </div>
  );
}
