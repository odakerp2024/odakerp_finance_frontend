import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Console } from 'console';
import { Globals } from 'src/app/globals';
import { Country, GridSort, Image_List, Status, StatusView } from 'src/app/model/common';
import { CurrencyPair } from 'src/app/model/financeModule/ExchangeRate';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { ExchangeRateService } from 'src/app/services/financeModule/exchange-rate.service';
import { FinancialyearService } from 'src/app/services/financeModule/financialyear.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exchange-rateview',
  templateUrl: './exchange-rateview.component.html',
  styleUrls: ['./exchange-rateview.component.css'],
  providers: [DatePipe]
})
export class ExchangeRateviewComponent implements OnInit {

  /*Variable */
  title = 'Exchange Rate';
  fg: FormGroup;
  dscountryItem: Country[];
  FillCurrencyPair: CurrencyPair[];

  private allItems: any[];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;
  statusvalues: Status[] = new StatusView().statusvalues;
  exchangeList: any[];
  entityDateFormat = this.commonDataService.getLocalStorageEntityConfigurable('DateFormat');
  newPager: { totalItems: number; currentPage: number; pageSize: number; totalPages: number; startPage: number; endPage: number; startIndex: number; endIndex: number; pages: any; };

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, public ps: PaginationService
    , private ERService: ExchangeRateService, private dataService: DataService, private globals: Globals, private datePipe: DatePipe,
    private commonDataService: CommonService,
    private router: Router
  ) {
  }

  checkAddPermission(route, id) {
    this.getPermissionListForCreate(611, route, id);
  }


  getPermissionListForCreate(value, route, id) {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonDataService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route != 'edit') {
            this.router.navigate(['views/finance/master/exchangerate']);
          } else if (data[0].Update_Opt == 2 || data[0].Read_Opt == 2 && route == 'edit') {
            this.router.navigate(['/views/finance/master/exchangerate', { isUpdate: true, id: id }]);
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
    this.titleService.setTitle(this.title);
    this.clearSearch();
    this.OnBindDropdownCurrencyPair();
    this.getExchangeList();
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  OnBindDropdownCurrencyPair() {
    this.ERService.getCurrencyPair().subscribe(data => {
      //console.log(data["data"])
      this.FillCurrencyPair = data["data"];
    });
  }

  createForm() {
    this.fg = this.fb.group({
      ExchangeRateId: 0,
      PairId: 0,
      Rate: null,
      //EffectiveDate: [this.datePipe.transform(new Date(), 'dd-MM-y')],
      IsActive: true,
      Status: '',
      StartDate: [''],
      EndDate: ['']

    });
  }

  clearSearch() {
    this.createForm();
    this.FinancialYearList();
  }

  onSubmit() {
    var queryParams = {
      "PairId": this.fg.value.PairId,
      //  "EffectiveDate": this.fg.value.EffectiveDate,
      "StartDate": this.fg.value.StartDate,
      "EndDate": this.fg.value.EndDate,
       "IsActive": 1
    }
    this.ERService.getExchangeRateFilter(queryParams).subscribe(data => {
      if (data["data"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];

        // initialize to page 1
        this.setPage(1);

      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  FinancialYearList() {
    this.ERService.getExchangeRateFilter(this.fg.value).subscribe(data => {
      if (data["data"].length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"];
        // initialize to page 1
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  setPage(page: number) {
    this.newPager = this.ps.getPager(this.allItems.length)
    if (this.newPager.pages.length < page) {

      page = page - 1
    }
    var pag = page ? page : 1
    // get pager object from service
    this.pager = this.ps.getPager(this.allItems.length, pag);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  async getExchangeList() {
    var service = `${this.globals.APIURL}/ExchangeRate/GetExchangeRatePairList`; var payload: any = { Id: 0, FromCurrency: '', ToCurrency: '', Active: 1 }
    await this.dataService.post(service, payload).subscribe((result: any) => {
      this.exchangeList = [];
      if (result.data.length > 0) { this.exchangeList = result.data; }
    }, error => { });
  }

  // updateRoute(exchangeRateID: number) {
  //   this.router.navigate(['/views/finance/master/exchangerate', { isUpdate: true, id: exchangeRateID }]);
  // }

}
