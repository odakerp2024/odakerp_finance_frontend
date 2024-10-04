import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { GridSort, Image_List, Status, StatusView } from 'src/app/model/common';
import { Vendorlist } from 'src/app/model/financeModule/Vendor';
import { PaginationService } from 'src/app/pagination.service';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';
import { VendorService } from 'src/app/services/financeModule/vendor.service';
import { MastersService } from 'src/app/services/masters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendorsview',
  templateUrl: './vendorsview.component.html',
  styleUrls: ['./vendorsview.component.css']
})

export class VendorsviewComponent implements OnInit {

  /*Variable */
  title = 'Vendor List';
  fg: FormGroup;

  Is_DataFound: Boolean = true;
  imagenotfound: any = new Image_List().Not_Found_for_List;
  pagesort: any = new GridSort().sort;

  allItems: Vendorlist[] = [];// array of all items to be paged  
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  searchData: Vendorlist = new Vendorlist();
  statusvalues: Status[] = new StatusView().statusvalues;
  // cityList: any;
  gstCategoryList: any[];
  categoryList: any;
  // FillCompanyStatus: any;
  onboardStatusList: any;
  stateList : any;
  //ps: any;
  constructor(private fb: FormBuilder, private ms: MastersService, private titleService: Title, private vendorservice: VendorService
    , public ps: PaginationService, private commonservice: CommonService, private VendorService: VendorService, private globals: Globals,
    private dataService: DataService, private router: Router) {
    // this.getCity();
  }

  checkAddPermission(route, CustomerID, CustomerBranchID, City) {

    if (route == 'add') {
      this.getPermissionListForCreate(557);
    } else if (route == 'edit') {
      this.getPermissionListForCreate(557, CustomerID, CustomerBranchID, City, route);
    }
  }

  getPermissionListForCreate(value, CustomerID: string = '', CustomerBranchID: string = '',City: string = '', route: string = '') {

    // Check Permission for Division Add
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: value
    }
    this.commonservice.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt == 2 && route == '') {
            this.router.navigate(['views/finance/Vendor']);
          } else if (data[0].Update_Opt == 2 && route == 'edit') {
            this.router.navigate(['views/finance/Vendor', { Vendor_ID: CustomerID, Vendor_BranchID: CustomerBranchID, Vendor_CityName: CustomerBranchID }]);
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
    // this.getCity();
    this.getStateList();
    this.getGSTCategory();
    this.getCategoryList();
    // this.OnBindCompanyStatus();
    this.getOnBoard()
  }

  createForm() {
    this.fg = this.fb.group({
      ID: 0,
      VendorBranchID: '',
      VendorCode: '',
      VendorName: '',
      Category: '',
      BranchCode: '',
      CityName: '',
      GSTCategory: '',
      GSTNumber: '',
      IsActive: '',
      VendorStatus: '',
      OnBoard: '',
      IsBranchActive: ''
    });
  }

  clearSearch() {
    this.createForm();
    this.CustomerList();
  }

  onSubmit() {
    const payload = this.fg.value;
    if (this.fg.value.IsActive) {
      payload.IsActive = this.fg.value.IsActive == 'true' || this.fg.value.IsActive == true ? '1' : '0';
    }
    // payload.Category = this.fg.value.Category == 'true' || this.fg.value.Category == true ? 1 : 0;
    if(this.fg.value.IsBranchActive){
      payload.IsBranchActive = this.fg.value.IsBranchActive == 'true' || this.fg.value.IsBranchActive == true ? '1' : '0';
    }

    // payload.VendorStatus = this.fg.value.VendorStatus == 'true' ? 1 : 0; // asl op
    this.vendorservice.getVendorFilter(payload).subscribe(data => {
      if (data["data"].Table.length == 0) { this.Is_DataFound = false; }
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
    this.vendorservice.getVendorList(this.fg.value).subscribe(data => {
      if (data["data"].Table.length == 0) { this.Is_DataFound = false; }
      else {
        this.Is_DataFound = true;
        console.log(data['data'].Table)
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
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.ps.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  sort(property) {
    this.pagesort(property, this.pagedItems);
  }

  //#region Dropdown onChange
  // getCity() {
  //   var queryParams = { "countryID": '', "stateID": '' };
  //   this.commonservice.getCities(queryParams).subscribe(data => {
  //     this.cityList = data['data'].sort(function (a, b) {
  //       return a.CityName.localeCompare(b.CityName);
  //     });
  //   });
  // }

  getStateList() {
    var service = `${this.globals.SaApi}/SystemAdminApi/GetCities`; var payload: any = { countryID: 0, stateID: 0 }
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.stateList = [];
      if (result.length > 0) {
        this.stateList = result;
      }
    }, error => { });
  }

  getGSTCategory() {
    this.VendorService.getGstCategory({}).subscribe((result: any) => {
      this.gstCategoryList = [];
      if (result.data.Table.length > 0) {
        this.gstCategoryList = result.data.Table;
      }
    });
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

  // OnBindCompanyStatus() {
  //   this.commonservice.getCompanyStatus().subscribe(data => {
  //     this.FillCompanyStatus = data['data'];
  //   });
  // }

  getOnBoard() {
    this.VendorService.getOnboardingStatus({}).subscribe((response) => {
      this.onboardStatusList = response['data'].Table;
    });
  }


}
