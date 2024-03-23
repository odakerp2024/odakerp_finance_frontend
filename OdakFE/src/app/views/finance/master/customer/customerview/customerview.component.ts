import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { Country, GridSort, Image_List, Status, StatusView } from 'src/app/model/common';
import { Customerlist } from 'src/app/model/financeModule/Customer';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { CustomerService } from 'src/app/services/financeModule/customer.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customerview',
  templateUrl: './customerview.component.html',
  styleUrls: ['./customerview.component.css']
})
export class CustomerviewComponent implements OnInit {

  /*Variable */
  title = 'Customer List';
  fg: FormGroup;

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;

  allItems: Customerlist[] = [];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  searchData: Customerlist = new Customerlist();

  statusvalues: Status[] = new StatusView().statusvalues;
  onBoardList: any = [];
  FillCompanyStatus: any;
  stateList: any;
  GSTCategoryList: any[];
  categoryList: any;
  //ps: any;

  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, private customerservice: CustomerService
    , private globals: Globals, private dataService: DataService
    , public ps: PaginationService, private commonservice: CommonService,
    private router: Router) {

  }

  checkAddPermission(route, CustomerID, CustomerBranchID) {

    if (route == 'add') {
      this.getPermissionListForCreate(548);
    } else if (route == 'edit') {
      this.getPermissionListForCreate(548, CustomerID, CustomerBranchID, route);
    }
  }

  getPermissionListForCreate(value, CustomerID: string = '', CustomerBranchID: string = '', route: string = '') {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonservice.GetUserPermissionObject(paylod).subscribe(data => {
      debugger
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route == '') {
            this.router.navigate(['views/finance/Customer']);
          } else if (data[0].Update_Opt == 2 && route == 'edit') {
            this.router.navigate(['views/finance/Customer', { customer_ID: CustomerID, customer_BranchID: CustomerBranchID }]);
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
    this.getStateList();
    this.getOnboardingList();
    this.OnBindCompanyStatus();
    this.titleService.setTitle(this.title);
    this.clearSearch();
    this.GetGSTCategory()
    this.getCategoryList();
  }

  createForm() {
    this.fg = this.fb.group({
      CustomerCode: '',
      CustomerName: '',
      Category: '',
      BranchCode: '',
      CityName: '',
      GSTCategory: '',
      GSTNumber: '',
      IsActive: '',
      CompanyStatus: '',
      OnBoard: ''
    });
  }


  clearSearch() {
    this.createForm();
    this.CustomerList();
  }

  onSubmit() {

    this.customerservice.getCustomerFilter(this.fg.value).subscribe(data => {
      if (data['data'].Table.length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data["data"].Table;
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  CustomerList() {
    this.customerservice.getCustomerList(this.fg.value).subscribe(data => {
      this.allItems = [];
      this.pagedItems = [];
      if (data['data'].Table.length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        this.allItems = data['data'].Table;
        this.setPage(1);
      }
    },
      (error: HttpErrorResponse) => {
        Swal.fire(error.message, 'error')
        this.Is_DataFound = false;
      });
  }

  async setPage(page: number) {
    if (page < 1) {
      return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  getOnboardingList() {
    var service = `${this.globals.APIURL}/Customer/GetOnBoardList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.onBoardList = [];
      if (result.data.Table.length > 0) {
        this.onBoardList = result.data.Table;
      }
    }, error => { });
  }

  OnBindCompanyStatus() {
    this.commonservice.getCompanyStatus().subscribe(data => {
      this.FillCompanyStatus = data['data'];
    });
  }

  getStateList() {
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCities`; var payload: any = { countryID: 0, stateID: 0 }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.stateList = [];
      if (result.length > 0) {
        this.stateList = result;
      }
    }, error => { });
  }

  GetGSTCategory() {
    var service = `${this.globals.APIURL}/Customer/GetGSTCategory`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.GSTCategoryList = [];
      if (result.data.Table.length > 0) {
        this.GSTCategoryList = result.data.Table;
      }
    }, error => { });
  }

  getCategoryList() {
    const URL = `${this.globals.APIURL}/Organization/GetCategoryList`;
    this.dataService.post(URL, {}).subscribe((result: any) => {
      if (result.data.Table.length > 0) {
        this.categoryList = result.data.Table;
      }
    }, error => {
      console.error(error);
    });
  }

}

