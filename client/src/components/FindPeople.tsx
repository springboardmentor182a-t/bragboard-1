import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Heart } from "lucide-react";

const products = [
  {
    name: "Sara jain",
    price: "Senior Product Designer",
    status: "Active",
    statusColor: "bg-green-50 text-green-700",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    name: "Ajay patel",
    price: "Software Engineer",
    status: "Active",
    statusColor: "bg-green-50 text-green-700",
    image: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    name: "jay singh",
    price: "Head of Marketing",
    status: "Inactive",
    statusColor: "bg-red-50 text-red-700",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    name: "Renu sharma",
    price: "Human Resources",
    status: "Active",
    statusColor: "bg-green-50 text-green-700",
    image: "https://images.unsplash.com/photo-1753784997986-3a154d2b9156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    name: "alice cooper",
    price: "Senior UX Designer",
    status: "Active",
    statusColor: "bg-green-50 text-green-700",
    image: "https://images.unsplash.com/photo-1666693038485-b3a060067809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

export function FindPeople() {
  return (
    <Card className="p-5 shadow-xl shadow-gray-200/50 border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <h3 className="text-gray-900 font-semibold text-lg mb-4">Find People</h3>
      
      <div className="space-y-2.5">
        {products.map((product, index) => (
          <div key={index} className="flex items-center gap-3.5 p-2.5 hover:bg-gray-50 transition-all rounded-xl group cursor-pointer">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{product.name}</p>
              <p className="text-xs text-gray-500 font-medium">{product.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs px-2.5 py-1 border-0 font-medium ${product.statusColor}`} 
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                {product.status}
              </Badge>
              {/* <button className="p-1.5 hover:bg-pink-50 transition-all rounded-lg group/heart">
                <Heart className="w-4 h-4 text-gray-400 group-hover/heart:text-pink-500 group-hover/heart:fill-pink-500 transition-all" />
              </button> */}
            </div>
          </div>
        ))}
      </div>
      
      <Button
        variant="ghost"
        className="w-full mt-3 h-9 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
       See All
      </Button>
    </Card>
  );
}