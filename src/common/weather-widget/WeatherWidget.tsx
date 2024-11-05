import React, { useState, useEffect, useMemo } from 'react';
import ProgressCircle from './ProgressCircle';
import { API_URL } from './WeatherWidget.const';
import { IWeatherData, IWeatherResponse } from './weatherWidget.model';
import './WeatherWidget.scss';
import axios from 'axios';
import { toHttpParams } from 'core/http/http.utils';

interface WeatherWidgetProps {
  cities: string[];
  className: string;
}

const REFRESH_INTERVAL_SECONDS = 10;
const CITY_SELECTION_INTERVAL_SECONDS = 60;
const API_KEY = '2a4f75e7ac73979b61b5469c8447c642';

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ cities, className }) => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<IWeatherData[]>([]);
  const [tick, setTick] = useState(0);

  const refreshProgress = useMemo(
    () => ((REFRESH_INTERVAL_SECONDS - (tick % REFRESH_INTERVAL_SECONDS)) / REFRESH_INTERVAL_SECONDS) * 100,
    [tick]
  );

  const citySelectionProgress = useMemo(
    () => ((CITY_SELECTION_INTERVAL_SECONDS - (tick % CITY_SELECTION_INTERVAL_SECONDS)) / CITY_SELECTION_INTERVAL_SECONDS) * 100,
    [tick]
  );

  const refreshCountdown = useMemo(() => REFRESH_INTERVAL_SECONDS - (tick % REFRESH_INTERVAL_SECONDS), [tick]);
  const citySelectionCountdown = useMemo(() => CITY_SELECTION_INTERVAL_SECONDS - (tick % CITY_SELECTION_INTERVAL_SECONDS), [tick]);

  const fetchWeatherData = async (cities: string[]): Promise<IWeatherData[]> => {
    try {
      const requests = cities.map((city) => {
        const queryParams = toHttpParams({
          q: city,
          appid: API_KEY,
          units: 'metric',
        });
        return axios.get<IWeatherResponse>(`${API_URL}?${queryParams}`);
      });

      const responses = await axios.all(requests);
      return responses.map((response) => {
        const { id, name, main, weather } = response?.data || {};
        return {
          id,
          city: name ?? '',
          temp: main?.temp ?? null,
          description: weather[0].description,
          icon: `https://openweathermap.org/img/wn/${weather[0].icon}.png`,
        };
      });
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return [];
    }
  };

  const selectRandomCities = () => {
    return [...cities].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const updateWeatherData = async () => {
    const data = await fetchWeatherData(selectedCities);
    setWeatherData(data);
  };

  const updateSelectedCities = () => {
    setSelectedCities(selectRandomCities());
  };

  useEffect(() => {
    updateSelectedCities();
    updateWeatherData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prevTick) => prevTick + 1);

      if (tick % REFRESH_INTERVAL_SECONDS === 0) updateWeatherData();
      if (tick % CITY_SELECTION_INTERVAL_SECONDS === 0) updateSelectedCities();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick, selectedCities]);

  const openCity = (id?: number) => {
    if (id) window.open(`https://openweathermap.org/city/${id}`, '_blank');
  };

  return (
    <div className={'widget-container' + ' ' + className}>
      <div className="progress-container">
        <ProgressCircle title="Next to refresh" progress={refreshProgress} countdown={refreshCountdown} />
        <ProgressCircle title="Next to random city" progress={citySelectionProgress} countdown={citySelectionCountdown} />
      </div>

      {weatherData?.map((city) => (
        <div className={'widget'} key={city.id} onClick={() => openCity(city.id)}>
          <h3 className="city">{city.city}</h3>
          <div className="flex-center">
            <img className="img-fluid" src={city.icon} alt={city.description} />
          </div>
          <span className="temperature">{city.temp?.toFixed(1)}°C</span>
          <span className="description">{city.description}</span>
        </div>
      ))}
    </div>
  );
};

export default WeatherWidget;
