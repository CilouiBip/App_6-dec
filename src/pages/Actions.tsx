import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import { AuditItem } from '../types/airtable';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface GroupedAuditItems {
  [fonction: string]: {
    [problem: string]: {
      [subProblem: string]: {
        [category: string]: AuditItem[];
      };
    };
  };
}

const Actions = () => {
  const [expandedSections, setExpandedSections] = useState<{
    functions: string[];
    problems: string[];
    subProblems: string[];
    categories: string[];
  }>({
    functions: [],
    problems: [],
    subProblems: [],
    categories: []
  });
  
  const { data: auditItems, isLoading, error } = useQuery({
    queryKey: ['auditItems'],
    queryFn: api.fetchAuditItems
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!auditItems?.length) return <div>No audit items found</div>;

  // Group items hierarchically
  const groupedItems = auditItems.reduce((acc: GroupedAuditItems, item) => {
    const { Fonction_Name, Problems_Name, Sub_Problems_Name, Categorie_Problems_Name } = item;
    
    if (!acc[Fonction_Name]) acc[Fonction_Name] = {};
    if (!acc[Fonction_Name][Problems_Name]) acc[Fonction_Name][Problems_Name] = {};
    if (!acc[Fonction_Name][Problems_Name][Sub_Problems_Name]) {
      acc[Fonction_Name][Problems_Name][Sub_Problems_Name] = {};
    }
    if (!acc[Fonction_Name][Problems_Name][Sub_Problems_Name][Categorie_Problems_Name]) {
      acc[Fonction_Name][Problems_Name][Sub_Problems_Name][Categorie_Problems_Name] = [];
    }

    acc[Fonction_Name][Problems_Name][Sub_Problems_Name][Categorie_Problems_Name].push(item);
    return acc;
  }, {});

  const toggleSection = (type: keyof typeof expandedSections, id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Actions à auditer</h1>
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([fonction, problems]) => (
          <div key={fonction} className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
            {/* Function Level */}
            <button
              onClick={() => toggleSection('functions', fonction)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
            >
              <h2 className="text-lg font-medium text-white">{fonction}</h2>
              {expandedSections.functions.includes(fonction) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedSections.functions.includes(fonction) && (
              <div className="px-6 pb-4 space-y-4">
                {Object.entries(problems).map(([problem, subProblems]) => (
                  <div key={problem} className="bg-[#1A1B21] rounded-lg overflow-hidden">
                    {/* Problem Level */}
                    <button
                      onClick={() => toggleSection('problems', problem)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
                    >
                      <h3 className="text-white">{problem}</h3>
                      {expandedSections.problems.includes(problem) ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {expandedSections.problems.includes(problem) && (
                      <div className="px-4 pb-3 space-y-3">
                        {Object.entries(subProblems).map(([subProblem, categories]) => (
                          <div key={subProblem} className="bg-[#1E1F26] rounded-lg overflow-hidden">
                            {/* Sub-Problem Level */}
                            <button
                              onClick={() => toggleSection('subProblems', subProblem)}
                              className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
                            >
                              <h4 className="text-gray-200 text-sm">{subProblem}</h4>
                              {expandedSections.subProblems.includes(subProblem) ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </button>

                            {expandedSections.subProblems.includes(subProblem) && (
                              <div className="px-3 pb-2 space-y-2">
                                {Object.entries(categories).map(([category, items]) => (
                                  <div key={category} className="bg-[#222329] rounded-lg overflow-hidden">
                                    {/* Category Level */}
                                    <button
                                      onClick={() => toggleSection('categories', category)}
                                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
                                    >
                                      <h5 className="text-gray-300 text-sm">{category}</h5>
                                      {expandedSections.categories.includes(category) ? (
                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      )}
                                    </button>

                                    {expandedSections.categories.includes(category) && (
                                      <div className="px-3 pb-2 space-y-2">
                                        {items.map((item) => (
                                          <div
                                            key={item.Item_ID}
                                            className="bg-[#2D2E3A] rounded-lg p-3"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-white text-sm">{item.Item_Name}</span>
                                              <select
                                                value={item.Status}
                                                onChange={(e) => {/* TODO: Add status update handler */}}
                                                className="bg-[#1A1B21] text-white border-0 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-violet-500"
                                              >
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                              </select>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actions;