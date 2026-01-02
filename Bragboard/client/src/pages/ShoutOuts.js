import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout.jsx";
import { shoutouts, users as usersApi } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ShoutOuts = () => {
  const { user } = useAuth();
  const [newShoutout, setNewShoutout] = useState({
    recipientIds: [], // Store IDs now
    message: "",
    visibility: "public", // Add visibility
  });
  const [myShoutouts, setMyShoutouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingShoutouts, setLoadingShoutouts] = useState(false);

  // UI State for recipients
  const [selectedRecipients, setSelectedRecipients] = useState([]); // Array of user objects
  const [recipientSearch, setRecipientSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await usersApi.getAll();
        // Filter out current user from potential recipients
        const others = response.data.filter((u) => u.id !== user?.id);
        setTeamMembers(others);
      } catch (error) {
        console.error("Failed to fetch users", error);
        // Fallback or empty
        setTeamMembers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchMyShoutouts = async () => {
      setLoadingShoutouts(true);
      try {
        const response = await shoutouts.getAll();
        // Assuming shoutouts have sender_id
        const my = response.data.filter((s) => s.sender_id === user?.id);
        setMyShoutouts(my);
      } catch (error) {
        console.error("Failed to fetch shoutouts", error);
        setMyShoutouts([]);
      } finally {
        setLoadingShoutouts(false);
      }
    };

    if (user?.id) {
      fetchMyShoutouts();
    }
  }, [user]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(recipientSearch.toLowerCase()) &&
      !selectedRecipients.find((r) => r.id === member.id)
  );

  const addRecipient = (member) => {
    setSelectedRecipients([...selectedRecipients, member]);
    setNewShoutout((prev) => ({
      ...prev,
      recipientIds: [...prev.recipientIds, member.id],
    }));
    setRecipientSearch("");
    // Keep dropdown open for multiple selection or close? Let's keep focused
  };

  const removeRecipient = (memberId) => {
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== memberId));
    setNewShoutout((prev) => ({
      ...prev,
      recipientIds: prev.recipientIds.filter((id) => id !== memberId),
    }));
  };

  const handleSendShoutout = async (e) => {
    e.preventDefault();

    if (newShoutout.recipientIds.length > 0 && newShoutout.message.trim()) {
      try {
        await shoutouts.create({
          message: newShoutout.message,
          recipient_ids: newShoutout.recipientIds,
          visibility: newShoutout.visibility,
        });

        alert(
          `Shoutout sent to ${selectedRecipients
            .map((r) => r.name)
            .join(", ")}!`
        );

        // Reset form
        setNewShoutout({ recipientIds: [], message: "" });
        setSelectedRecipients([]);
        setRecipientSearch("");
      } catch (error) {
        console.error("Failed to send shoutout", error);
        alert("Failed to send shoutout. Please try again.");
      }
    }
  };

  const isFormValid =
    newShoutout.recipientIds.length > 0 && newShoutout.message.trim();

  const filteredShoutouts = myShoutouts.filter((s) =>
    s.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const data = filteredShoutouts.map((s) => ({
      ID: s.id,
      Recipients: s.recipient_names?.join(", ") || "",
      Message: s.message,
      Visibility: s.visibility,
      Likes: s.likes || 0,
      Date: new Date(s.created_at).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shoutouts");
    const wbout = XLSX.write(wb, { bookType: "csv", type: "array" });
    saveAs(
      new Blob([wbout], { type: "text/csv" }),
      `my_shoutouts_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const exportToJSON = () => {
    const data = filteredShoutouts.map((s) => ({
      id: s.id,
      recipients: s.recipient_names || [],
      message: s.message,
      visibility: s.visibility,
      likes: s.likes || 0,
      created_at: s.created_at,
    }));
    const json = JSON.stringify(data, null, 2);
    saveAs(
      new Blob([json], { type: "application/json" }),
      `my_shoutouts_${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("My Shoutouts Report", 20, 20);
    let y = 40;
    filteredShoutouts.forEach((s, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Shoutout ${index + 1}:`, 20, y);
      y += 10;
      doc.text(`Recipients: ${s.recipient_names?.join(", ") || ""}`, 20, y);
      y += 10;
      doc.text(`Message: ${s.message}`, 20, y);
      y += 10;
      doc.text(`Visibility: ${s.visibility}, Likes: ${s.likes || 0}`, 20, y);
      y += 10;
      doc.text(`Date: ${new Date(s.created_at).toLocaleDateString()}`, 20, y);
      y += 15;
    });
    doc.save(`my_shoutouts_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header Box */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 text-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Shout-Outs
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Recognize and celebrate achievements
            </p>
          </div>
        </div>

        {/* Create New Shoutout Form Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Create New Shout-Out
          </h2>
          <form onSubmit={handleSendShoutout}>
            <div className="space-y-6">
              {/* Recipient Selection */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Who would you like to recognize? (Select multiple)
                </label>

                {/* Selected Tags */}
                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[42px] relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  {selectedRecipients.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {user.name}
                      <button
                        type="button"
                        onClick={() => removeRecipient(user.id)}
                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    className="flex-grow outline-none bg-transparent min-w-[150px] text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    placeholder={
                      selectedRecipients.length === 0
                        ? "Search for colleagues..."
                        : ""
                    }
                    value={recipientSearch}
                    onChange={(e) => {
                      setRecipientSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                </div>

                {/* Dropdown Results */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {loadingUsers ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        Loading...
                      </div>
                    ) : filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => addRecipient(member)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex flex-col"
                        >
                          <span className="font-medium text-gray-800 dark:text-white">
                            {member.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {member.department} • {member.role || "Employee"}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No matching colleagues found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recognition Message
                </label>
                <textarea
                  placeholder="Say something awesome about your colleagues or team..."
                  value={newShoutout.message}
                  onChange={(e) =>
                    setNewShoutout({ ...newShoutout, message: e.target.value })
                  }
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white resize-none transition-colors"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Be specific about what they did and why it mattered
                </p>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visibility
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="public"
                      checked={newShoutout.visibility === "public"}
                      onChange={(e) =>
                        setNewShoutout({
                          ...newShoutout,
                          visibility: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    Public
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="private"
                      checked={newShoutout.visibility === "private"}
                      onChange={(e) =>
                        setNewShoutout({
                          ...newShoutout,
                          visibility: e.target.value,
                        })
                      }
                      className="mr-2"
                    />
                    Private
                  </label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Public shoutouts are visible to everyone, private only to
                  recipients.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-8 py-3 rounded-xl font-bold tracking-wide transition-all shadow-lg duration-200 ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transform hover:-translate-y-1 hover:shadow-blue-500/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  Send Shout-Out 🚀
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* My Reported Shoutouts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200 mt-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            My Reported Shoutouts
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {myShoutouts.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Total Shoutouts
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {myShoutouts.reduce((sum, s) => sum + (s.likes || 0), 0)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Likes
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {myShoutouts.filter((s) => s.visibility === "public").length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Public Shoutouts
              </div>
            </div>
          </div>

          {/* Search and Export */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search shoutouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={exportToJSON}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Shoutouts List */}
          {loadingShoutouts ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : filteredShoutouts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No shoutouts found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShoutouts.map((shoutout) => (
                <div
                  key={shoutout.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-800 dark:text-white">
                      To: {shoutout.recipient_names?.join(", ") || "Recipients"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(shoutout.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {shoutout.message}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Visibility: {shoutout.visibility}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Likes: {shoutout.likes || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShoutOuts;
