import React from 'react';

const DepartmentStats = ({ data }) => {
    const getDepartmentColor = (dept) => {
        const colors = {
            'Engineering': 'from-blue-500 to-cyan-500',
            'Marketing': 'from-green-500 to-emerald-500',
            'Sales': 'from-yellow-500 to-orange-500',
            'HR': 'from-red-500 to-pink-500',
            'Finance': 'from-purple-500 to-violet-500'
        };
        return colors[dept] || 'from-gray-500 to-gray-700';
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                📊 Department Performance
                <span className="ml-2 text-sm font-normal text-gray-500">
                    Engagement across teams
                </span>
            </h3>
            
            <div className="space-y-6">
                {data.map((dept, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getDepartmentColor(dept.department)} mr-2`}></div>
                                <span className="font-medium text-gray-700">
                                    {dept.department}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                                {dept.total_shoutouts} shoutouts
                            </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-gradient-to-r h-2.5 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${(dept.total_shoutouts / 50) * 100}%`,
                                    background: `linear-gradient(90deg, ${dept.department === 'Engineering' ? '#3B82F6' : 
                                        dept.department === 'Marketing' ? '#10B981' : 
                                        dept.department === 'Sales' ? '#F59E0B' : 
                                        dept.department === 'HR' ? '#EF4444' : '#8B5CF6'}, 
                                        ${dept.department === 'Engineering' ? '#06B6D4' : 
                                        dept.department === 'Marketing' ? '#34D399' : 
                                        dept.department === 'Sales' ? '#F97316' : 
                                        dept.department === 'HR' ? '#EC4899' : '#A855F7'})`
                                }}
                            ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                                <span className="mr-4">
                                    👥 {dept.active_users} active users
                                </span>
                                <span>
                                    ⭐ Avg. {dept.avg_engagement} reactions/shoutout
                                </span>
                            </div>
                            <div className="text-gray-600">
                                Star: {dept.most_active_user}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentStats;      
