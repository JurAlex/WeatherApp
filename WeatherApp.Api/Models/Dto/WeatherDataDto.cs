using System.Collections.Generic;

namespace WeatherApp.Api.Models.Dto
{
    public class WeatherDataDto
    {
        public CurrentWeatherDto Current { get; set; }
        public List<HourlyForecastDto> HourlyForecast { get; set; }
        public List<DailyForecastDto> DailyForecast { get; set; }
    }

    public class CurrentWeatherDto
    {
        public string City { get; set; }
        public double Temperature { get; set; }
        public string ConditionText { get; set; }
        public string IconUrl { get; set; }
        public double WindKph { get; set; }
        public int Humidity { get; set; }
    }

    public class HourlyForecastDto
    {
        public string Time { get; set; }
        public double Temperature { get; set; }
        public string IconUrl { get; set; }
        public string ConditionText { get; set; }
    }

    public class DailyForecastDto
    {
        public string DayOfWeek { get; set; }
        public double MaxTemp { get; set; }
        public double MinTemp { get; set; }
        public string IconUrl { get; set; }
        public string ConditionText { get; set; }
    }
}