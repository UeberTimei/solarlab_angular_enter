import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { GoogleMapsModule } from '@angular/google-maps';
import { Search } from '../search/search';
import { WeatherCard } from '../weather-card/weather-card';
import { Map } from '../map/map';
import { SavedLocations } from '../saved-locations/saved-locations';

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
  coord: { lon: number; lat: number };
}

interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, Search, WeatherCard, Map, SavedLocations],
  template: `
    <div class="container">
      <h1>Погодное приложение 🌤️</h1>
      <app-search
        (locationSelected)="fetchWeather($event.lat, $event.lon)"
        (detectLocation)="detectLocation()"
      ></app-search>
      <div *ngIf="isLoading" class="message info">Загрузка...</div>
      <div *ngIf="errorMessage" class="message error">{{ errorMessage }}</div>
      <app-weather-card
        *ngIf="weather"
        [weather]="weather"
        (saveLocation)="saveLocation($event)"
      ></app-weather-card>
      <app-map *ngIf="weather" [center]="mapCenter"></app-map>
      <app-saved-locations
        [locations]="savedLocations"
        (locationSelected)="fetchWeather($event.lat, $event.lon)"
        (locationRemoved)="removeLocation($event)"
      ></app-saved-locations>
    </div>
  `,
  styles: `
    :host { display: block; }
    .container { max-width: 600px; margin: auto; }
    h1 { text-align: center; color: #333; margin-bottom: 20px; }
    .message { padding: 10px; margin-bottom: 15px; border-radius: 5px; text-align: center; }
    .info { background-color: #eaf2fa; color: #3c76a5; }
    .error { background-color: #f8d7da; color: #721c24; }
  `,
})
export class Weather implements OnInit {
  weather: WeatherData | null = null;
  savedLocations: SavedLocation[] = [];
  isLoading = false;
  errorMessage = '';
  mapCenter: google.maps.LatLngLiteral = { lat: 51.5, lng: -0.12 };

  private readonly LS_KEY = 'savedWeatherLocations';

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.loadSavedLocations();
  }

  fetchWeather(lat: number, lon: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.weather = null;

    this.apiService.getWeatherByCoords(lat, lon).subscribe((data) => {
      this.isLoading = false;
      if (data) {
        this.weather = data;
        this.mapCenter = { lat: data.coord.lat, lng: data.coord.lon };
      } else {
        this.errorMessage =
          'Не удалось получить данные о погоде. Попробуйте снова.';
      }
    });
  }

  detectLocation(): void {
    if (navigator.geolocation) {
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.fetchWeather(latitude, longitude);
        },
        () => {
          this.isLoading = false;
          this.errorMessage =
            'Не удалось определить ваше местоположение. Проверьте разрешения в браузере.';
        }
      );
    } else {
      this.errorMessage = 'Геолокация не поддерживается вашим браузером.';
    }
  }

  saveLocation(weather: WeatherData): void {
    const newLocation: SavedLocation = {
      name: weather.name,
      lat: weather.coord.lat,
      lon: weather.coord.lon,
    };

    if (!this.savedLocations.some((loc) => loc.name === newLocation.name)) {
      this.savedLocations.push(newLocation);
      this.updateLocalStorage();
    } else {
      alert('Это место уже сохранено!');
    }
  }

  removeLocation(locationToRemove: SavedLocation): void {
    this.savedLocations = this.savedLocations.filter(
      (loc) => loc.name !== locationToRemove.name
    );
    this.updateLocalStorage();
  }

  private loadSavedLocations(): void {
    const data = localStorage.getItem(this.LS_KEY);
    if (data) {
      this.savedLocations = JSON.parse(data);
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem(this.LS_KEY, JSON.stringify(this.savedLocations));
  }
}
