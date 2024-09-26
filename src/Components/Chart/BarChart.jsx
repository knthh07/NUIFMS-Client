import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';  // No lazy loading
import axios from 'axios';

export default function BarChartGraph() {
  const [data, setData] = useState({
    semesters: [],
    chartData: []
  });
  const [isLoading, setIsLoading] = useState(true);  // Loading state to manage async data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/jobOrders/ByDepartmentAndSemester');
        setData(response.data);
        setIsLoading(false);  // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching job requests data", error);
        setIsLoading(false);  // Even if there's an error, stop loading
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
      <Typography variant="subtitle1" align="center" className="chart-title" sx={{ marginBottom: '10px' }}>
        Number of Job Requests in a Semester per Department
      </Typography>

      {isLoading ? (
        // Loading message while waiting for data
        <Typography variant="body1" align="center">
          Loading data...
        </Typography>
      ) : (
        <BarChart
          series={data.chartData}
          height={250}  // Chart height
          xAxis={[{ data: data.semesters, scaleType: 'band' }]}
          margin={{ top: 50, bottom: 40, left: 60, right: 20 }}  // Adjusted margins for layout
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
