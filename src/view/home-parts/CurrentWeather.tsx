import LazyImage from 'common/LazyImage';
import { days, months } from '../home.constants';
import { IWeatherData } from 'view/Home.model';
import { memo } from 'react';
interface IProps {
  weatherData?: IWeatherData | null;
}

const CurrentWeather: React.FC<IProps> = ({ weatherData }) => {
  const { name, sys, main, weather, wind, sunrise, sunset } = weatherData || {};

  const currentDate = new Date();
  const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  const temperature = Math.floor((main?.temp as number) ?? 0);

  const details = [
    { label: 'Temp Max', value: `${Math.floor((main?.temp_max as number) ?? null)}°` },
    { label: 'Temp Min', value: `${Math.floor((main?.temp_min as number) ?? null)}°` },
    { label: 'Wind', value: `${wind?.speed ?? null} m/s` },
    { label: 'Humidity', value: `${main?.humidity ?? null}%` },
    { label: 'Sunrise', value: sunrise },
    { label: 'Sunset', value: sunset },
  ];

  return (
    <>
      <div className="current-weather">
        <div className="column first-column">
          <h2>
            {name ?? ''}, {sys?.country ?? ''}
          </h2>
          <span>{date}</span>
        </div>

        <div className="column second-column">
          <div className="icon-column">
            <LazyImage src={`https://openweathermap.org/img/wn/${weather?.[0]?.icon}.png`} alt={weather?.[0]?.description ?? ''} />
          </div>
          <div className="temp-column">
            <p className="temperature">{temperature}&#176;</p>
            <p className="desc">{weather?.[0]?.description || 'No description'}</p>
          </div>
        </div>

        <div className="column third-column">
          {details?.map(({ label, value }) => (
            <div key={label} className="weather-detail">
              <p className="detail-value">{value}</p>
              <p className="detail-label">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(CurrentWeather);
