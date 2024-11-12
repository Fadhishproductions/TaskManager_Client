import React, { useEffect, useState } from 'react';
import { useGetTaskStatisticsQuery } from '../slices/apiSlice';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const TaskStatisticsChart = () => {
  const { data, error, isLoading } = useGetTaskStatisticsQuery();
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.totalTasks > 0) {
      setChartData([
        { name: 'Completed', value: data.completedTasks },
        { name: 'Pending', value: data.pendingTasks },
        { name: 'Total', value: data.totalTasks },
      ]);
    } else {
      setChartData([]); // Clear chart data if there are no tasks
    }
  }, [data]);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>Task Overview</h3>
      {isLoading ? (
        <p>Loading your task statistics...</p>
      ) : error ? (
        <p>Error loading statistics. Please try again later.</p>
      ) : data && data.totalTasks > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div style={{ padding: '20px', fontSize: '16px', color: '#555' }}>
          <p>No tasks created yet.</p>
          <p>Start adding tasks to see your progress here.</p>
          <Button variant="primary" onClick={() => navigate('/home')}>
            Go to Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskStatisticsChart;
