import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GlobalScore = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['globalScore'],
    queryFn: api.fetchGlobalScore
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!data) return null;

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <BarChart2 className="h-8 w-8 text-violet-500" />
          <h1 className="text-2xl font-bold text-white">Score Global</h1>
        </div>
        <div className={`text-6xl font-bold ${getScoreColor(data.Score_Global_Sur_10)}`}>
          {formatNumber(data.Score_Global_Sur_10)}
        </div>
      </div>
    </div>
  );
};

export default GlobalScore;