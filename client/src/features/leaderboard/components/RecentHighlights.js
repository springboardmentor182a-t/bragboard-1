import React from 'react';

const RecentHighlights = ({ data }) => {
    const getReactionIcon = (type) => {
        switch(type) {
            case 'like': return '👍';
            case 'clap': return '👏';
            case 'star': return '⭐';
            default: return '👍';
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                ✨ Recent Highlights
                <span className="ml-2 text-sm font-normal text-gray-500">
                    Latest recognitions
                </span>
            </h3>
            
            <div className="space-y-4">
                {data.map((highlight, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                    👏
                                </div>
                            </div>
                            
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-blue-600">
                                                {highlight.from}
                                            </span>
                                            {' → '}
                                            <span className="font-semibold text-green-600">
                                                {highlight.to}
                                            </span>
                                        </p>
                                        <p className="text-gray-800 mt-1">
                                            {highlight.message}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {highlight.time_ago}
                                    </span>
                                </div>
                                
                                {highlight.reactions && (
                                    <div className="flex items-center mt-3 space-x-4">
                                        {Object.entries(highlight.reactions).map(([type, count]) => (
                                            count > 0 && (
                                                <div 
                                                    key={type} 
                                                    className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded"
                                                >
                                                    <span>{getReactionIcon(type)}</span>
                                                    <span className="text-sm text-gray-600">{count}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentHighlights;