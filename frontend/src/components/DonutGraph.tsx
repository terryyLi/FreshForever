import React from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

type DonutGraphProps = {
    dataSets: string[];
    graphTopic: string;
    dataVals: number[];
};

export function DonutGraph(props: DonutGraphProps) {
    const { dataSets, graphTopic, dataVals } = props;

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Food Count Per Category',
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const labels = dataSets;

  const dataset = {
    labels,
    datasets: [
      {
        label: graphTopic,
        data: dataVals,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={options} data={dataset} />;
}