<<<<<<< HEAD
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
=======
import { motion } from "framer-motion";

export default function Profile() {
  const user = {
    name: "John Doe",
    role: "Employee",
    email: "john.doe@company.com",
    phone: "+91 98765 43210",
    department: "Software Development",
    position: "Frontend Developer",
    joinDate: "12 Aug 2022",
    avatar:
      "https://i.pinimg.com/564x/66/8a/41/668a41f0d93d7a8fcd6aeb2a15c5b4cf.jpg",
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-md object-cover"
          />

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-600 font-medium">{user.position}</p>
            <p className="text-gray-500">{user.department}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Phone" value={user.phone} />
          <ProfileField label="Role" value={user.role} />
          <ProfileField label="Joined" value={user.joinDate} />
        </div>
      </div>
    </motion.div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
