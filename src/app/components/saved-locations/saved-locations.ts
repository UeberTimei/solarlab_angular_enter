import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-saved-locations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="locations.length > 0" class="saved-locations">
      <h3>Сохраненные места</h3>
      <ul>
        <li *ngFor="let location of locations">
          <span>{{ location.name }}</span>
          <div class="buttons">
            <button (click)="selectLocation(location)">Показать</button>
            <button (click)="removeLocation(location)" class="remove-btn">
              Удалить
            </button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: `
    .saved-locations h3 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .saved-locations ul { list-style: none; padding: 0; }
    .saved-locations li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f0f0f0; }
    .saved-locations .buttons button { margin-left: 10px; padding: 5px 10px; cursor: pointer; border: 1px solid #ccc; border-radius: 5px; background: #fff; }
    .saved-locations .remove-btn { border-color: #dc3545; color: #dc3545; }
  `,
})
export class SavedLocations {
  @Input() locations: SavedLocation[] = [];
  @Output() locationSelected = new EventEmitter<SavedLocation>();
  @Output() locationRemoved = new EventEmitter<SavedLocation>();

  selectLocation(location: SavedLocation): void {
    this.locationSelected.emit(location);
  }

  removeLocation(location: SavedLocation): void {
    this.locationRemoved.emit(location);
  }
}
