import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl"
    >
      <div className="flex items-center gap-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          className="w-28 h-28 rounded-full border"
          alt="profile"
        />

        <div>
          <h2 className="text-2xl font-bold text-blue-600">{user.name}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
          <p className="text-gray-600 mt-1">Email: johndoe@example.com</p>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-bold text-gray-700 mb-2">Skills</h3>
      <div className="flex gap-3 flex-wrap">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Team Work</span>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Communication</span>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Problem Solving</span>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Task Management</span>
      </div>

      <h3 className="text-xl font-bold text-gray-700 mt-6 mb-2">Experience</h3>
      <p className="text-gray-600">
        2+ years experience in corporate performance tracking and team management. 
        Excellent consistency & communication skills.
      </p>
    </motion.div>
  );
}
