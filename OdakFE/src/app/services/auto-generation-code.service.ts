import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AutoGenerationCodeService {

  constructor(
    private http: HttpClient,
    private globals: Globals,
    private datePipe: DatePipe
  ) { }
  public authToken = "";

  loadToken() {
    const token = localStorage.getItem('Token');
    this.authToken = token;
  }
  createAuthHeader() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return { headers };
  }

  getNumberRangeList(OL: any): Observable<any> {
    return this.http.post<any>(this.globals.APIURL + '/COAType/GetNumberRangeCodeGenerator', { Id: 0, ObjectId: 0 }).pipe(
      map(ranges => {
        const transformedData = ranges.data.Table.map(range => ({
          ...range,
          EffectiveDate: this.datePipe.transform(range.EffectiveDate, 'YYYY-MM-dd'),
        }));
        return { ...ranges, data: { Table: transformedData } }
      })
    )
  }

}
