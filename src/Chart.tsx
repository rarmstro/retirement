import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useData } from './DataContext'; // Import the DataContext

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChart: React.FC = () => {
  const { data } = useData();
  const { startYear = new Date().getFullYear(), lifeExpectancy = 88, age = 65 } = data;

  const endYear = startYear + (lifeExpectancy - age);
  const numYears = endYear - startYear + 1;
  const labels: string[] = [];
  for (let year = startYear; year <= endYear; year++) {
    labels.push(year.toString());
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'RRSP',
        data: Array(labels.length).fill(7), // Example data, replace with actual data from context if needed
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'TFSA',
        data: Array(labels.length).fill(10), // Example data, replace with actual data from context if needed
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'CPP/QPP',
        data: Array(labels.length).fill(5), // Example data, replace with actual data from context if needed
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Annual Retirement Assets',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default StackedBarChart;
