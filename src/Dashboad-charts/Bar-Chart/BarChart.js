import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import fetcher from "../../fetcher";

const BarChart = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetcher.get("/api/users");
      setUsersData(response?.data?.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getRoleCount = (role) => {
    return usersData.filter((user) => user.role === role).length;
  };

  const roles = usersData.map((user) => user.role);
  const uniqueRoles = Array.from(new Set(roles));

  const chartData = {
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: uniqueRoles,
      },
    },
    series: [
      {
        name: "Number of Users",
        data: uniqueRoles.map((role) => getRoleCount(role)),
      },
    ],
  };

  return (
    <div
      style={{
        background: "#fff",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        height: "346px",
        marginRight:"25px"
      }}
    >
      <h3>Bar Chart For Available Users</h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width={500}
        height={320}
      />
    </div>
  );
};

export default BarChart;
