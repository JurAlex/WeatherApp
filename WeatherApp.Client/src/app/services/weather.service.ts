import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Адрес API бекенда; при разработке через прокси используем относительный путь
  private apiUrl = '/api/weather';

  constructor(private http: HttpClient) {}

  getWeather(): Observable<WeatherData> {
    console.log('[WeatherService] getWeather start', { apiUrl: this.apiUrl });
    return this.http
      .get<unknown>(this.apiUrl)
      .pipe(
        tap((raw) =>
          console.log('[WeatherService] raw response received', raw)
        )
      )
      .pipe(map((data) => this.normalizeWeatherData(data)))
      .pipe(
        tap((normalized) =>
          console.log('[WeatherService] normalized response', normalized)
        )
      )
      .pipe(catchError(this.handleError));
  }

  private normalizeWeatherData(data: unknown): WeatherData {
    const value = data as {
      current?: WeatherData['current'];
      hourlyForecast?: WeatherData['hourlyForecast'];
      dailyForecast?: WeatherData['dailyForecast'];
      Current?: {
        city?: string;
        City?: string;
        temperature?: number;
        Temperature?: number;
        conditionText?: string;
        ConditionText?: string;
        iconUrl?: string;
        IconUrl?: string;
        windKph?: number;
        WindKph?: number;
        humidity?: number;
        Humidity?: number;
      };
      HourlyForecast?: Array<{
        time?: string;
        Time?: string;
        temperature?: number;
        Temperature?: number;
        iconUrl?: string;
        IconUrl?: string;
        conditionText?: string;
        ConditionText?: string;
      }>;
      DailyForecast?: Array<{
        dayOfWeek?: string;
        DayOfWeek?: string;
        maxTemp?: number;
        MaxTemp?: number;
        minTemp?: number;
        MinTemp?: number;
        iconUrl?: string;
        IconUrl?: string;
        conditionText?: string;
        ConditionText?: string;
      }>;
    };

    const current = (value.current ?? value.Current ?? {}) as Record<string, unknown>;
    const hourly = (value.hourlyForecast ?? value.HourlyForecast ?? []) as Array<Record<string, unknown>>;
    const daily = (value.dailyForecast ?? value.DailyForecast ?? []) as Array<Record<string, unknown>>;

    return {
      current: {
        city: String((current['city'] ?? current['City'] ?? '') as string),
        temperature: Number((current['temperature'] ?? current['Temperature'] ?? 0) as number),
        conditionText: String((current['conditionText'] ?? current['ConditionText'] ?? '') as string),
        iconUrl: String((current['iconUrl'] ?? current['IconUrl'] ?? '') as string),
        windKph: Number((current['windKph'] ?? current['WindKph'] ?? 0) as number),
        humidity: Number((current['humidity'] ?? current['Humidity'] ?? 0) as number),
      },
      hourlyForecast: hourly.map((hour) => ({
        time: String((hour['time'] ?? hour['Time'] ?? '') as string),
        temperature: Number((hour['temperature'] ?? hour['Temperature'] ?? 0) as number),
        iconUrl: String((hour['iconUrl'] ?? hour['IconUrl'] ?? '') as string),
        conditionText: String((hour['conditionText'] ?? hour['ConditionText'] ?? '') as string),
      })),
      dailyForecast: daily.map((day) => ({
        dayOfWeek: String((day['dayOfWeek'] ?? day['DayOfWeek'] ?? '') as string),
        maxTemp: Number((day['maxTemp'] ?? day['MaxTemp'] ?? 0) as number),
        minTemp: Number((day['minTemp'] ?? day['MinTemp'] ?? 0) as number),
        iconUrl: String((day['iconUrl'] ?? day['IconUrl'] ?? '') as string),
        conditionText: String((day['conditionText'] ?? day['ConditionText'] ?? '') as string),
      })),
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[WeatherService] HTTP error', error);
    let errorMessage = 'Произошла ошибка при загрузке данных';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
