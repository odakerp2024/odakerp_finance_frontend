import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Globals } from "../globals";
import { DataService } from "./data.service";

@Injectable({providedIn: 'root'})

export class UtilityService {
  constructor(private http: HttpClient,
     private globals: Globals,
     private dataService: DataService
     ) { }
  //  Get the created and updated by user name
  getUserNameById(data: any) {
    return new Promise((resolve, reject) => {
      const service = `${this.globals.APIURL}/UserApi/UserViewRecord`;
      this.dataService.post(service, { ID: data }).subscribe((result: any) => {
        if (result.length > 0) {
          resolve(result[0].UserName);
        }
      }, error => {
        reject('');
      });
    })
  }
}
