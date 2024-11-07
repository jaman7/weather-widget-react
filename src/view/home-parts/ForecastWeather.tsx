import LazyImage from 'common/LazyImage';
import React, { memo, useCallback, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import { IForecast } from 'view/Home.model';

interface IProps {
  forecast: IForecast[];
}

const ForecastWeather: React.FC<IProps> = ({ forecast }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const forecastTilesRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent): void => {
    setIsDragging(true);
    setStartX(e.pageX - forecastTilesRef.current!.offsetLeft);
    setScrollLeft(forecastTilesRef.current!.scrollLeft);
  };

  const handleMouseLeave = (): void => {
    setIsDragging(false);
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent): void => {
      if (!isDragging) return;
      const x = e.pageX - forecastTilesRef.current!.offsetLeft;
      const scroll = (x - startX) * 2;
      forecastTilesRef.current!.scrollLeft = scrollLeft - scroll;
    },
    [isDragging, startX, scrollLeft]
  );

  const labels =
    forecast?.map((f) => new Date((f?.dt as number) * 1000)?.toLocaleString('en-US', { weekday: 'short', hour: 'numeric' })) ?? [];
  const temperatureData = forecast?.map((f) => f?.main?.temp ?? null) ?? [];

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'line' as const,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: labels },
    yaxis: { title: { text: 'Temperature (°C)' } },
    markers: { size: 5, colors: ['#FF4560'] },
    fill: {
      type: 'gradient',
      gradient: { shade: 'light', type: 'vertical', opacityFrom: 0.7, opacityTo: 0.4 },
    },
    tooltip: { shared: true, intersect: false },
  };

  const chartSeries: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: temperatureData as (number | null)[],
    },
  ];

  return (
    <>
      <div className="forecast-weather">
        <h2>5-Day Forecast</h2>

        <div
          className="forecast-tiles"
          ref={forecastTilesRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {forecast?.map((entry, index) => (
            <div key={index} className="forecast-tile">
              <h3>{new Date((entry?.dt as number) * 1000).toLocaleString('en-US', { weekday: 'short', hour: 'numeric' })}</h3>
              <p>{entry?.weather?.[0]?.description}</p>
              <LazyImage
                src={`https://openweathermap.org/img/wn/${entry?.weather?.[0]?.icon}.png`}
                alt={entry?.weather?.[0]?.description ?? ''}
              />
              <p className="temperature">{Math.round(entry?.main?.temp ?? 0)}°C</p>
              <p>Feels like: {Math.round((entry?.main?.feels_like as number) ?? null)}°C</p>
              <p>Wind: {entry?.wind?.speed} m/s</p>
              <p>Humidity: {entry?.main?.humidity}%</p>
            </div>
          ))}
        </div>
      </div>
      <div className="temperature-chart">
        <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
      </div>
    </>
  );
};

export default memo(ForecastWeather, (prevProps, nextProps) => JSON.stringify(prevProps.forecast) === JSON.stringify(nextProps.forecast));
