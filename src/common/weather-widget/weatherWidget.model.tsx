export interface IWeatherMain {
  temp: number;
}

export interface IWeatherDescription {
  description: string;
  icon: string;
}

export interface IWeatherResponse {
  id: number;
  name: string;
  main: IWeatherMain;
  weather: IWeatherDescription[];
}

export interface IWeatherData {
  id?: number;
  city?: string;
  temp?: number;
  description?: string;
  icon?: string;
}
