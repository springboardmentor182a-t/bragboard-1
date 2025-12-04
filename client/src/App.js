import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LeaderboardPage from './features/leaderboard/LeaderboardPage';
import './assets/global.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🏆</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">BragBoard</h1>
                  <p className="text-xs text-gray-500">Employee Recognition</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center"
                >
                  <span className="mr-1">🏠</span> Home
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors flex items-center"
                >
                  <span className="mr-1">📊</span> Dashboard
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center"
                >
                  <span className="mr-2">🏆</span> View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-16 bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex justify-center space-x-6 mb-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">About</a>
                <a href="#" className="text-gray-400 hover:text-blue-600">Contact</a>
                <a href="#" className="text-gray-400 hover:text-blue-600">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-blue-600">Terms</a>
              </div>
              <p className="text-gray-500">© 2024 BragBoard - Employee Recognition System</p>
              <p className="text-sm text-gray-400 mt-2">Built with ❤️ using React & FastAPI</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="text-center py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Celebrate Great Work with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">BragBoard</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Boost team morale and productivity by recognizing achievements in real-time. 
          Our leaderboard showcases top performers and encourages a culture of appreciation.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Leaderboard</h3>
            <p className="text-gray-600">Track top performers with live rankings and scores</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Department Analytics</h3>
            <p className="text-gray-600">Get insights into team engagement across departments</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recent Highlights</h3>
            <p className="text-gray-600">Celebrate recent achievements and recognitions</p>
          </div>
        </div>
        
        <Link 
          to="/leaderboard" 
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🚀 Explore Leaderboard Now
        </Link>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold">42</div>
          <div className="text-blue-100">Total Shoutouts</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold">156</div>
          <div className="text-green-100">Total Reactions</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold">8</div>
          <div className="text-purple-100">Active Departments</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold">94%</div>
          <div className="text-yellow-100">Engagement Rate</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span>Most Recognized Employee</span>
            <span className="font-bold text-blue-600">Alex Johnson</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span>Most Active Department</span>
            <span className="font-bold text-green-600">Engineering</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span>Top Reaction Type</span>
            <span className="font-bold text-purple-600">👍 Likes</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/leaderboard" 
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            View Detailed Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;