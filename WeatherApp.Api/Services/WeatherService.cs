using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Runtime.Caching;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WeatherApp.Api.Models.Dto;
using WeatherApp.Api.Models.WeatherApi;

namespace WeatherApp.Api.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _locationLatLon;
        private readonly MemoryCache _cache;

        public WeatherService()
        {
            _httpClient = new HttpClient();
            _apiKey = System.Configuration.ConfigurationManager.AppSettings["WeatherApiKey"];
            _locationLatLon = System.Configuration.ConfigurationManager.AppSettings["WeatherLocationLatLon"] ?? "55.7558,37.6176";
            _cache = MemoryCache.Default;
        }

        public async Task<WeatherDataDto> GetWeatherDataAsync()
        {
            string cacheKey = $"WeatherData_{_locationLatLon}";
            if (_cache.Get(cacheKey) is WeatherDataDto cachedData)
                return cachedData;

            string currentUrl = $"https://api.weatherapi.com/v1/current.json?key={_apiKey}&q={_locationLatLon}";
            string forecastUrl = $"https://api.weatherapi.com/v1/forecast.json?key={_apiKey}&q={_locationLatLon}&days=3&aqi=no&alerts=no";

            WeatherApiResponse currentResponse = await GetWeatherApiResponseAsync(currentUrl);
            WeatherApiResponse forecastResponse = await GetWeatherApiResponseAsync(forecastUrl);

            var result = new WeatherDataDto
            {
                Current = MapCurrent(currentResponse),
                HourlyForecast = MapHourly(forecastResponse),
                DailyForecast = MapDaily(forecastResponse)
            };

            _cache.Set(cacheKey, result, DateTimeOffset.UtcNow.AddMinutes(10));
            return result;
        }

        private async Task<WeatherApiResponse> GetWeatherApiResponseAsync(string url)
        {
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Error while requesting WeatherAPI: {response.StatusCode}");
            }

            string json = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonConvert.DeserializeObject<WeatherApiResponse>(json);
            if (apiResponse == null)
            {
                throw new Exception("WeatherAPI returned an empty response.");
            }

            return apiResponse;
        }

        private CurrentWeatherDto MapCurrent(WeatherApiResponse apiResponse)
        {
            return new CurrentWeatherDto
            {
                City = apiResponse.Location.Name,
                Temperature = apiResponse.Current.TempC,
                ConditionText = apiResponse.Current.Condition.Text,
                IconUrl = "https:" + apiResponse.Current.Condition.Icon,
                WindKph = apiResponse.Current.WindKph,
                Humidity = apiResponse.Current.Humidity
            };
        }

        private List<HourlyForecastDto> MapHourly(WeatherApiResponse apiResponse)
        {
            var result = new List<HourlyForecastDto>();
            var now = DateTime.Now;
            if (apiResponse?.Forecast?.Forecastday == null || apiResponse.Forecast.Forecastday.Count == 0)
            {
                return result;
            }

            // Current day
            var todayForecast = apiResponse.Forecast.Forecastday[0];
            var todayHours = todayForecast.Hour
                .Where(h => DateTime.TryParseExact(h.Time, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime hourTime)
                            && hourTime >= now)
                .Select(h => new HourlyForecastDto
                {
                    Time = DateTime.ParseExact(h.Time, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture).ToString("HH:mm"),
                    Temperature = h.TempC,
                    IconUrl = "https:" + h.Condition.Icon,
                    ConditionText = h.Condition.Text
                });

            result.AddRange(todayHours);

            // Next day
            if (apiResponse.Forecast.Forecastday.Count > 1)
            {
                var nextDayHours = apiResponse.Forecast.Forecastday[1].Hour
                    .Select(h => new HourlyForecastDto
                    {
                        Time = DateTime.ParseExact(h.Time, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture).ToString("HH:mm"),
                        Temperature = h.TempC,
                        IconUrl = "https:" + h.Condition.Icon,
                        ConditionText = h.Condition.Text
                    });
                result.AddRange(nextDayHours);
            }

            return result;
        }

        private List<DailyForecastDto> MapDaily(WeatherApiResponse apiResponse)
        {
            if (apiResponse?.Forecast?.Forecastday == null)
            {
                return new List<DailyForecastDto>();
            }

            return apiResponse.Forecast.Forecastday.Select(day => new DailyForecastDto
            {
                DayOfWeek = DateTime.Parse(day.Date).ToString("dddd"),
                MaxTemp = day.Day.MaxtempC,
                MinTemp = day.Day.MintempC,
                IconUrl = "https:" + day.Day.Condition.Icon,
                ConditionText = day.Day.Condition.Text
            }).ToList();
        }
    }
}