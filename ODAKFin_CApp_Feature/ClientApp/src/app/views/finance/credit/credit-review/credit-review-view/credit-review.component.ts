import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { CustomerService } from 'src/app/services/financeModule/customer.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-review',
  templateUrl: './credit-review.component.html',
  styleUrls: ['./credit-review.component.css']
})
export class CreditReviewComponent implements OnInit {

  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  creditReviewFilter: FormGroup;
  creditList: any = [];
  divisionList: any = [];
  officeList: any = [];
  customerList: any = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private dataService: DataService,
    private ps: PaginationService,
    private customerService: CustomerService,
    private CommonService: CommonService
  ) { }

  ngOnInit(): void {
    this.filterFormCreate();
    this.getCreditReviewList();
    this.getDivisionList();
    this.getOfficeList();
    this.CustomerList();
  }

  filterFormCreate() {
    this.creditReviewFilter = this.fb.group({
      DivisionId: [0],
      OfficeId: [0],
      CustomerId: [0],
      CustomertBranchId: [0],
      CreditLimitAmount: [''],
      CreditLimitDays: ['']
    })
  }

  creditInfoRoute(CreditApplicationId,CustomerId) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 495,
    }
    this.CommonService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Create_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['views/credit-review-info/credit-review-info-view',
            { 'Id': CreditApplicationId, 'CustomerId': CustomerId }]);
          }
        }
        else {
          Swal.fire('Please Contact Administrator');
        }
      }
      else {

        Swal.fire('Please Contact Administrator');
      }
    }, err => {
      console.log('errr----->', err.message);
    });    
  }

  getCreditReviewList() {
    var service = `${this.globals.APIURL}/CreditReview/GetCreditReviewList`;
    this.dataService.post(service, this.creditReviewFilter.value).subscribe((result: any) => {
      this.creditList = [];
      this.pagedItems = [];
      if (result.data.Table.length > 0) {
        this.creditList = result.data.Table;
        this.setPage(1);
      }
    }, error => { });
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) { return; }
    // get pager object from service
    this.pager = this.ps.getPager(this.creditList.length, page);
    // get current page of items
    this.pagedItems = this.creditList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  getDivisionList() {
    var service = `${this.globals.APIURL}/Division/GetOrganizationDivisionList`; var payload: any = {}
    this.dataService.post(service, payload).subscribe((result: any) => {
      this.divisionList = [];
      if (result.data.Table.length > 0) {
        let divisionList = result.data.Table;
        this.divisionList = divisionList.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getOfficeList() {
    var service = `${this.globals.APIURL}/Office/GetOrganizationOfficeList`;
    this.dataService.post(service, {}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  CustomerList() {
    let payload = {
      "CustomerCode": "",
      "CustomerName": "",
      "Category": "",
      "BranchCode": "",
      "CityName": "",
      "GSTCategory": "",
      "GSTNumber": "",
      "IsActive": true,
      "CompanyStatus": "",
      "OnBoard": "CONFIRMED"
    }
    this.customerService.getCustomerList(payload).subscribe((result: any) => {
      this.customerList = [];
      if (result.message == 'Success' && result.data.Table.length > 0) {
        this.customerList = result.data.Table;
      }
    })
  }

}
