import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, ClipboardList } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#1C1D24] border-b border-[#2D2E3A] px-6 py-2">
      <div className="flex space-x-6">
        <Link
          to="/"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/'
              ? 'bg-violet-500/10 text-violet-500'
              : 'text-gray-400 hover:text-white hover:bg-[#2D2E3A]'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link
          to="/kpis"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/kpis'
              ? 'bg-violet-500/10 text-violet-500'
              : 'text-gray-400 hover:text-white hover:bg-[#2D2E3A]'
          }`}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="font-medium">KPIs</span>
        </Link>
        <Link
          to="/actions"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === '/actions'
              ? 'bg-violet-500/10 text-violet-500'
              : 'text-gray-400 hover:text-white hover:bg-[#2D2E3A]'
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          <span className="font-medium">Actions</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;