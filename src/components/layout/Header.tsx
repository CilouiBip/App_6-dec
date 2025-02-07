import React from 'react';
import { BarChart2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1C1D24] border-b border-[#2D2E3A] px-6 py-4">
      <div className="flex items-center space-x-3">
        <BarChart2 className="h-6 w-6 text-violet-500" />
        <span className="text-xl font-semibold text-white">InfoMetrics</span>
      </div>
    </header>
  );
};

export default Header;