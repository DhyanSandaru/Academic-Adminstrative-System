import React from "react";

export default function GraphCard({ 
  title, 
  chart: ChartComponent, 
  data, 
  height = "h-80", 
  width = "w-120" 
}) {
  return (
    <div className={`bg-white px-5 pt-10 ${height} ${width} rounded-lg shadow-md flex flex-col`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          {title}
        </h2>
      )}
      <div className="flex-1">
        <ChartComponent data={data} />
      </div>
    </div>
  );
}
