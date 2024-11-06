export interface ICoord {
  lon?: number;
  lat?: number;
}

export interface IWeather {
  id?: number;
  main?: string;
  description?: string;
  icon?: string;
}

export interface IWeatherMain {
  temp?: number;
  feels_like?: number;
  temp_min?: number;
  temp_max?: number;
  pressure?: number;
  humidity?: number;
}

export interface IWeatherWind {
  speed?: number;
  deg?: number;
}

export interface IWeatherSys {
  type?: number;
  id?: number;
  country?: string;
  sunrise?: number;
  sunset?: number;
}

export interface IWeatherCity {
  id?: number;
  name?: string;
  country?: string;
  coord?: ICoord;
}

export interface IWeatherClouds {
  all?: number;
}

export interface IForecast {
  dt?: number;
  main?: IWeatherMain;
  weather?: IWeather[];
  clouds?: IWeatherClouds;
  wind?: IWeatherWind;
  visibility?: number;
  pop?: number;
  dt_txt?: string;
}

export interface IWeatherData {
  coord?: ICoord;
  weather?: IWeather[];
  base?: string;
  main?: IWeatherMain;
  visibility?: number;
  wind?: IWeatherWind;
  clouds?: IWeatherClouds;
  dt?: number;
  sys?: IWeatherSys;
  timezone?: number;
  id?: number;
  name?: string;
  cod?: number;
  city?: IWeatherCity;
  sunrise?: string;
  sunset?: string;
  forecast?: IForecast[];
}
