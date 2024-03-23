import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  public add<T>(apiUrl: string, itemName: any): Observable<T> {
    return this.http.post<T>(apiUrl, itemName);
  }

  public getAll<T>(apiUrl: string): Observable<T> {
    return this.http.get<T>(apiUrl)
  }

  public getById<T>(apiUrl: string, id: any): Observable<T> {
    return this.http.get<T>(apiUrl + '/' + id)
  }

  public update<T>(apiUrl: string, itemToUpdate: any): Observable<T> {
    return this.http.put<T>(apiUrl, itemToUpdate);
  }

  public delete<T>(apiUrl: string, id: any) {
    return this.http.delete<T>(apiUrl + '/' + id);
  }

  public post<T>(apiUrl: string, payload: any) {
    return this.http.post<T>(apiUrl, payload)
  }

}
