using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using WeatherApp.Api.Services;

namespace WeatherApp.Api.Controllers
{
    [RoutePrefix("api/weather")]
    public class WeatherController : ApiController
    {
        private readonly IWeatherService _weatherService;

        public WeatherController()
        {
            _weatherService = new WeatherService();
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetWeather()
        {
            try
            {
                var data = await _weatherService.GetWeatherDataAsync();
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
            catch (Exception ex)
            {
                // ex.Message can be logged here
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Failed to retrieve weather data. Please try again later.");
            }
        }
    }
}