import { SHOUTOUTS, EMPLOYEES, computeTopTag } from "../../data/constants";
function AnalyticsCards({ loading }) {
    if (loading) {
      // Animated Tailwind placeholders
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-white p-4 rounded shadow">
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }
    // Replace with real stats
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Total Shout-Outs</div>
          <div className="text-2xl font-bold">{SHOUTOUTS.length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Top Tag</div>
          <div className="text-2xl font-bold">{computeTopTag(SHOUTOUTS)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Active Users</div>
          <div className="text-2xl font-bold">{EMPLOYEES.length}</div>
        </div>
      </div>
    );
  }
  export default AnalyticsCards;
  