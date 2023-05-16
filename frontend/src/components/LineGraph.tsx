import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
   } from 'chart.js';
   
   import { Line } from 'react-chartjs-2';
   
   ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
   );
   
   type LineGraphProps = {
    dataSets: string[];
       graphTopic: string;
       dataVals: number[];
   };
   
   export function LineGraph(props: LineGraphProps) {
       const { dataSets, graphTopic, dataVals } = props;
    const options = {
     responsive: true,
     plugins: {
      legend: {
       position: 'top' as const,
      },
      title: {
       display: true,
       text: 'Number of Food That Will Go Bad By Dates',
      },
     },
    };
   
    const labels = dataSets;
   
    const data = {
     labels,
     datasets: [
      {
       label: graphTopic,
       data: dataVals,
       borderColor: 'rgb(255, 99, 132)',
       backgroundColor: 'rgba(255, 99, 132, 1)',
      },
     ],
    };
    return <Line options={options} data={data} />;
   }