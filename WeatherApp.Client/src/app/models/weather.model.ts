export interface CurrentWeather {
  city: string;
  temperature: number;
  conditionText: string;
  iconUrl: string;
  windKph: number;
  humidity: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  iconUrl: string;
  conditionText: string;
}

export interface DailyForecast {
  dayOfWeek: string;
  maxTemp: number;
  minTemp: number;
  iconUrl: string;
  conditionText: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}
