import WeatherWidget from 'common/weather-widget/WeatherWidget';
import WrappedMapComponent from 'common/map/MapComponent';
import './Home.scss';

const Home = () => {
  const cities = ['Lodz', 'Warszawa', 'Berlin', 'New York', 'London'];
  return (
    <>
      <div className="section banner">
        <div className="banner-content">
          <h1>
            <span className="orange-text">OpenWeather</span>
          </h1>
        </div>
      </div>

      <div className="section px-0">
        <div className="grid-container grid-1-1 gap-0">
          <div className="weather-map-img"></div>
          <WeatherWidget cities={cities} className="p-3" />
        </div>
      </div>

      <WrappedMapComponent height="50vh" />
    </>
  );
};

export default Home;
