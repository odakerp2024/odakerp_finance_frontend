import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor(
    private dataService: DataService,
    private globals: Globals
  ) { }


  getCategoryList() {
    let service = `${this.globals.APIURL}/Organization/GetCategoryList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        return result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }
}
