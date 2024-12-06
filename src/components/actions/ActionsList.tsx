import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Action } from '../../types/airtable';
import { api } from '../../api/airtable';
import ActionCard from './ActionCard';

interface ActionsListProps {
  actions: Action[];
}

const ActionsList: React.FC<ActionsListProps> = ({ actions }) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ actionId, status }: { actionId: string; status: Action['status'] }) =>
      api.updateActionStatus(actionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    }
  });

  const handleStatusChange = async (actionId: string, status: Action['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ actionId, status });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Group actions by category
  const groupedActions = actions.reduce((acc, action) => {
    const category = action.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(action);
    return acc;
  }, {} as Record<string, Action[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedActions).map(([category, categoryActions]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-medium text-white">{category}</h2>
          <div className="space-y-4">
            {categoryActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionsList;