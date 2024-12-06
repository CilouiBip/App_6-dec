import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/airtable';
import { KPI } from '../../types/airtable';
import { useDebounce } from '../../hooks/useDebounce';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import KPIGroupCard from './KPIGroupCard';

const KPIGroupedList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: kpis, isLoading, error } = useQuery<KPI[], Error>({
    queryKey: ['kpis'],
    queryFn: api.fetchKPIs
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!kpis) return null;

  // Group KPIs by function
  const groupedKPIs = kpis.reduce((acc, kpi) => {
    const fonction = kpi.Fonctions;
    if (!acc[fonction]) {
      acc[fonction] = [];
    }
    acc[fonction].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  // Filter KPIs based on search term
  const filteredGroups = Object.entries(groupedKPIs).reduce((acc, [fonction, kpis]) => {
    const filteredKPIs = kpis.filter(kpi => 
      kpi.Nom_KPI.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      fonction.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    if (filteredKPIs.length > 0) {
      acc[fonction] = filteredKPIs;
    }
    return acc;
  }, {} as Record<string, KPI[]>);

  const toggleGroup = (fonction: string) => {
    setExpandedGroups(prev => 
      prev.includes(fonction)
        ? prev.filter(f => f !== fonction)
        : [...prev, fonction]
    );
  };

  const toggleAllGroups = () => {
    setExpandedGroups(prev => 
      prev.length === Object.keys(filteredGroups).length
        ? []
        : Object.keys(filteredGroups)
    );
  };

  return (
    <div className="py-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Liste des KPIs</h1>
          <button
            onClick={toggleAllGroups}
            className="px-4 py-2 text-sm bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
          >
            {expandedGroups.length === Object.keys(filteredGroups).length
              ? 'Tout réduire'
              : 'Tout développer'}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un KPI ou une fonction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1C1D24] border border-[#2D2E3A] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(filteredGroups).map(([fonction, kpis]) => (
          <KPIGroupCard
            key={fonction}
            fonction={fonction}
            kpis={kpis}
            isExpanded={expandedGroups.includes(fonction)}
            onToggle={() => toggleGroup(fonction)}
          />
        ))}
      </div>
    </div>
  );
};

export default KPIGroupedList;