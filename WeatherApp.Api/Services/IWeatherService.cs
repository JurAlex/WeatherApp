using System.Threading.Tasks;
using WeatherApp.Api.Models.Dto;

namespace WeatherApp.Api.Services
{
    public interface IWeatherService
    {
        Task<WeatherDataDto> GetWeatherDataAsync();
    }
}