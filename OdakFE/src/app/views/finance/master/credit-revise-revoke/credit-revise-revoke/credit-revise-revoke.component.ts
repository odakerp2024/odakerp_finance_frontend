import { Table } from './../../../../../model/financeModule/credit';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PaginationService } from 'src/app/pagination.service';
import { DataService } from 'src/app/services/data.service';
import { CreditReviseRevokeService } from 'src/app/services/financeModule/credit-revise-revoke.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-revise-revoke',
  templateUrl: './credit-revise-revoke.component.html',
  styleUrls: ['./credit-revise-revoke.component.css'],
  providers: [DatePipe]
})
export class CreditReviseRevokeComponent implements OnInit {
  // * pagination start
  pager: any = {};// pager object  
  pagedItems: any[];// paged items
  // * pagination end

  creditFilter: FormGroup;
 // minDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  validTillMinDate: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  entityDateFormat = this.commonService.getLocalStorageEntityConfigurable('DateFormat')
  reviseRevokeFilterForm: any;
  creditReviseRevokeList: any;
  divisionList: any[];
  officeList: any[];
  creditLimit: any[];
  ApplictionStatusList = [];
  CustomerList = [];
  CustomerBranchList = [];
  SalesPersonList = [];
  ApplicationTypeList = [];



  constructor(private datePipe: DatePipe,
    private router: Router,
    private creditReviseRevokeService: CreditReviseRevokeService,
    private fb: FormBuilder,
    private ps: PaginationService,
    private globals: Globals,
    private dataService: DataService,
    public commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.getDropdown();
    this.createCreditApplicationForm();
    this.getList();
    this.getDivision();
    this.getOfficeList();
    this.getCustomerCredit()
  }

  // Create a FormGroup for a single object
createCreditApplicationForm() {
  this.reviseRevokeFilterForm =  this.fb.group({
    DivisionId: [0],
    OfficeId: [0],
    ApplicationNumber: [''],
    ApplicationDate: [''],
    CustomerId: [0],
    // CustomerBranchId: [''],
    CreditLimitDays: [''],
    CreditLimitAmount: [''],
    SalesPersonId: [0],
    StatusId: [0],
    CustomerBranchId: [0],
    ApplicationType:[0],
    StartDate : [''],
    EndDate :['']
  });
}

editCreditApplication(Id) {
    const userID = localStorage.getItem("UserID");
    const paylod = {
      userID: Number(userID),
      Ref_Application_Id: "4",
      SubfunctionID: 497,
    }
    this.commonService.GetUserPermissionObject(paylod).subscribe(data => {
      if (data.length > 0) {
        console.log("PermissionObject", data);

        if (data[0].SubfunctionID == paylod.SubfunctionID) {

          if (data[0].Update_Opt != 2) {
            Swal.fire('Please Contact Administrator');
          }
          else {
            this.router.navigate(['views/credit-Review-info/credit-info-view',
            {'Id': Id}]);
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

  getList(){
    const payload = this.reviseRevokeFilterForm.value;
    this.creditReviseRevokeService.getListAndFilter(payload)
    .subscribe((result: any) => {
      if(result.message == 'Success'){
        this.creditReviseRevokeList = result.data.Table;
        this.setPage(1);
      }
    })
  }

  clearFilter()  {
    this.pager = {}
    this.createCreditApplicationForm();
    this.getList();
  }

  applyFilter(){
    this.pager = {}
    this.getList();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.creditReviseRevokeList.length, page);
    // get current page of item
    this.pagedItems = this.  creditReviseRevokeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getDivision() {
    return new Promise((resolve, rejects) => {
      this.commonService.getDivision({}).subscribe((result: any) => {
        this.divisionList = [];
        if (result.data.Table.length > 0) {
          this.divisionList = result.data.Table;
          resolve(true);
        }
      }, error => { 
        rejects(true)
      });;
    });
  }

  getOfficeList() {
    this.commonService.getOffice({}).subscribe((result: any) => {
      this.officeList = [];
      if (result.message == 'Success' && result.data.Office.length > 0) {
        this.officeList = result.data.Office.filter(x => x.Active == true);
      }
    }, error => { });
  }

  getCustomerCredit() {
    this.commonService.getCustomerCreditList({}).subscribe((result: any) => {
      if(result.message == 'Success') {
        this.creditLimit = result.data.Table;
      }
    })
  }

  getCustomerList(){
    
    this.commonService.getCustomerList({}).subscribe((result: any) => {

    })
  }

getDropdown(){
    this.creditReviseRevokeService.getDropdown({}).subscribe((result: any) => {
      if (result.message == 'Success' ){
        this.ApplictionStatusList = result.data.Table;
        this.CustomerList = result.data.Table2;
        this.CustomerBranchList = result.data.Table3;
        this.ApplicationTypeList = result.data.Table1;
        // this.SalesPersonList = result.data.Table;
      }
    })
  }

  getSalesList(){
    // this.reviseRevokeFilterForm.value.CustomerBranchId
    const payload = {
      CustomerBranchId: 3
    };

    this.creditReviseRevokeService.getSalesPerson(payload).subscribe((result: any) => {
      if (result.message == 'Success' ){
        this.SalesPersonList = result.data.Table;
      }
    });
  }

}
