import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import fetcher from "../../fetcher";

const BarChart2 = () => {
  const [bookingData, setBookingData] = useState([]);
  const [chartData, setChartData] = useState({ options: {}, series: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetcher.get("http://localhost:4000/api/rental");
        setBookingData(response?.data?.RentalData);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateChartData = () => {
      const statusCounts = {
        Completed: 0,
        Cancelled: 0,
        Booked: 0,
      };

      bookingData.forEach((booking) => {
        if (booking.status === "Completed") {
          statusCounts.Completed++;
        } else if (booking.status === "Cancel Booking") {
          statusCounts.Cancelled++;
        } else if (booking.status === "Booked") {
          statusCounts.Booked++;
        }
      });

      const totalBookings = Object.values(statusCounts).reduce(
        (total, count) => total + count,
        0
      );

      const seriesData = [
        (statusCounts.Completed / totalBookings) * 100,
        (statusCounts.Cancelled / totalBookings) * 100,
        (statusCounts.Booked / totalBookings) * 100,
      ];

      setChartData({
        options: {
          chart: {
            type: "pie",
            animations: {
              enabled: true, // Enable animations
              easing: "easeinout", // Animation easing
              speed: 800, // Animation speed
              animateGradually: {
                enabled: true,
                delay: 150, // Delay between each segment animation
              },
              dynamicAnimation: {
                enabled: true, // Enable dynamic animations
                speed: 350, // Dynamic animation speed
              },
            },
          },
          labels: ["Completed", "Cancel Booking", "Booked"],
          colors: ["#34c38f", "#f46a6a", "#556ee6"], // Custom colors for segments
          legend: {
            position: "bottom", // Position of the legend
          },
        },
        series: seriesData,
      });
    };

    if (bookingData.length > 0) {
      calculateChartData();
    }
  }, [bookingData]);

  console.log(chartData);

  return (
    <div
      style={{
        background: "#fff",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        marginRight:"25px"
      }}
    >
      <h3>Pie Chart For Bookings</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        width={500}
        height={320}
      />
    </div>
  );
};

export default BarChart2;
