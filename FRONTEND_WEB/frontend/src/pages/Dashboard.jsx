import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import AlertsList from '../components/Dashboard/AlertsList';
import MapView from '../components/Dashboard/MapView';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView />
        </div>
        <div>
          <AlertsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
