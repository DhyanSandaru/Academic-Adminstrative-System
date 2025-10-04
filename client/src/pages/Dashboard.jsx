import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddCourses from "../components/AddCourses.jsx";
import CalculateSalary from "../components/CalculateSalary.jsx";
import PaymentReceipt from '../components/PaymentReceipt.jsx'

export default function Dashboard() {
  const [showGreeting, setShowGreeting] = useState(true);
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
    </Layout>
  );
}
