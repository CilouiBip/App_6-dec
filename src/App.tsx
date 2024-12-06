import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import KPIList from './pages/KPIList';
import Actions from './pages/Actions';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-[#14151A]">
            <Header />
            <Navigation />
            <main className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/kpis" element={<KPIList />} />
                <Route path="/actions" element={<Actions />} />
              </Routes>
            </main>
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;