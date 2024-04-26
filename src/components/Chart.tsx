import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';

export default function Chart({ data }) {
  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  const chartData = [
    {
      data: data?.map?.((d) => ({
        x: new Date(d[0]),
        y: [
          parseFloat(d[1]),
          parseFloat(d[2]),
          parseFloat(d[3]),
          parseFloat(d[4]),
        ],
      })),
    },
  ];

  return (
    <Card title="Candlestick Chart">
      <div id="chart">
        <ReactApexChart
          options={options}
          series={chartData || []}
          type="candlestick"
          height={380}
        />
      </div>
      <div id="html-dist"></div>
    </Card>
  );
}
