import React from 'react';
import Chart from 'react-apexcharts';

const SalesChart = ({ data }) => {
  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#4F46E5'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: data.categories,
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: (value) => `₦${value}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `₦${value}`
      }
    },
    grid: {
      borderColor: '#E5E7EB'
    }
  };

  const series = [{
    name: 'Sales',
    data: data.series
  }];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Orders Over Time</h3>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={350} 
      />
    </div>
  );
};

export default SalesChart;