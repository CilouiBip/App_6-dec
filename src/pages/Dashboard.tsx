import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import GlobalScoreCard from '../components/dashboard/GlobalScoreCard';
import FunctionScoreCard from '../components/dashboard/FunctionScoreCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { data: globalScore, isLoading: isGlobalScoreLoading, error: globalScoreError } = useQuery({
    queryKey: ['globalScore'],
    queryFn: api.fetchGlobalScore,
  });

  const { data: functionScores, isLoading: isFunctionScoresLoading, error: functionScoresError } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores,
  });

  if (isGlobalScoreLoading || isFunctionScoresLoading) return <LoadingSpinner />;
  if (globalScoreError || functionScoresError)
    return <ErrorMessage error={(globalScoreError || functionScoresError) as Error} />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <BarChart2 className="h-8 w-8 text-violet-500" />
        <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
      </div>

      {globalScore && <GlobalScoreCard score={globalScore} />}

      {functionScores && functionScores.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Performance by Function</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {functionScores.map((score) => (
              <FunctionScoreCard key={score.Name} score={score} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;