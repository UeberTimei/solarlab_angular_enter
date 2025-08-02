import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
  coord: { lon: number; lat: number };
}

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-card">
      <div class="weather-header">
        <h2>{{ weather.name }}</h2>
        <button (click)="emitSaveLocation()" class="save-button">
          ⭐ Сохранить
        </button>
      </div>
      <div class="weather-body">
        <div class="weather-main">
          <img
            [src]="
              'https://openweathermap.org/img/wn/' +
              weather.weather[0].icon +
              '@2x.png'
            "
            alt="weather icon"
            class="weather-icon"
          />
          <span class="temp">{{ weather.main.temp | number : '1.0-0' }}°C</span>
          <span class="description">{{ weather.weather[0].description }}</span>
        </div>
        <div class="weather-details">
          <p><strong>Влажность:</strong> {{ weather.main.humidity }}%</p>
          <p><strong>Ветер:</strong> {{ weather.wind.speed }} м/с</p>
          <p><strong>Давление:</strong> {{ weather.main.pressure }} гПа</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .weather-card { background: #f5f5f5; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 20px; }
    .weather-header { display: flex; justify-content: space-between; align-items: center; background-color: green; color: white; padding: 10px 20px; }
    .weather-header h2 { margin: 0; font-size: 22px; }
    .save-button { background: #ffc107; color: #333; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; }
    .weather-body { display: flex; align-items: center; padding: 20px; }
    .weather-main { text-align: center; flex: 1; }
    .weather-main img { width: 100px; height: 100px; }
    .temp { font-size: 48px; font-weight: bold; display: block; }
    .description { text-transform: capitalize; color: black; }
    .weather-details { flex: 1; padding-left: 20px; border-left: 1px solid #eee; }
    .weather-details p { margin: 10px 0; }
    .weather-icon { background: #ffc107; border-radius: 50%; padding: 5px; }
  `,
})
export class WeatherCard {
  @Input() weather!: WeatherData;
  @Output() saveLocation = new EventEmitter<WeatherData>();

  emitSaveLocation(): void {
    this.saveLocation.emit(this.weather);
  }
}
