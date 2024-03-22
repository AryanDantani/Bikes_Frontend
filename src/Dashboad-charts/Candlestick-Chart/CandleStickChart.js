import React from "react";
import Chart from "react-apexcharts";

const CandlestickChart = () => {
  // Sample candlestick data
  const candlestickData = [
    {
      x: new Date(2022, 0, 1),
      y: [659, 807, 659, 792], // [Open, High, Low, Close]
    },
    {
      x: new Date(2022, 1, 1),
      y: [792, 964, 792, 947],
    },
    {
      x: new Date(2022, 2, 1),
      y: [947, 1080, 947, 1047],
    },
    // Add more data points as needed
  ];

  // Prepare the data for the chart
  const chartData = {
    options: {
      chart: {
        type: "candlestick",
      },
      xaxis: {
        type: "datetime",
      },
    },
    series: [
      {
        data: candlestickData,
      },
    ],
  };

  return (
    <div
      style={{
        background: "#fff",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          height:"346px"
      }}
    >
      <h3>Candle stick Chart</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="candlestick"
        width={500}
        height={320}
      />
    </div>
  );
};

export default CandlestickChart;
