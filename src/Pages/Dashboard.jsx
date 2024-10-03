// src/Pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import SideNav from '../Components/sidenav/SideNav';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import AnalyticsDashboard from '../Components/DataAnalytics/AnalyticsDashboard';
import BarChart from '../Components/Chart/BarChart';
import PieChart from '../Components/Chart/PieChart';
import LineChart from '../Components/Chart/LineChart';
import AnnalyticsDashboard from '../Components/DataAnalytics/AnalyticsDashboard';

const Dashboard = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // This is where you can make your API call or logic for fetching recommendations
    const fetchRecommendations = () => {
      // Example recommendations; replace this with your real logic
      setRecommendations([
        {
          office: 'Health Services',
          scenario: 'Broken',
          object: 'Computer',
          action: 'Change the light bulb to improve work efficiency.',
        },
        {
          office: 'Logistics',
          scenario: 'Leaking',
          object: 'Roof',
          action: 'Fix the leaking roof to avoid further damage.',
        },
      ]);
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="flex">
      <SideNav />
      <div className="flex flex-col w-full ml-0 md:ml-[20.5%] mr-3">
        <div className="flex flex-col p-5 bg-gray-100 mt-3">
          <Grid container spacing={3} className="mb-5">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="COA" value="0" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="CCIT" value="0" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="COE" value="0" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="COM" value="0" />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChartCard>
                <BarChart />
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard>
                <PieChart />
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AnnalyticsDashboard recommendations={recommendations} />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <Card className="bg-white shadow-md rounded-md">
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ children, className }) => {
  return (
    <Card className={`bg-white shadow-md rounded-md ${className}`}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Dashboard;
