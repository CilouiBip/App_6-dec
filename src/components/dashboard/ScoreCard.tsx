import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getScoreColor } from '../../utils/calculations';

interface ScoreCardProps {
  title: string;
  score: number;
  totalKPIs: number;
  alertKPIs: number;
  onClick: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  totalKPIs, 
  alertKPIs, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {score >= 7 ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-gray-400">Score Global</span>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total KPIs</span>
            <span className="text-white">{totalKPIs}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">En Alerte</span>
            <span className="text-red-500 font-medium">{alertKPIs}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ScoreCard;