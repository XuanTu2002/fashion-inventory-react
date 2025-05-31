import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [exportAmount, setExportAmount] = useState("");
  const [importAmount, setImportAmount] = useState("");
  const [lowStockCategories, setLowStockCategories] = useState(0);
  const [categories, setCategories] = useState([]);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
    fetchCategoriesData();
    fetchMonthlyExportImportData();
  }, []);

  // Fetching all dashboard data in one call
  const fetchDashboardData = () => {
    fetch(`http://localhost:4000/api/dashboard`)
      .then((response) => response.json())
      .then((data) => {
        setExportAmount(data.monthlyExports);
        setImportAmount(data.monthlyImports);
        setLowStockCategories(data.lowStockCategories);
      })
      .catch((err) => console.log("Dashboard data fetch error:", err));
  };

  // Fetching all categories data
  const fetchCategoriesData = () => {
    fetch(`http://localhost:4000/api/category/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log("Categories fetch error:", err));
  };

  // Fetching Monthly Exports and Imports for Chart
  const fetchMonthlyExportImportData = () => {
    // This is a placeholder until you implement this endpoint
    // Ideally you'd have an endpoint that returns monthly data for both imports and exports
    fetch(`http://localhost:4000/api/export/monthly`)
      .then((response) => response.json())
      .then((exportData) => {
        // Example series data structure
        setChart({
          ...chart,
          series: [
            {
              name: "Monthly Exports",
              data: exportData.exportAmount || [0,0,0,0,0,0,0,0,0,0,0,0]
            },
            {
              name: "Monthly Imports",
              data: [10, 15, 25, 30, 45, 40, 55, 40, 45, 60, 75, 65] // Mock data until we have real data
            }
          ]
        });
      })
      .catch((err) => console.log("Monthly data fetch error:", err));
  };

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4  p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Xuất hàng (tháng)
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                ₫{exportAmount.toLocaleString('vi-VN')}
              </span>

              <span className="text-xs text-gray-500"> giá trị xuất hàng </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Nhập hàng (tháng)
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                ₫{importAmount.toLocaleString('vi-VN')}
              </span>

              <span className="text-xs text-gray-500"> giá trị nhập hàng </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Tổng danh mục
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {categories.length}
              </span>

              <span className="text-xs text-gray-500"> danh mục </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sản phẩm sắp hết hàng
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {lowStockCategories}
              </span>

              <span className="text-xs text-gray-500"> danh mục </span>
            </p>
          </div>
        </article>
        <div className="flex justify-center bg-white rounded-lg py-8 col-span-full">
          <div>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="500"
            />
          </div>
          <div>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
