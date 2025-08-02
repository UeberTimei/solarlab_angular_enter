import { Component, Input } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  template: `
    <div class="map-container">
      <google-map height="300px" width="100%" [center]="center" [zoom]="zoom">
        <map-marker [position]="center"></map-marker>
      </google-map>
    </div>
  `,
  styles: `
    .map-container { margin-bottom: 20px; border-radius: 10px; overflow: hidden; }
  `,
})
export class Map {
  @Input() center: google.maps.LatLngLiteral = { lat: 51.5, lng: -0.12 };
  zoom = 10;
  isMapLoaded = false;
}
