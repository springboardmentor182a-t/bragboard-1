import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

const customers = [
  {
    name: "Gladyce",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Elbert",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Dash",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    name: "Joyce",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    name: "Marko",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
];

export function NewCustomers() {
  return (
    <Card className="p-6 shadow-xl shadow-gray-200/50 border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-900 font-semibold text-lg">New Users Today!</h3>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">+12%</span>
        </div>
        <p className="text-sm text-gray-500">Send a welcome message to all new Users.</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {customers.map((customer, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <Avatar className="w-14 h-14 ring-2 ring-white shadow-lg hover:scale-110 transition-transform">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">{customer.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-600 mt-2 font-medium group-hover:text-indigo-600 transition-colors">{customer.name}</p>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          className="text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 h-9 gap-1.5 transition-all"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}