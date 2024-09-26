import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

// Skeleton component for perceived load time improvement
const SkeletonLoader = () => (
  <Box sx={{ height: '250px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}></Box>
);

export default function BarChartGraph() {
  const [data, setData] = useState({
    semesters: [],
    chartData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/jobOrders/ByDepartmentAndSemester');
        setData(response.data);
        setIsLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching job requests data", error);
        setIsLoading(false); // Stop loading even on error
      }
    };

    fetchData();
  }, []);

  // Memoize the data to avoid unnecessary re-renders
  const chartMemo = useMemo(() => data.chartData, [data.chartData]);
  const semesterMemo = useMemo(() => data.semesters, [data.semesters]);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" align="center" sx={{ marginBottom: '10px' }}>
        Number of Job Requests in a Semester per Department
      </Typography>

      {/* Show skeleton loader while loading */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <BarChart
          series={chartMemo}
          height={200} // Reduced chart height for faster paint
          xAxis={[{ data: semesterMemo, scaleType: 'band' }]}
          margin={{ top: 50, bottom: 50, left: 60, right: 20 }} // Reduced top margin for faster LCP
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
      )}
    </Box>
  );
}
