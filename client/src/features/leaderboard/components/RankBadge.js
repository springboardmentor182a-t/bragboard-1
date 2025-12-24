import React from 'react';

const RankBadge = ({ rank }) => {
    const getRankStyle = (rank) => {
        switch(rank) {
            case 1:
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    border: 'border-yellow-300',
                    icon: '🥇'
                };
            case 2:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300',
                    icon: '🥈'
                };
            case 3:
                return {
                    bg: 'bg-orange-100',
                    text: 'text-orange-800',
                    border: 'border-orange-300',
                    icon: '🥉'
                };
            default:
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-800',
                    border: 'border-blue-200',
                    icon: rank
                };
        }
    };

    const style = getRankStyle(rank);

    return (
        <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full border-2 ${style.bg} ${style.border} ${style.text} font-bold`}>
            {rank <= 3 ? style.icon : `#${rank}`}
        </div>
    );
};

export default RankBadge;