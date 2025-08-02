import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Api } from '../../services/api';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        placeholder="Введите название города..."
        [formControl]="searchControl"
        class="search-input"
      />
      <button
        (click)="emitDetectLocation()"
        class="geo-button"
        title="Определить мое местоположение"
      >
        📍
      </button>
      <div
        *ngIf="suggestions$ | async as suggestions"
        [hidden]="!searchControl.getRawValue()"
        class="suggestions-list"
      >
        <div
          *ngFor="let suggestion of suggestions"
          class="suggestion-item"
          (click)="selectCity(suggestion)"
        >
          {{ suggestion.value }}
        </div>
      </div>
    </div>
  `,
  styles: `
    .search-container { position: relative; display: flex; gap: 10px; margin-bottom: 20px; }
    .search-input { flex-grow: 1; padding: 12px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; }
    .geo-button { padding: 0 15px; border: 1px solid #ccc; background: #fff; cursor: pointer; border-radius: 5px; font-size: 20px; }
    .suggestions-list { position: absolute; top: 100%; left: 0; right: 80px; background: white; border: 1px solid #ccc; border-top: none; z-index: 10; border-radius: 0 0 5px 5px; }
    .suggestion-item { padding: 10px; cursor: pointer; }
    .suggestion-item:hover { background-color: #f0f0f0; }
  `,
})
export class Search implements OnInit {
  searchControl = new FormControl('');
  suggestions$: Observable<any[] | null> = of(null);

  @Output() locationSelected = new EventEmitter<{ lat: number; lon: number }>();
  @Output() detectLocation = new EventEmitter<void>();

  constructor(@Inject(Api) private apiService: Api) {}

  ngOnInit(): void {
    this.setupAutocomplete();
  }

  private setupAutocomplete(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query || query.length < 3) {
          return of([]);
        }
        return this.apiService
          .getCitySuggestions(query)
          .pipe(switchMap((response: any) => of(response.suggestions || [])));
      })
    );
  }

  selectCity(suggestion: any): void {
    this.searchControl.setValue(suggestion.value, { emitEvent: false });
    const lat = suggestion.data.geo_lat;
    const lon = suggestion.data.geo_lon;
    if (lat && lon) {
      this.locationSelected.emit({ lat, lon });
    }
    this.searchControl.setValue('', { emitEvent: false });
  }

  emitDetectLocation(): void {
    this.detectLocation.emit();
  }
}
