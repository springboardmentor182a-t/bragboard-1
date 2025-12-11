export default function Placeholder({ title }) {
  return (
    <div className="bg-white p-6 shadow rounded mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-500">Placeholder Component Loaded</p>
    </div>
  );
}
