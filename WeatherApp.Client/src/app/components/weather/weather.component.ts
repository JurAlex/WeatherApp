import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { WeatherData } from '../../models/weather.model';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
})
export class WeatherComponent implements OnInit {
  weatherData: WeatherData | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('[WeatherComponent] ngOnInit start', {
      isBrowser: isPlatformBrowser(this.platformId),
    });
    if (isPlatformBrowser(this.platformId)) {
      console.log('[WeatherComponent] Calling loadWeather from ngOnInit');
      await this.loadWeather();
    }
    console.log('[WeatherComponent] ngOnInit end', {
      loading: this.loading,
      hasData: !!this.weatherData,
      error: this.error,
    });
  }

  async loadWeather(): Promise<void> {
    console.log('[WeatherComponent] loadWeather start');
    this.loading = true;
    this.error = null;
    this.weatherData = null;
    console.log('[WeatherComponent] state after reset', {
      loading: this.loading,
      hasData: !!this.weatherData,
      error: this.error,
    });

    try {
      console.log('[WeatherComponent] awaiting WeatherService.getWeather()');
      const data = await firstValueFrom(this.weatherService.getWeather());
      console.log('[WeatherComponent] data received', data);
      this.weatherData = data;
    } catch (err) {
      const error = err as Error;
      console.error('[WeatherComponent] loadWeather error', error);
      this.error = error.message ?? 'Unexpected error while loading weather data';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
      console.log('[WeatherComponent] loadWeather finally', {
        loading: this.loading,
        hasData: !!this.weatherData,
        error: this.error,
      });
    }
  }

  onHourlyWheel(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement | null;
    if (!container) {
      return;
    }

    if (container.scrollWidth <= container.clientWidth) {
      return;
    }

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    container.scrollLeft += delta;
    event.preventDefault();
  }

}
