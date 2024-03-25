import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { GridSort } from 'src/app/model/common';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-exchange-rate-pair',
  templateUrl: './exchange-rate-pair.component.html',
  styleUrls: ['./exchange-rate-pair.component.css']
})
export class ExchangeRatePairComponent implements OnInit {


  exchangeRateFilter: FormGroup;
  StatusList: Array<Object> = [{ value: '1', viewValue: 'Yes' }, { value: '0', viewValue: 'No' }];
  exchangeList: any[];
  pager: any = {};
  pagedItems: any;
  pagesort: any = new GridSort().sort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private globals: Globals,
    public ps: PaginationService,
    private CommonService: CommonService
  ) { }

  checkAddPermission(route, id) {
    this.getPermissionListForCreate(609, route, id);
  }

  getPermissionListForCreate(value, route, id) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route != 'edit') {
            this.router.navigate(['/views/exchange-add-info/exchange-ratePair-add']);
          } else if (data[0].Update_Opt == 2 && route == 'edit') {
            this.router.navigate(['/views/exchange-add-info/exchange-ratePair-add', { isUpdate: true, id: id }]);
          } else {
            Swal.fire('Please Contact Administrator');
          }
        }
      } else {
        Swal.fire('Please Contact Administrator');
      }

    }, err => {
      console.log('errr----->', err.message);
    });
  }


  ngOnInit(): void {
    this.createExchangeRateForm();
    this.getExchangeList();
  }

  createExchangeRateForm() {
    this.exchangeRateFilter = this.fb.group({
      exchangeRateID: [0],
      FromCurrency: [''],
      ToCurrency: [''],
      Active: ['']
    });
  }
  

  addExchange() {
    this.router.navigate(['/views/exchange-add-info/exchange-ratePair-add']);
  }

  getExchangeList(filter?: string) {
    var service = `${this.globals.APIURL}/ExchangeRate/GetExchangeRateList`; var payload: any = this.exchangeRateFilter.value
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.exchangeList = [];
      if (result.data.length > 0) { this.exchangeList = result.data; this.setPage(1) }
      else {
        this.pagedItems = [];
      }
    }, error => { console.error(error) });
  }

  updateRoute(id: number) {
    this.router.navigate(['/views/exchange-add-info/exchange-ratePair-add', { isUpdate: true, id: id }]);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.ps.getPager(this.exchangeList.length, page);

    // get current page of items
    this.pagedItems = this.exchangeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

}
