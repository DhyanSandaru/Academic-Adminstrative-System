import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { User, ShieldUser, ClipboardPlus, CircleDollarSign, GraduationCap, Loader } from "lucide-react";
import FlashCard from "../components/FlashCard";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { studentData, courseDistribution, paymentData } from "./studentData.js";

export default function Dashboard() {
  const [showGreeting, setShowGreeting] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const fullText = "Heello admin123, welcome back!";

  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowGreeting(false);
        }, 1500);
      }
    }, 70);

    return () => clearInterval(typingInterval);
  }, []);


  if (showGreeting) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f4f8] transition-opacity duration-500">
        <h1 className="text-3xl font-bold text-[#253d90] animate-fade-in">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>
      </div>
    );
  }

  // Show the real dashboard content after animation
  return (
    <Layout title="Dashboard">
      <div className="">
        <div className="bg-white p-5 rounded-xl text-start">
          <p className="text-gray-500">Welcome back</p>
          <h2 className="text-black font-semibold">Admin123</h2>
        </div>
      </div>
      <div className="flex flex-row gap-3 flex-wrap     overflow-hidden w-full">
        <FlashCard
          icon={User}
          title="Total Students"
          value="1030"
          onRemove={() => console.log("Remove student card")}
          theme="blue"
          changedNo="+30"
          percentage="+0.03"
        />
        <FlashCard
          icon={ShieldUser}
          title="Total Lecturers"
          value="11"
          onRemove={() => console.log("Remove student card")}
          theme="purple"
          changedNo='+1'
          percentage='+10'
        />
        <FlashCard
          icon={GraduationCap}
          title="Available Courses"
          value="10"
          onRemove={() => console.log("Remove student card")}
          theme="red"
        />
        <FlashCard
          icon={ClipboardPlus}
          title="New Students"
          value="50"
          onRemove={() => console.log("Remove student card")}
          theme="yellow"
        />
        <FlashCard
          icon={CircleDollarSign}
          title="Month Payments"
          value="$50,000"
          onRemove={() => console.log("Remove student card")}
          theme="green"
          changedNo="+$10,000"
          percentage='+20'
        />
        <FlashCard
          icon={Loader}
          title="Pending Payments"
          value="20"
          onRemove={() => console.log("Remove student card")}
          theme="blue"
        />
      </div>

      <div className="w-full flex flex-wrap gap-5">
        
        <div className="w-full flex flex-row flex-wrap gap-6 mt-6">
          {/* LEFT SECTION (Line + Bar) */}
          <div className="flex flex-wrap gap-6 flex-1 min-w-[600px]">
            {/* Student Registrations */}
            <div className="bg-white px-5 pt-8 rounded-lg shadow-md flex-1 min-w-[300px] h-80">
              <Line
                data={{
                  labels: studentData.map((data) => data.labels),
                  datasets: [
                    {
                      label: "No of Registrations",
                      data: studentData.map((data) => data.noOfReg),
                      backgroundColor: "#0c5aeb",
                      borderColor: "#0c5aeb",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>

            {/* Course Distribution */}
            <div className="bg-white px-5 pt-8 rounded-lg shadow-md flex-1 min-w-[300px] h-80">
              <Bar
                data={{
                  labels: courseDistribution.map((data) => data.course),
                  datasets: [
                    {
                      label: "No of Students",
                      data: courseDistribution.map((data) => data.students),
                      backgroundColor: ["#ff8080", "#8280ff", "#80ff91"],
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>

            {/* Total Payments */}
            <div className="bg-white px-5 pt-8 rounded-lg shadow-md flex-1 min-w-[300px] h-80">
              <Line
                data={{
                  labels: studentData.map((data) => data.labels),
                  datasets: [
                    {
                      label: "Total Payments",
                      data: studentData.map((data) => data.totalPayment),
                      backgroundColor: "#F2181A",
                      borderColor: "#F2181A",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>

          {/* RIGHT SECTION (Doughnut Chart) */}
          <div className="bg-white px-5 py-10 rounded-lg shadow-md flex flex-col items-center justify-center h-[40rem] w-[25rem] gap-y-7">
            <div className="h-[20rem] w-[25rem]">
              <Doughnut
                data={{
                  labels: paymentData.map((data) => data.label),
                  datasets: [
                    {
                      label: "Payment Distribution",
                      data: paymentData.map((data) => data.amount),
                      backgroundColor: ["#80ff91","#ff8080"],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
            <div className="h-[20rem] w-[25rem]">
              <Doughnut
                data={{
                  labels: paymentData.map((data) => data.label),
                  datasets: [
                    {
                      label: "Payment Distribution",
                      data: paymentData.map((data) => data.amount),
                      backgroundColor: ["#8280ff","#a974db"],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
            
          </div>
        </div>

      </div>
    </Layout>
  );
}
