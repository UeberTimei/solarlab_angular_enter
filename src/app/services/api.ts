import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private daDataUrl =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  private weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getCitySuggestions(query: string): Observable<any> {
    if (!query || query.trim() === '') {
      return of({ suggestions: [] });
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${environment.daDataApiKey}`,
        'X-Secret': environment.daDataSecretKey,
      }),
    };
    const body = {
      query: query,
      from_bound: { value: 'city' },
      to_bound: { value: 'city' },
    };

    return this.http
      .post<any>(this.daDataUrl, body, httpOptions)
      .pipe(catchError(() => of({ suggestions: [] })));
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', environment.openWeatherApiKey)
      .set('units', 'metric')
      .set('lang', 'ru');

    return this.http
      .get<any>(this.weatherUrl, { params })
      .pipe(catchError(() => of(null)));
  }
}
