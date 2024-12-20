import WeatherWidget from 'common/weather-widget/WeatherWidget';
import WrappedMapComponent from 'common/map/MapComponent';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ISearchData } from 'common/map/MapContext';
import axios from 'axios';
import { toHttpParams } from 'core/http/http.utils';
import { sunsetSunrise } from 'utils/utils';
import CurrentWeather from './home-parts/CurrentWeather';
import { IWeatherData } from './Home.model';
import ForecastWeather from './home-parts/ForecastWeather';
import { API_URL } from 'common/map/map.constants';
import './Home.scss';

const API_KEY = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [searchData, setSearchData] = useState<ISearchData | null>(null);
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const cities = useMemo(() => ['Lodz', 'Warszawa', 'Berlin', 'New York', 'London'], []);

  const fetchWeatherData = useCallback(() => {
    if (!searchData) return;

    const { city, latitude, longitude } = searchData;
    const paramOpts = { appid: API_KEY, units: 'metric' };
    const param1 = toHttpParams({ q: city, ...paramOpts });
    const param2 = toHttpParams({ lat: latitude, lon: longitude, ...paramOpts });

    axios
      .all([axios.get<any>(`${API_URL}/weather?${param1}`), axios.get<any>(`${API_URL}/forecast?${param2}`)])
      .then(([weather, forecast]) => {
        if (weather && forecast) {
          const sunset = sunsetSunrise(weather.data?.sys?.sunset || 0);
          const sunrise = sunsetSunrise(weather.data?.sys?.sunrise || 0);

          setWeatherData({
            ...weather.data,
            sunrise,
            sunset,
            city: forecast.data?.city || null,
            forecast: forecast.data?.list || [],
          });
        }
      })
      .catch(() => {
        setWeatherData(null);
      });
  }, [searchData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return (
    <>
      <div className="section banner">
        <div className="banner-content">
          <h1 className="orange-text">OpenWeather</h1>
        </div>
      </div>

      <div className="section px-0">
        <div className="grid-container grid-1-1 gap-0">
          <div className="weather-map-img"></div>
          <WeatherWidget cities={cities} className="p-3" />
        </div>
      </div>

      <WrappedMapComponent height="50vh" setSearchData={setSearchData} />

      {weatherData && <CurrentWeather weatherData={weatherData} />}

      {weatherData && weatherData?.forecast?.length && <ForecastWeather forecast={weatherData.forecast} />}
    </>
  );
};

export default Home;
