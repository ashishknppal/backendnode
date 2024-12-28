import React from "react";
import * as Image from "../image";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
function Dashboard() {
  // Sale Report
  const saledata = {
    labels: [
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
    datasets: [
      {
        label: "Sales",
        data: [25, 45, 32, 85, 65, 15, 52, 49, 96, 57, 74, 86],
        backgroundColor: "#5a28ab",
        borderColor: "#5a28ab",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [15, 35, 28, 70, 55, 10, 45, 42, 82, 50, 68, 79],
        backgroundColor: "#ff6384",
        borderColor: "#ff6384",
        borderWidth: 1,
      },
    ],
  };
  const saleoption = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$ ${context.raw} thousands`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
      y: {
        ticks: {
          callback: function (value) {
            return `$ ${value}`;
          },
        },
        title: {
          display: false,
          text: "$ (thousands)",
        },
      },
    },
  };

  // Purchase Report
  const purchasedata = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#5a28ab", "#ff6384"],
        hoverBackgroundColor: ["#5a28ab", "#ff6384"],
        borderWidth: 2,
      },
    ],
  };
  const purchaseoption = {
    responsive: true,
    cutout: "80%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#000",
        },
      },
    },
  };

  // Collections Report
  const collectiondata = {
    labels: [
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
    datasets: [
      {
        label: "Collection",
        data: [15, 30, 50, 40, 60, 80, 70, 90, 45, 89, 78, 65],
        fill: false,
        borderColor: "#5a28ab",
        backgroundColor: "#5a28ab",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };
  const collectionoption = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Payment Report
  const paymentdata = {
    labels: [
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
    datasets: [
      {
        label: "Payment",
        data: [40, 80, 10, 90, 305, 50, 46, 95, 28, 80, 32, 15],
        fill: false,
        borderColor: "#5a28ab",
        backgroundColor: "#5a28ab",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };
  const paymentoption = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        <div className="col-md-3">
          <div className="card px-2 py-4 ">
            <div className="cardimage">
              <img src={Image.TodaySale} alt="purchase" />
            </div>
            <div className="cardtext text-end">
              <p className="mb-0">Today Sale</p>
              <p className="mb-0">2,55,543</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card px-2 py-4 ">
            <div className="cardimage">
              <img src={Image.TodayPurchase} alt="purchase" />
            </div>
            <div className="cardtext text-end">
              <p className="mb-0">Today Purchase</p>
              <p className="mb-0">2,55,543</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card px-2 py-4 ">
            <div className="cardimage">
              <img src={Image.TodayCollection} alt="purchase" />
            </div>
            <div className="cardtext text-end">
              <p className="mb-0">Today Collection</p>
              <p className="mb-0">2,55,543</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card px-2 py-4 ">
            <div className="cardimage">
              <img src={Image.TodayPayment} alt="purchase" />
            </div>
            <div className="cardtext text-end">
              <p className="mb-0">Today Payment</p>
              <p className="mb-0">2,55,543</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row chartdiv">
        <div className="col-md-8">
          <div className=" bg-white my-2 p-4">
            <h5 className="mb-2 mx-2">Sale Report</h5>
            <Bar data={saledata} options={saleoption} />
          </div>
        </div>
        <div className="col-md-4">
          <div className=" bg-white my-2 p-4">
            <h5 className="mb-2 mx-2">Purchase Report</h5>
            <Doughnut data={purchasedata} options={purchaseoption} />
          </div>
        </div>
        <div className="col-md-6">
          <div className=" bg-white my-2 p-4">
            <h5 className="mb-2 mx-2">Collection Report</h5>
            <Line data={collectiondata} options={collectionoption} />
          </div>
        </div>
        <div className="col-md-6">
          <div className=" bg-white my-2 p-4">
            <h5 className="mb-2 mx-2">Payment Report</h5>
            <Line data={paymentdata} options={paymentoption} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
