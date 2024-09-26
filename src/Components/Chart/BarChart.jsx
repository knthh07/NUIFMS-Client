import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

// Lazy load the BarChart component
const BarChart = lazy(() => import('@mui/x-charts/BarChart'));

export default function BarChartGraph() {
  const [data, setData] = useState({
    semesters: [],
    chartData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/jobOrders/ByDepartmentAndSemester');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching job requests data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
      }}
    >
      <Typography variant="subtitle1" align="center" className="chart-title">
        Number of Job Requests in a Semester per Department
      </Typography>
      
      {/* Show a loading message while data is being fetched */}
      {data.chartData.length === 0 ? (
        <Typography variant="body1" align="center">
          Loading data...
        </Typography>
      ) : (
        <Suspense fallback={<Typography variant="body1" align="center">Loading chart...</Typography>}>
          <BarChart
            series={data.chartData}
            height={200}  // Reduced height for faster initial rendering
            xAxis={[{ data: data.semesters, scaleType: 'band' }]}
            margin={{ top: 50, bottom: 40, left: 60, right: 20 }}  // Adjusted margins
            colors={['#4caf50', '#ff9800', '#f44336', '#2196f3']}
            sx={{
              '& .MuiChart-legend': {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              },
              '& .MuiChart-root': {
                padding: '20px',
              },
              '& .MuiChart-bar': {
                borderRadius: '4px',
              },
              '& .MuiChart-xAxis, & .MuiChart-yAxis': {
                '& .MuiChart-tickLabel': {
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  fill: '#333',
                },
              },
            }}
          />
        </Suspense>
      )}
    </Box>
  );
}
