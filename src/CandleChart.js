import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export const CandleChart = ({ onPriceUpdate }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(); // keep track of chart instance

  useEffect(() => {
    // Avoid duplicate charts by clearing the container
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = ""; // clear existing chart
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#000000" },
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: "#777",
        timeVisible: true,
      },
      priceScale: {
        borderColor: "#777",
        mode: 0,
        autoScale: false,
        minValue: 100000,
        maxValue: 120000,
        ticksVisible: true,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceLineVisible: true,
      priceFormat: {
    type: 'custom',
    formatter: price => {
      return Math.round(price).toLocaleString(); // e.g., 112,450
    },
  },
    });

    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    const candleData = Array.from({ length: 150 }, (_, i) => {
      const base = 105000 + Math.random() * 10000;
      const high = base + Math.random() * 2000;
      const low = base - Math.random() * 2000;
      const open = base + Math.random() * 1000 - 500;
      const close = base + Math.random() * 1000 - 500;
      return {
        time: now - (149 - i) * oneDay,
        open,
        high,
        low,
        close,
      };
    });

    candleSeries.setData(candleData);

    // Update the price callback with the latest price
    if (onPriceUpdate && candleData.length > 0) {
      const latestCandle = candleData[candleData.length - 1];
      onPriceUpdate(latestCandle.close);
    }

    const interval = setInterval(() => {
      const last = candleData[candleData.length - 1];
      const nextTime = last.time + oneDay;
      const base = last.close + (Math.random() - 0.5) * 1000;
      const high = base + Math.random() * 1000;
      const low = base - Math.random() * 1000;
      const open = base + Math.random() * 500 - 250;
      const close = base + Math.random() * 500 - 250;
      const newCandle = {
        time: nextTime,
        open,
        high,
        low,
        close,
      };
      candleData.push(newCandle);
      candleSeries.update(newCandle);
      
      // Update the price callback with the new price
      if (onPriceUpdate) {
        onPriceUpdate(newCandle.close);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [onPriceUpdate]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px", position: "relative" }}
    />
  );
};
