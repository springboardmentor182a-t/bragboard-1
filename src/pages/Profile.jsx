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
