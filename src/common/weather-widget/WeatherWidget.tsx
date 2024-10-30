import React, { useState, useEffect } from 'react';
import ProgressCircle from './ProgressCircle';
import HttpService from 'core/http/http.service';
import { API_URL } from './WeatherWidget.const';
import { IWeatherData } from './weatherWidget.model';
import './WeatherWidget.scss';


interface WeatherWidgetProps {
  cities: string[];
  className: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ cities, className }) => {
  const [selectedCities, setSelectedCities] = useState<IWeatherData[]>([]);
  const [refreshCountdown, setRefreshCountdown] = useState(10);
  const [citySelectionCountdown, setCitySelectionCountdown] = useState(60);
  const [refreshProgress, setRefreshProgress] = useState(100);
  const [citySelectionProgress, setCitySelectionProgress] = useState(100);

  const httpService = new HttpService(API_URL);

  useEffect(() => {
    const refreshInterval = 10000;
    const citySelectionInterval = 60000;

    const fetchWeatherData = async () => {
      const citiesData = await Promise.all(
        getRandomCities().map(async city => {
          const data = await httpService.get<any>('', {
            q: city,
            appid: 'ae98d58d517252f2065829367d320dbb',
            units: 'metric'
          });

          // Map response data to IWeatherData format
          return {
            id: data.id,
            city: data?.name ?? '',
            temp: data?.main?.temp ?? null,
            description: data?.weather?.[0]?.description ?? '',
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          } as IWeatherData;
        })
      );
      setSelectedCities(citiesData);
    };


    const citySelectionTimer = setInterval(() => {
      setCitySelectionCountdown(citySelectionInterval / 1000);
      setCitySelectionProgress(100);
    }, citySelectionInterval);


    const refreshTimer = setInterval(() => {
      fetchWeatherData();
      setRefreshCountdown(refreshInterval / 1000);
      setRefreshProgress(100);
    }, refreshInterval);

    fetchWeatherData();


    const countdownTimer = setInterval(() => {
      setRefreshCountdown(prev => (prev > 1 ? prev - 1 : refreshInterval / 1000));
      setCitySelectionCountdown(prev => (prev > 1 ? prev - 1 : citySelectionInterval / 1000));
      setRefreshProgress((prev) => (prev > 0 ? prev - 100 / (refreshInterval / 1000) : 100));
      setCitySelectionProgress((prev) => (prev > 0 ? prev - 100 / (citySelectionInterval / 1000) : 100));
    }, 1000);

    return () => {
      clearInterval(refreshTimer);
      clearInterval(citySelectionTimer);
      clearInterval(countdownTimer);
    };
  }, [cities]);

  const getRandomCities = (): string[] => {
    return cities.length ? cities.sort(() => 0.5 - Math.random()).slice(0, 3) : [];
  };

  const openCity = (id?: number) => {
    if (id) window.open(`https://openweathermap.org/city/${id}`, '_blank');
  };

  return (
    <div className={'widget-container' + ' ' + className}>
      <div className="progress-container">
        <ProgressCircle title="Next to refresh" progress={refreshProgress} countdown={refreshCountdown} />
        <ProgressCircle title="Next to random city" progress={citySelectionProgress} countdown={citySelectionCountdown} />
      </div>

        {selectedCities.map((city) => (
          <div className={'widget'} key={city.id} onClick={() => openCity(city.id)}>
            <h3 className="city">{city.city}</h3>
            <div className="flex-center"><img className="img-fluid" src={city.icon} alt={city.description} /></div>
            <span className="temperature">{city.temp?.toFixed(1)}°C</span>
            <span className="description">{city.description}</span>
          </div>
        ))}

    </div>
  );
};

export default WeatherWidget;
