import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from '../globals';
import { Port, StorageLoactionMaster } from 'src/app/model/StorageLocation';

@Injectable({
  providedIn: 'root'
})
  export class StorageLocationService {
    group: any;

    constructor(private http: HttpClient, private globals: Globals) { }
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
    getPortMasterBind(OL: Port): Observable<Port[]> {
    
        return this.http.post<Port[]>(this.globals.APIURL + '/StorageLocation/PortCodeMasterBind', OL);
    }
    getSaveStoragealocation(OL: StorageLoactionMaster): Observable<StorageLoactionMaster[]> {
      
        return this.http.post<StorageLoactionMaster[]>(this.globals.APIURL + '/StorageLocation/SaveStoragealocation', OL);
    }
    getStorageLocationList(OL: StorageLoactionMaster): Observable<StorageLoactionMaster[]> {
       
        return this.http.post<StorageLoactionMaster[]>(this.globals.APIURL + '/StorageLocation/StorageLocationList', OL);
    }
    getStorageLocationEdit(OL: StorageLoactionMaster): Observable<StorageLoactionMaster[]> {

        return this.http.post<StorageLoactionMaster[]>(this.globals.APIURL + '/StorageLocation/StorageLocationEdit', OL);
    }
}
