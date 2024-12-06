import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Action } from '../../types/airtable';

interface ActionCardProps {
  action: Action;
  onStatusChange: (id: string, status: Action['status']) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onStatusChange }) => {
  const getStatusIcon = () => {
    switch (action.status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-white">{action.name}</h3>
          {action.subProblem && (
            <p className="text-sm text-gray-400 mt-1">{action.subProblem}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={action.status}
            onChange={(e) => onStatusChange(action.id, e.target.value as Action['status'])}
            className="bg-[#2D2E3A] text-white border-0 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-violet-500"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ActionCard;