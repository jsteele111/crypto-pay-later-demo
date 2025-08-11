// src/Chart.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function generateFakeData() {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now.getTime() - (19 - i) * 60000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: parseFloat((30000 + Math.random() * 2000 - 1000).toFixed(2)),
  }));
}

function Chart() {
  const [data, setData] = useState(generateFakeData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        const newTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const newPrice = parseFloat(
          (30000 + Math.random() * 2000 - 1000).toFixed(2)
        );
        newData.push({ time: newTime, price: newPrice });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl h-80 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">BTC Price (USD)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 120000]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0052ff"
            strokeWidth={2.5}
            dot={false}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
