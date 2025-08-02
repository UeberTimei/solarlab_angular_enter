import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherCard } from './components/weather-card/weather-card';
import { Weather } from './components/weather/weather';

@Component({
  selector: 'app-root',
  imports: [Weather],
  template: ` <app-weather></app-weather> `,
  styles: [
    `
      :host {
        display: block;
        font-family: sans-serif;
        padding: 20px;
        background-color: #f4f7f9;
        min-height: 100vh;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('weather-app');
}
