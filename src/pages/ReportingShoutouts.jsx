"use client"

import { useState } from "react"
import { Search, Bell, User, BarChart3, Settings, Users, FileText, Grid3x3, ChevronRight } from "lucide-react"

export default function ReportedShoutOuts() {
  const [searchTerm, setSearchTerm] = useState("")

  const reports = [
    {
      id: "RPT-001",
      reportedBy: "Sarah Johnson",
      reason: "Inappropriate language",
      preview: "Great job on the project launch! You really killed i...",
      date: "2024-01-15 16:45",
      status: "Pending",
      avatar: null,
    },
    {
      id: "RPT-002",
      reportedBy: "David Wilson",
      reason: "Spam/Repetitive content",
      preview: "Amazing work everyone! Keep up the great work!...",
      date: "2024-01-14 11:20",
      status: "Resolved",
      avatar: "DW",
    },
    {
      id: "RPT-003",
      reportedBy: "Emma Davis",
      reason: "Off-topic content",
      preview: "Check out my weekend hiking photos! Had an a...",
      date: "2024-01-13 15:10",
      status: "Pending",
      avatar: "ED",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-48 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-gray-900">BragBoard</span>
          </div>
          <p className="text-xs text-gray-500 ml-10">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Grid3x3 size={20} />
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span className="text-sm font-medium">Reports</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <BarChart3 size={20} />
            <span className="text-sm">Analytics</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Users size={20} />
            <span className="text-sm">Users</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
              AU
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reported Shout-Outs</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage shout-outs flagged by users for review.</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-600 cursor-pointer" />
            <User size={20} className="text-gray-600 cursor-pointer" />
            <span className="text-sm text-gray-900">Admin User</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Reports</p>
                  <p className="text-3xl font-bold text-orange-500">2</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-orange-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resolved Reports</p>
                  <p className="text-3xl font-bold text-green-600">1</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl text-green-600">✓</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-blue-600">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChevronRight size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50">
              All Reports
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Report ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Reported By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Shout-Out Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Reported On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        {report.avatar && (
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {report.avatar}
                          </div>
                        )}
                        <span>{report.reportedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{report.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{report.preview}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
